using HTC.Backend.Models;

namespace HTC.Backend.Repositories;

public interface ITeamRepository : IBaseRepository<Team>
{
    Task<IEnumerable<Team>> GetActiveTeamsAsync();
}