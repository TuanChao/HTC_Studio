using HTC.Backend.Models;
using HTC.Backend.Services;
using MongoDB.Driver;

namespace HTC.Backend.Repositories;

public class TeamRepository : BaseRepository<Team>, ITeamRepository
{
    public TeamRepository(IMongoDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Team>> GetActiveTeamsAsync()
    {
        return await _collection.Find(x => !x.Disabled).ToListAsync();
    }
}