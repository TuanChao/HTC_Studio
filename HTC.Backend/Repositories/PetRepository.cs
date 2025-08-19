using HTC.Backend.Models;
using HTC.Backend.Services;
using MongoDB.Driver;

namespace HTC.Backend.Repositories;

public class PetRepository : BaseRepository<Pet>, IPetRepository
{
    public PetRepository(IMongoDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Pet>> GetActivePetsAsync()
    {
        return await _collection.Find(x => !x.Disabled).ToListAsync();
    }
}