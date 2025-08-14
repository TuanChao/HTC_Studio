from flask import Blueprint, request, jsonify
from app.models import Artist, Gallery
from app.utils.s3_utils import upload_file_to_s3, get_presign_url_from_s3
from flasgger import swag_from
from datetime import datetime
from urllib.parse import urlparse
from sqlalchemy.sql import func
from app import db

bp = Blueprint('artist_routes', __name__)


@bp.route('', methods=['POST'], strict_slashes=False)
@swag_from({
    'tags': ['Artists'],
    'parameters': [
        {
            'name': 'name',
            'in': 'formData',
            'type': 'string',
            'required': True,
            'description': 'Name of the artist'
        },
        {
            'name': 'link_x',
            'in': 'formData',
            'type': 'string',
            'required': False,
            'description': 'Link X of the artist'
        },
        {
            'name': 'style',
            'in': 'formData',
            'type': 'string',
            'required': True,
            'description': 'Style of the artist'
        },
        {
            'name': 'x_tag',
            'in': 'formData',
            'type': 'string',
            'required': False,
            'description': 'X tag of the artist'
        },
        {
            'name': 'avatar',
            'in': 'formData',
            'type': 'file',
            'required': False,
            'description': 'Avatar file to upload'
        },
        {
            'name': 'disabled',
            'in': 'formData',
            'type': 'integer',
            'required': False,
            'description': 'Disable status of the artist (0 for false, 1 for true)'
        }
    ],
    'responses': {
        201: {
            'description': 'Artist created successfully',
            'schema': {
                'type': 'object',
                'properties': {
                    'id': {'type': 'integer'},
                    'name': {'type': 'string'},
                    'link_x': {'type': 'string'},
                    'style': {'type': 'string'},
                    'x_tag': {'type': 'string'},
                    'avatar': {'type': 'string'},
                    'disabled': {'type': 'integer'},
                    'created_at': {'type': 'string', 'format': 'date-time'},
                    'updated_at': {'type': 'string', 'format': 'date-time'}
                }
            }
        },
        400: {
            'description': 'Invalid input'
        }
    }
})
def create_artist():
    name = request.form.get('name')
    link_x = request.form.get('link_x')
    style = request.form.get('style')
    x_tag = request.form.get('x_tag')
    disabled = request.form.get('disabled', default=0, type=int)
    s3_url = None

    if not name or not style:
        return jsonify({'error': 'Artist name and style are required'}), 400

    if link_x:
        parsed_url = urlparse(link_x)
        if not all([parsed_url.scheme, parsed_url.netloc]):
            return jsonify({'error': 'Invalid URL format for link_x'}), 400

    data = {
        'name': name,
        'style': style,
        'link_x': link_x,
        'x_tag': x_tag,
        'disabled': bool(disabled)
    }

    try:
        new_artist = Artist.create(data)
        if 'avatar' in request.files:
            file = request.files['avatar']
            if file.filename != '':
                s3_url = upload_file_to_s3(
                    file, location=f"{Artist.__tablename__}/{new_artist.id}")
                new_artist.avatar = s3_url
                new_artist.save()
        return jsonify(new_artist.to_dict()), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400


@bp.route('', methods=['GET'], strict_slashes=False)
@swag_from({
    'tags': ['Artists'],
    'parameters': [
        {
            'name': 'page',
            'in': 'query',
            'type': 'integer',
            'required': False,
            'description': 'Page number for pagination'
        },
        {
            'name': 'per_page',
            'in': 'query',
            'type': 'integer',
            'required': False,
            'description': 'Number of items per page for pagination'
        },
        {
            'name': 'style',
            'in': 'query',
            'type': 'string',
            'required': False,
            'description': 'Filter by style'
        },
        {
            'name': 'name',
            'in': 'query',
            'type': 'string',
            'required': False,
            'description': 'Filter by name'
        },
        {
            'name': 'created_at',
            'in': 'query',
            'type': 'string',
            'required': False,
            'description': 'Filter by creation date (ISO 8601 format)'
        },
        {
            'name': 'order_by',
            'in': 'query',
            'type': 'array',
            'items': {
                'type': 'string'
            },
            'collectionFormat': 'multi',
            'required': False,
            'description': 'Order by fields (e.g., "name:asc", "created_at:desc")'
        }
    ],
    'responses': {
        200: {
            'description': 'List of artists',
            'schema': {
                'type': 'object',
                'properties': {
                    'current_page': {'type': 'integer'},
                    'total_pages': {'type': 'integer'},
                    'datas': {
                        'type': 'array',
                        'items': {
                            'type': 'object',
                            'properties': {
                                'id': {'type': 'integer'},
                                'name': {'type': 'string'},
                                'link_x': {'type': 'string'},
                                'style': {'type': 'string'},
                                'x_tag': {'type': 'string'},
                                'avatar': {'type': 'string'},
                                'total_image': {'type': 'integer'},
                                'disabled': {'type': 'integer'},
                                'created_at': {'type': 'string', 'format': 'date-time'},
                                'updated_at': {'type': 'string', 'format': 'date-time'}
                            }
                        }
                    }
                }
            }
        }
    }
})
def get_artists():
    filters = {'disabled': False}
    style = request.args.get('style')
    name = request.args.get('name')
    created_at = request.args.get('created_at')
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)

    if style:
        filters['style'] = style
    if name:
        filters['name'] = {'like': f'%{name}%'}
    if created_at:
        try:
            created_at = datetime.strptime(created_at, '%Y-%m-%dT%H:%M:%S')
            filters['created_at'] = {'gte': created_at}
        except ValueError:
            return jsonify({'error': 'Invalid created_at format. Use ISO 8601 format.'}), 400

    subquery = db.session.query(
        Gallery.artist_id,
        func.count(Gallery.id).label('total_image')
    ).group_by(Gallery.artist_id).subquery()

    query = db.session.query(
        Artist,
        func.coalesce(subquery.c.total_image, 0).label('total_image')
    ).outerjoin(subquery, Artist.id == subquery.c.artist_id)

    query = query.filter(Artist.disabled == filters['disabled'])

    if 'style' in filters:
        query = query.filter(Artist.style == filters['style'])
    if 'name' in filters:
        query = query.filter(Artist.name.like(filters['name']['like']))
    if 'created_at' in filters:
        query = query.filter(Artist.created_at >= filters['created_at']['gte'])

    total_records = query.count()
    paginated = query.order_by(Artist.created_at.desc()).offset(
        (page - 1) * per_page).limit(per_page).all()

    datas = [
        {
            **artist.to_dict(),
            'total_image': total_image
        }
        for artist, total_image in paginated
    ]
    total_pages = (total_records + per_page - 1) // per_page

    return jsonify({
        'current_page': page,
        'total_pages': total_pages,
        'datas': datas,
        'total_records': total_records
    })


@bp.route('/<int:artist_id>', methods=['GET'])
@swag_from({
    'tags': ['Artists'],
    'parameters': [
        {
            'name': 'artist_id',
            'in': 'path',
            'type': 'integer',
            'required': True,
            'description': 'ID of the artist'
        }
    ],
    'responses': {
        200: {
            'description': 'Artist retrieved successfully',
            'schema': {
                'type': 'object',
                'properties': {
                    'id': {'type': 'integer'},
                    'name': {'type': 'string'},
                    'link_x': {'type': 'string'},
                    'style': {'type': 'string'},
                    'x_tag': {'type': 'string'},
                    'avatar': {'type': 'string'},
                    'disabled': {'type': 'integer'},
                    'created_at': {'type': 'string', 'format': 'date-time'},
                    'updated_at': {'type': 'string', 'format': 'date-time'}
                }
            }
        },
        404: {
            'description': 'Artist not found'
        }
    }
})
def get_artist(artist_id):
    artist = Artist.get(artist_id)
    if not artist:
        return jsonify({'error': 'Artist not found'}), 404
    return jsonify(artist.to_dict()), 200


@bp.route('/<int:artist_id>/images', methods=['GET'])
@swag_from({
    'tags': ['Artists'],
    'parameters': [
        {
            'name': 'artist_id',
            'in': 'path',
            'type': 'integer',
            'required': True,
            'description': 'ID of the artist'
        }
    ],
    'responses': {
        200: {
            'description': 'List of galleries with pictures',
            'schema': {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        'gallery_id': {'type': 'integer'},
                        'pictures': {
                            'type': 'array',
                            'items': {'type': 'string'}
                        }
                    }
                }
            }
        },
        404: {
            'description': 'Artist not found'
        }
    }
})
def get_artist_images(artist_id):
    artist = Artist.get(artist_id)
    if not artist:
        return jsonify({'error': 'Artist not found'}), 404

    result = [
        {
            'id': g.id,
            'picture': get_presign_url_from_s3(g.picture, location=f"Galleries/{g.id}")
        } for g in artist.galleries() if g.picture
    ]

    return jsonify({
        'artist': artist.to_dict(),
        'pictures': result
    }), 200


@bp.route('/<int:artist_id>', methods=['PUT'])
@swag_from({
    'tags': ['Artists'],
    'parameters': [
        {
            'name': 'artist_id',
            'in': 'path',
            'type': 'integer',
            'required': True,
            'description': 'ID of the artist'
        },
        {
            'name': 'avatar',
            'in': 'formData',
            'type': 'file',
            'required': False,
            'description': 'Avatar file of the artist'
        },
        {
            'name': 'name',
            'in': 'formData',
            'type': 'string',
            'required': False,
            'description': 'Name of the artist'
        },
        {
            'name': 'link_x',
            'in': 'formData',
            'type': 'string',
            'required': False,
            'description': 'Link X of the artist'
        },
        {
            'name': 'style',
            'in': 'formData',
            'type': 'string',
            'required': False,
            'description': 'Style of the artist'
        },
        {
            'name': 'x_tag',
            'in': 'formData',
            'type': 'string',
            'required': False,
            'description': 'X tag of the artist'
        },
        {
            'name': 'disabled',
            'in': 'formData',
            'type': 'integer',
            'required': False,
            'description': 'Disable status of the artist (0 for false, 1 for true)'
        }
    ],
    'responses': {
        200: {
            'description': 'Artist updated successfully',
            'schema': {
                'type': 'object',
                'properties': {
                    'id': {'type': 'integer'},
                    'name': {'type': 'string'},
                    'link_x': {'type': 'string'},
                    'style': {'type': 'string'},
                    'x_tag': {'type': 'string'},
                    'avatar': {'type': 'string'},
                    'disabled': {'type': 'integer'},
                    'created_at': {'type': 'string', 'format': 'date-time'},
                    'updated_at': {'type': 'string', 'format': 'date-time'}
                }
            }
        },
        404: {
            'description': 'Artist not found'
        }
    }
})
def update_artist(artist_id):
    artist = Artist.get(artist_id)
    if not artist:
        return jsonify({'error': 'Artist not found'}), 404

    if 'avatar' in request.files:
        file = request.files['avatar']
        if file.filename != '':
            s3_url = upload_file_to_s3(
                file, location=f"{Artist.__tablename__}/{artist_id}")
            artist.avatar = s3_url

    if 'disabled' in request.form:
        disabled = request.form.get('disabled', type=int)
        artist.disabled = bool(disabled)

    artist.save()
    return jsonify(artist.to_dict()), 200


@bp.route('/<int:artist_id>', methods=['DELETE'])
@swag_from({
    'tags': ['Artists'],
    'parameters': [
        {
            'name': 'artist_id',
            'in': 'path',
            'type': 'integer',
            'required': True,
            'description': 'ID of the artist'
        }
    ],
    'responses': {
        200: {
            'description': 'Artist deleted successfully'
        },
        404: {
            'description': 'Artist not found'
        }
    }
})
def delete_artist(artist_id):
    artist = Artist.get(artist_id)
    if not artist:
        return jsonify({'error': 'Artist not found'}), 404
    artist.delete()
    return jsonify({'message': 'Artist deleted'}), 200
