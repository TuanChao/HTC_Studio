using HTC.Backend.Models;
using HTC.Backend.Services;
using MongoDB.Driver;

namespace HTC.Backend.Repositories;

public class KolRepository : BaseRepository<Kol>, IKolRepository
{
    public KolRepository(IMongoDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Kol>> GetActiveKolsAsync()
    {
        return await _collection.Find(x => !x.Disabled).ToListAsync();
    }
}