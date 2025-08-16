using HTC.Backend.Models;

namespace HTC.Backend.Repositories;

public interface IKolRepository : IBaseRepository<Kol>
{
    Task<IEnumerable<Kol>> GetActiveKolsAsync();
}