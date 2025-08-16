using HTC.Backend.Models;
using HTC.Backend.Services;
using MongoDB.Driver;

namespace HTC.Backend.Repositories;

public class ArtistRepository : BaseRepository<Artist>, IArtistRepository
{
    public ArtistRepository(IMongoDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Artist>> GetByStyleAsync(string style)
    {
        return await _collection.Find(x => x.Style == style && !x.Disabled).ToListAsync();
    }

    public async Task<IEnumerable<Artist>> SearchByNameAsync(string name)
    {
        var filter = Builders<Artist>.Filter.Regex(x => x.Name, new MongoDB.Bson.BsonRegularExpression(name, "i"));
        return await _collection.Find(filter & Builders<Artist>.Filter.Eq(x => x.Disabled, false)).ToListAsync();
    }

    public async Task<IEnumerable<Artist>> GetActiveArtistsAsync()
    {
        return await _collection.Find(x => !x.Disabled).ToListAsync();
    }
}