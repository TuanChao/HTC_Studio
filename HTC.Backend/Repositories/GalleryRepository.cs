using HTC.Backend.Models;
using HTC.Backend.Services;
using MongoDB.Driver;

namespace HTC.Backend.Repositories;

public class GalleryRepository : BaseRepository<Gallery>, IGalleryRepository
{
    public GalleryRepository(IMongoDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Gallery>> GetByArtistIdAsync(string artistId)
    {
        return await _collection.Find(x => x.ArtistId == artistId).ToListAsync();
    }

    public async Task<IEnumerable<Gallery>> GetTopGalleriesAsync()
    {
        return await _collection.Find(x => x.ShowOnTop).ToListAsync();
    }

    public async Task<long> GetImageCountByArtistAsync(string artistId)
    {
        return await _collection.CountDocumentsAsync(x => x.ArtistId == artistId);
    }
}