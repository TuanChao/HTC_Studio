using MongoDB.Driver;

namespace HTC.Backend.Services;

public interface IMongoDbContext
{
    IMongoDatabase Database { get; }
    IMongoCollection<T> GetCollection<T>(string? name = null);
}