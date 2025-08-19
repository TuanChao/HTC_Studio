using HTC.Backend.Models;

namespace HTC.Backend.Repositories;

public interface IPetRepository : IBaseRepository<Pet>
{
    Task<IEnumerable<Pet>> GetActivePetsAsync();
}