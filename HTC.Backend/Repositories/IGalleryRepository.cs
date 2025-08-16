using HTC.Backend.Models;

namespace HTC.Backend.Repositories;

public interface IGalleryRepository : IBaseRepository<Gallery>
{
    Task<IEnumerable<Gallery>> GetByArtistIdAsync(string artistId);
    Task<IEnumerable<Gallery>> GetTopGalleriesAsync();
    Task<long> GetImageCountByArtistAsync(string artistId);
}