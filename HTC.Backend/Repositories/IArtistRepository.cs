using HTC.Backend.Models;

namespace HTC.Backend.Repositories;

public interface IArtistRepository : IBaseRepository<Artist>
{
    Task<IEnumerable<Artist>> GetByStyleAsync(string style);
    Task<IEnumerable<Artist>> SearchByNameAsync(string name);
    Task<IEnumerable<Artist>> GetActiveArtistsAsync();
}