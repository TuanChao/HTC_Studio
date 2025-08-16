using HTC.Backend.Configurations;
using HTC.Backend.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace HTC.Backend.Services;

public class MongoDbContext : IMongoDbContext
{
    public IMongoDatabase Database { get; }

    public MongoDbContext(IOptions<MongoDbSettings> settings)
    {
        var client = new MongoClient(settings.Value.ConnectionString);
        Database = client.GetDatabase(settings.Value.DatabaseName);
    }

    public IMongoCollection<T> GetCollection<T>(string? name = null)
    {
        var collectionName = name ?? GetCollectionName<T>();
        return Database.GetCollection<T>(collectionName);
    }

    private static string GetCollectionName<T>()
    {
        var attribute = typeof(T).GetCustomAttributes(typeof(BsonCollectionAttribute), true)
            .FirstOrDefault() as BsonCollectionAttribute;
        
        return attribute?.CollectionName ?? typeof(T).Name.ToLowerInvariant();
    }
}