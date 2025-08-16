# HTC Studio Backend - C# .NET 8 Web API

Backend API được migration từ Python Flask sang C# .NET 8 với MongoDB.

## Công nghệ sử dụng

- **Framework**: ASP.NET Core 8 Web API
- **Database**: MongoDB 7.0
- **ORM**: MongoDB.Driver (Official)
- **File Storage**: AWS S3
- **Mapping**: AutoMapper 12.0.1
- **Documentation**: Swagger/OpenAPI
- **Containerization**: Docker

## Cấu trúc dự án

```
HTC.Backend/
├── Controllers/        # API Controllers
├── Models/            # MongoDB Models
├── DTOs/              # Data Transfer Objects  
├── Services/          # Business Logic & External Services
├── Repositories/      # Repository Pattern for MongoDB
├── Configurations/    # Settings & Configuration classes
├── Mappings/         # AutoMapper Profiles
└── Validators/       # FluentValidation (for future use)
```

## API Endpoints

### Artists API
- `GET /api/artists` - Lấy danh sách artists (có pagination)
- `GET /api/artists/{id}` - Lấy artist theo ID
- `GET /api/artists/{id}/images` - Lấy images của artist
- `POST /api/artists` - Tạo artist mới (có upload avatar)
- `PUT /api/artists/{id}` - Cập nhật artist (có upload avatar)
- `DELETE /api/artists/{id}` - Xóa artist

### Galleries API
- `GET /api/galleries` - Lấy danh sách galleries (có pagination)
- `GET /api/galleries/{id}` - Lấy gallery theo ID
- `POST /api/galleries` - Tạo gallery mới (có upload picture)
- `PUT /api/galleries/{id}` - Cập nhật gallery (có upload picture)
- `DELETE /api/galleries/{id}` - Xóa gallery

### KOLs API
- `GET /api/kols` - Lấy danh sách KOLs (có pagination)
- `GET /api/kols/{id}` - Lấy KOL theo ID
- `POST /api/kols` - Tạo KOL mới (có upload avatar)
- `PUT /api/kols/{id}` - Cập nhật KOL (có upload avatar)
- `DELETE /api/kols/{id}` - Xóa KOL

### Teams API
- `GET /api/teams` - Lấy danh sách team members (có pagination)
- `GET /api/teams/{id}` - Lấy team member theo ID
- `POST /api/teams` - Tạo team member mới (có upload avatar)
- `PUT /api/teams/{id}` - Cập nhật team member (có upload avatar)
- `DELETE /api/teams/{id}` - Xóa team member

## Cài đặt và chạy

### Yêu cầu
- .NET 8 SDK
- MongoDB (local hoặc cloud)
- AWS S3 account (cho file upload)

### Chạy development
```bash
cd HTC.Backend
dotnet restore
dotnet run
```

API sẽ chạy tại: http://localhost:5000
Swagger UI: http://localhost:5000/swagger

### Chạy với Docker
```bash
# Từ root directory (HTC_Studio)
docker-compose up --build
```

## Configuration

### appsettings.json
```json
{
  "MongoDbSettings": {
    "ConnectionString": "mongodb://localhost:27017",
    "DatabaseName": "htc_studio"
  },
  "AwsSettings": {
    "AccessKey": "your_aws_access_key",
    "SecretKey": "your_aws_secret_key", 
    "BucketName": "your_s3_bucket",
    "Region": "us-east-1"
  }
}
```

### Environment Variables
- `ASPNETCORE_ENVIRONMENT`: Development/Production
- `MongoDbSettings__ConnectionString`: MongoDB connection string
- `AwsSettings__AccessKey`: AWS Access Key
- `AwsSettings__SecretKey`: AWS Secret Key
- `AwsSettings__BucketName`: S3 Bucket name

## Differences từ Python Flask API

### Schema Changes
- **ID Fields**: MongoDB ObjectId (string) thay vì integer
- **Timestamps**: UTC DateTime thay vì local timestamp
- **File URLs**: Presigned URLs từ S3 thay vì direct URLs

### API Response Format
- **Pagination**: Giữ nguyên format `current_page`, `total_pages`, `datas`, `total_records`
- **Error Handling**: JSON format tương tự Flask
- **Status Codes**: Giữ nguyên HTTP status codes

### Features mới
- **AutoMapper**: Automatic DTO ↔ Model mapping
- **Repository Pattern**: Cleaner data access layer
- **Swagger Documentation**: Interactive API documentation
- **CORS Support**: Configured for React frontend
- **File Upload**: Improved S3 integration

## Migration Notes

1. **Database**: Cần migrate data từ MySQL sang MongoDB
2. **File Storage**: S3 URLs sẽ khác format
3. **Frontend**: Đã update endpoints từ `/artists` → `/api/artists`
4. **Docker**: MongoDB container thay vì MySQL

## Testing

Có thể test API bằng:
- Swagger UI: http://localhost:5000/swagger
- Postman
- Frontend React app