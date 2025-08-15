import boto3
import os
from werkzeug.utils import secure_filename
from dotenv import load_dotenv

load_dotenv()

AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
S3_BUCKET_NAME = os.getenv('S3_BUCKET_NAME')

s3 = boto3.client('s3', 
                  aws_access_key_id=AWS_ACCESS_KEY_ID, 
                  aws_secret_access_key=AWS_SECRET_ACCESS_KEY)

def upload_file_to_s3(file, location):
    filename = secure_filename(file.filename)
    file_path = os.path.join('/tmp', filename)
    file.save(file_path)
    try:
        s3.upload_file(file_path, S3_BUCKET_NAME, f"{location}/{filename}")
        print(f"File {file_path} uploaded to {S3_BUCKET_NAME}/{filename}")
    except Exception as e:
        print(f"Failed to upload {file_path} to S3: {e}")
        return False
    
    os.remove(file_path)

    return filename


def get_presign_url_from_s3(file_name, location):
    presigned_url = s3.generate_presigned_url('get_object',
                                              Params={'Bucket': S3_BUCKET_NAME,
                                                      'Key': f"{location}/{file_name}"},
                                              ExpiresIn=3600)
    return presigned_url

def delete_file_from_s3(file_name, location):
    try:
        s3.delete_object(Bucket=S3_BUCKET_NAME, Key=f"{location}/{file_name}")
        print(f"File {file_name} deleted from S3")
    except Exception as e:
        print(f"Failed to delete {file_name} from S3: {e}")
        return False

    return True
