from flask import Blueprint, request, jsonify
from app.models import Kols
from app.utils.s3_utils import upload_file_to_s3
from flasgger import swag_from
from datetime import datetime

bp = Blueprint('kols_routes', __name__)


@bp.route('', methods=['GET'], strict_slashes=False)
@swag_from({
    'tags': ['Kols'],
    'parameters': [
        {
            'name': 'name',
            'in': 'query',
            'type': 'string',
            'required': False,
            'description': 'Filter by name'
        },
        {
            'name': 'link_x',
            'in': 'query',
            'type': 'string',
            'required': False,
            'description': 'Filter by link_x'
        },
        {
            'name': 'disabled',
            'in': 'query',
            'type': 'boolean',
            'required': False,
            'description': 'Filter by disabled status'
        },
        {
            'name': 'order_by',
            'in': 'query',
            'type': 'array',
            'items': {
                'type': 'string'
            },
            'collectionFormat': 'multi',
            'description': 'Fields to order by in the format field:direction (e.g., "name:asc", "created_at:desc")'
        }
    ],
    'responses': {
        200: {
            'description': 'List of Kols',
            'schema': {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        'id': {'type': 'integer'},
                        'name': {'type': 'string'},
                        'link_x': {'type': 'string'},
                        'avatar': {'type': 'string'},
                        'disabled': {'type': 'boolean'},
                        'created_at': {'type': 'string', 'format': 'date-time'},
                        'updated_at': {'type': 'string', 'format': 'date-time'}
                    }
                }
            }
        }
    }
})
def get_kols():
    name = request.args.get('name')
    link_x = request.args.get('link_x')
    disabled = request.args.get('disabled')
    order_by = request.args.getlist('order_by')

    filters = {}
    if name:
        filters['name'] = {'like': f'%{name}%'}
    if link_x:
        filters['link_x'] = {'like': f'%{link_x}%'}
    if disabled is not None:
        filters['disabled'] = disabled.lower() == 'true'

    query = Kols.query
    for attr, condition in filters.items():
        if isinstance(condition, dict) and 'like' in condition:
            query = query.filter(getattr(Kols, attr).like(condition['like']))
        elif attr == 'disabled':
            query = query.filter(getattr(Kols, attr) == condition)

    if order_by:
        for order in order_by:
            field, direction = order.split(':')
            if direction == 'asc':
                query = query.order_by(getattr(Kols, field).asc())
            elif direction == 'desc':
                query = query.order_by(getattr(Kols, field).desc())

    kols = query.all()

    return jsonify([kol.to_dict() for kol in kols]), 200


@bp.route('', methods=['POST'], strict_slashes=False)
@swag_from({
    'tags': ['Kols'],
    'parameters': [
        {
            'name': 'name',
            'in': 'formData',
            'type': 'string',
            'required': True,
            'description': 'Name of the Kol'
        },
        {
            'name': 'link_x',
            'in': 'formData',
            'type': 'string',
            'description': 'Link X of the Kol'
        },
        {
            'name': 'avatar',
            'in': 'formData',
            'type': 'file',
            'description': 'Avatar file to upload'
        }
    ],
    'responses': {
        201: {
            'description': 'Kol created successfully',
            'schema': {
                'type': 'object',
                'properties': {
                    'id': {'type': 'integer'},
                    'name': {'type': 'string'},
                    'link_x': {'type': 'string'},
                    'avatar': {'type': 'string'},
                    'disabled': {'type': 'boolean'},
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
def create_kol():
    name = request.form.get('name')
    link_x = request.form.get('link_x')
    avatar = None

    if not name:
        return jsonify({'error': 'Name is required'}), 400

    try:
        data = {'name': name, 'link_x': link_x}
        new_kol = Kols.create(data)

        if 'avatar' in request.files:
            file = request.files['avatar']
            if file.filename != '':
                avatar = upload_file_to_s3(file, f"Kols/{new_kol.id}")
                new_kol.avatar = avatar
                new_kol.save()

        return jsonify(new_kol.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@bp.route('/batch', methods=['POST'], strict_slashes=False)
@swag_from({
    'tags': ['Kols'],
    'parameters': [
        {
            'name': 'records',
            'in': 'body',
            'type': 'array',
            'items': {
                'type': 'object',
                'properties': {
                    'name': {'type': 'string'},
                    'link_x': {'type': 'string'},
                    'avatar': {'type': 'string'}
                }
            },
            'required': True,
            'description': 'List of Kol records to create'
        }
    ],
    'responses': {
        201: {
            'description': 'Kol records created successfully',
            'schema': {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        'id': {'type': 'integer'},
                        'name': {'type': 'string'},
                        'link_x': {'type': 'string'},
                        'avatar': {'type': 'string'},
                        'disabled': {'type': 'boolean'},
                        'created_at': {'type': 'string', 'format': 'date-time'},
                        'updated_at': {'type': 'string', 'format': 'date-time'}
                    }
                }
            }
        },
        400: {
            'description': 'Invalid input'
        }
    }
})
def create_kols_batch():
    records = request.json.get('records', [])
    if not records:
        return jsonify({'error': 'No records provided'}), 400

    created_records = []
    try:
        for record in records:
            if 'name' not in record or not record['name']:
                return jsonify({'error': 'Name is required for all records'}), 400

            new_kol = Kols.create({
                'name': record['name'],
                'link_x': record.get('link_x')
            })
            created_records.append(new_kol.to_dict())

        return jsonify(created_records), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@bp.route('/<int:kol_id>', methods=['GET'])
@swag_from({
    'tags': ['Kols'],
    'parameters': [
        {
            'name': 'kol_id',
            'in': 'path',
            'required': True,
            'type': 'integer',
            'description': 'ID of the Kol'
        }
    ],
    'responses': {
        200: {
            'description': 'Kol retrieved successfully',
            'schema': {
                'type': 'object',
                'properties': {
                    'id': {'type': 'integer'},
                    'name': {'type': 'string'},
                    'link_x': {'type': 'string'},
                    'avatar': {'type': 'string'},
                    'disabled': {'type': 'boolean'},
                    'created_at': {'type': 'string', 'format': 'date-time'},
                    'updated_at': {'type': 'string', 'format': 'date-time'}
                }
            }
        },
        404: {
            'description': 'Kol not found'
        }
    }
})
def get_kol(kol_id):
    kol = Kols.get(kol_id)
    if not kol:
        return jsonify({'error': 'Kol not found'}), 404
    return jsonify(kol.to_dict()), 200


@bp.route('/<int:kol_id>', methods=['PUT'])
@swag_from({
    'tags': ['Kols'],
    'parameters': [
        {
            'name': 'kol_id',
            'in': 'path',
            'required': True,
            'type': 'integer',
            'description': 'ID of the Kol to update'
        },
        {
            'name': 'name',
            'in': 'formData',
            'type': 'string',
            'description': 'Name of the Kol'
        },
        {
            'name': 'link_x',
            'in': 'formData',
            'type': 'string',
            'description': 'Link X of the Kol'
        },
        {
            'name': 'avatar',
            'in': 'formData',
            'type': 'file',
            'description': 'Avatar file to upload'
        }
    ],
    'responses': {
        200: {
            'description': 'Kol updated successfully',
            'schema': {
                'type': 'object',
                'properties': {
                    'id': {'type': 'integer'},
                    'name': {'type': 'string'},
                    'link_x': {'type': 'string'},
                    'avatar': {'type': 'string'},
                    'disabled': {'type': 'boolean'},
                    'created_at': {'type': 'string', 'format': 'date-time'},
                    'updated_at': {'type': 'string', 'format': 'date-time'}
                }
            }
        },
        404: {
            'description': 'Kol not found'
        }
    }
})
def update_kol(kol_id):
    kol = Kols.get(kol_id)
    if not kol:
        return jsonify({'error': 'Kol not found'}), 404

    name = request.form.get('name')
    link_x = request.form.get('link_x')

    if name:
        kol.name = name
    if link_x:
        kol.link_x = link_x

    if 'avatar' in request.files:
        file = request.files['avatar']
        if file.filename != '':
            avatar = upload_file_to_s3(file, f"Kols/{kol.id}")
            kol.avatar = avatar

    kol.save()
    return jsonify(kol.to_dict()), 200


@bp.route('/<int:kol_id>', methods=['DELETE'])
@swag_from({
    'tags': ['Kols'],
    'parameters': [
        {
            'name': 'kol_id',
            'in': 'path',
            'required': True,
            'type': 'integer',
            'description': 'ID of the Kol to delete'
        }
    ],
    'responses': {
        200: {
            'description': 'Kol deleted successfully'
        },
        404: {
            'description': 'Kol not found'
        }
    }
})
def delete_kol(kol_id):
    kol = Kols.get(kol_id)
    if not kol:
        return jsonify({'error': 'Kol not found'}), 404
    kol.delete()
    return jsonify({'message': 'Kol deleted successfully'}), 200
