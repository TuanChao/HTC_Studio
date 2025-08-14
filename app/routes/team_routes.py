from flask import Blueprint, request, jsonify
from app.models import Team
from app.utils.s3_utils import upload_file_to_s3
from flasgger import swag_from
from datetime import datetime


bp = Blueprint('team_routes', __name__)

@bp.route('', methods=['POST'], strict_slashes=False)
@swag_from({
    'tags': ['Teams'],
    'parameters': [
        {
            'name': 'name',
            'in': 'formData',
            'type': 'string',
            'required': True,
            'description': 'Name of the team'
        },
        {
            'name': 'description',
            'in': 'formData',
            'type': 'string',
            'required': False,
            'description': 'Description of the team'
        },
        {
            'name': 'position',
            'in': 'formData',
            'type': 'string',
            'required': False,
            'description': 'Position of the team'
        },
        {
            'name': 'Avatar',
            'in': 'formData',
            'type': 'file',
            'required': False,
            'description': 'Avatar file to upload'
        }
    ],
    'responses': {
        201: {
            'description': 'Team created successfully',
            'schema': {
                'type': 'object',
                'properties': {
                    'id': {'type': 'integer'},
                    'name': {'type': 'string'},
                    'description': {'type': 'string'},
                    'avatar': {'type':'string'},
                    'position': {'type': 'string'},
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
def create_team():
    name = request.form.get('name')
    description = request.form.get('description')
    position = request.form.get('position')

    team = Team(name=name, description=description, position=position)
    try:
        new_team = team.save()
        if 'avatar' in request.files:
            file = request.files['avatar']
            if file.filename != '':
                avatar = upload_file_to_s3(file, f"{Team.__tablename__}/{new_team.id}")
                new_team.avatar = avatar
                new_team.save()
        return jsonify(team.to_dict()), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400


@bp.route('', methods=['GET'], strict_slashes=False)
@swag_from({
    'tags': ['Teams'],
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
            'name': 'name',
            'in': 'query',
            'type': 'string',
            'required': False,
            'description': 'Name of the team'
        },
        {
            'name': 'position',
            'in': 'query',
            'type': 'string',
            'required': False,
            'description': 'Position of the team'
        },
        {
            'name': 'created_at',
            'in': 'query',
            'type': 'string',
            'format': 'date-time',
            'required': False,
            'description': 'Creation date of the team in ISO 8601 format'
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
            'description': 'Fields to order by in the format field:direction'
        }
    ],
    'responses': {
        200: {
            'description': 'List of teams with pagination',
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
                                'description': {'type': 'string'},
                                'position': {'type': 'varchar'},
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
def get_teams():
    filters = {}
    name = request.args.get('name')
    position = request.args.get('position')
    if name:
        filters['name'] = name
    if position:
        filters['position'] = position
    created_at = request.args.get('created_at')
    if created_at:
        try:
            created_at = datetime.strptime(created_at, '%Y-%m-%dT%H:%M:%S')
            filters['created_at'] = {'gte': created_at}
        except ValueError:
            return jsonify({'error': 'Invalid created_at format. Use ISO 8601 format.'}), 400
    
    order_by = []
    order_fields = request.args.getlist('order_by')
    for field in order_fields:
        field_name, direction = field.split(':')
        order_by.append((field_name, direction))
    
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))
    
    teams, total_pages, total_records = Team.paginate(page, per_page, filters, order_by)
    
    return jsonify({
        'current_page': page,
        'total_pages': total_pages,
        'total_records': total_records,
        'datas': [team.to_dict() for team in teams]
    }), 200


@bp.route('/<int:team_id>', methods=['GET'])
@swag_from({
    'tags': ['Teams'],
    'parameters': [
        {
            'name': 'team_id',
            'in': 'path',
            'type': 'integer',
            'required': True,
            'description': 'ID of the team to update'
        },
    ],
    'responses': {
        200: {
            'description': 'Team retrieved successfully',
            'schema': {
                'type': 'object',
                'properties': {
                    'id': {'type': 'integer'},
                    'name': {'type': 'string'},
                    'description': {'type': 'string'},
                    'position': {'type': 'varchar'},
                    'created_at': {'type': 'string', 'format': 'date-time'},
                    'updated_at': {'type': 'string', 'format': 'date-time'}
                }
            }
        },
        404: {
            'description': 'Team not found'
        }
    }
})
def get_team(team_id):
    team = Team.get(team_id)
    if not team:
        return jsonify({'error': 'Team not found'}), 404
    return jsonify(team.to_dict()), 200


@bp.route('/<int:team_id>', methods=['PUT'])
@swag_from({
    'tags': ['Teams'],
    'parameters': [
        {
            'name': 'team_id',
            'in': 'path',
            'type': 'integer',
            'required': True,
            'description': 'ID of the team to update'
        },
        {
            'name': 'file',
            'in': 'formData',
            'type': 'file',
            'required': False,
            'description': 'Avatar file to upload'
        }
    ],
    'responses': {
        200: {
            'description': 'Team updated successfully',
            'schema': {
                'type': 'object',
                'properties': {
                    'id': {'type': 'integer'},
                    'name': {'type': 'string'},
                    'description': {'type': 'string'},
                    'position': {'type': 'varchar'},
                    'created_at': {'type': 'string', 'format': 'date-time'},
                    'updated_at': {'type': 'string', 'format': 'date-time'}
                }
            }
        },
        400: {
            'description': 'Invalid input'
        },
        404: {
            'description': 'Team not found'
        }
    }
})
def update_team(team_id):
    team = Team.get(team_id)
    if not team:
        return jsonify({'error': 'Team not found'}), 404
    
    name = request.form.get('name')
    description = request.form.get('description')
    position = request.form.get('position')

    if name:
        team.name = name
    if description:
        team.description = description
    if position:
            team.position = position
    if 'avatar' in request.files:
        file = request.files['avatar']
        if file.filename != '':
            s3_url = upload_file_to_s3(file, f"{Team.__tablename__}/{team.id}")
            team.avatar = s3_url

    try:
        team.save()
        return jsonify(team.to_dict()), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400


@bp.route('/<int:team_id>', methods=['DELETE'])
@swag_from({
    'tags': ['Teams'],
    'responses': {
        200: {
            'description': 'Team deleted successfully'
        },
        404: {
            'description': 'Team not found'
        }
    }
})
def delete_team(team_id):
    team = Team.get(team_id)
    if not team:
        return jsonify({'error': 'Team not found'}), 404
    team.delete()
    return jsonify({'message': 'Team deleted'}), 200

