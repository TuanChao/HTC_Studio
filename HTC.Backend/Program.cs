using Amazon.S3;
using Amazon.Extensions.NETCore.Setup;
using HTC.Backend.Configurations;
using HTC.Backend.Mappings;
using HTC.Backend.Repositories;
using HTC.Backend.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// MongoDB Configuration (commented out for demo)
// builder.Services.Configure<MongoDbSettings>(
//     builder.Configuration.GetSection("MongoDbSettings"));
// builder.Services.AddSingleton<IMongoDbContext, MongoDbContext>();

// AWS Configuration (commented out for demo)
// builder.Services.Configure<AwsSettings>(
//     builder.Configuration.GetSection("AwsSettings"));
// builder.Services.AddDefaultAWSOptions(builder.Configuration.GetAWSOptions());
// builder.Services.AddAWSService<IAmazonS3>();
// builder.Services.AddScoped<IS3Service, S3Service>();

// Repository Registration (commented out for demo)
// builder.Services.AddScoped<IArtistRepository, ArtistRepository>();
// builder.Services.AddScoped<IGalleryRepository, GalleryRepository>();
// builder.Services.AddScoped<IKolRepository, KolRepository>();
// builder.Services.AddScoped<ITeamRepository, TeamRepository>();

// AutoMapper
builder.Services.AddAutoMapper(typeof(AutoMapperProfile));

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();

app.Run();
