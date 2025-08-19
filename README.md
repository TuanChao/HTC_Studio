# HTC Studio

## Overview
HTC Studio is a full-stack web application built with C# .NET 8 backend and React TypeScript frontend. The platform features artist portfolios, galleries, team management, and admin dashboard with file upload capabilities.

## Tech Stack

### Backend
- **C# .NET 8** - Web API
- **MongoDB** - Database
- **AWS S3** - File storage
- **AutoMapper** - Object mapping

### Frontend  
- **React 18** - UI framework
- **TypeScript** - Type safety
- **React Router** - Client-side routing
- **Redux Toolkit** - State management
- **Bootstrap & Ant Design** - UI components
- **GSAP** - Animations

## Project Structure

```
├── HTC.Backend/          # C# .NET 8 API
│   ├── Controllers/      # API controllers
│   ├── Models/          # Data models
│   ├── Services/        # Business logic
│   └── Repositories/    # Data access layer
├── frontend/            # React TypeScript app
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── apis/        # API calls
│   │   └── routes/      # Routing configuration
└── docker-compose.yml   # Docker configuration
```

## Getting Started

### Prerequisites
- .NET 8 SDK
- Node.js 18+
- MongoDB
- Docker (optional)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/TuanChao/HTC_Studio.git
   cd HTC_Studio
   ```

2. **Backend Setup:**
   ```bash
   cd HTC.Backend
   dotnet restore
   dotnet run
   ```
   Backend runs on `http://localhost:5000`

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm start
   ```
   Frontend runs on `http://localhost:3000`

### Using Docker

```bash
docker-compose up --build
```

## Features

- 🎨 **Artist Portfolios** - Showcase artist works and profiles
- 🖼️ **Gallery Management** - Image galleries with admin controls
- 👥 **Team Management** - Team member profiles and information
- 🏢 **KOL Management** - Key Opinion Leader profiles
- 🔐 **Admin Dashboard** - Full CRUD operations with authentication
- ☁️ **File Upload** - AWS S3 integration for media storage
- 📱 **Responsive Design** - Mobile-friendly interface

## API Endpoints

- `GET/POST /api/artists` - Artist management
- `GET/POST /api/galleries` - Gallery management  
- `GET/POST /api/teams` - Team management
- `GET/POST /api/kols` - KOL management
- `POST /api/upload` - File upload to S3
- `GET /api/dashboard` - Dashboard statistics

## Environment Variables

Create `.env` files:

**Backend (`HTC.Backend/.env`):**
```
MongoDB__ConnectionString=your_mongodb_connection
MongoDB__DatabaseName=htc_studio
AWS__AccessKey=your_aws_access_key
AWS__SecretKey=your_aws_secret_key
AWS__BucketName=your_s3_bucket
```

**Frontend (`frontend/.env`):**
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Deployment

### Backend
- AWS EC2 / App Runner
- MongoDB Atlas

### Frontend
- Netlify / Vercel
- Requires `_redirects` file for SPA routing

## Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License.