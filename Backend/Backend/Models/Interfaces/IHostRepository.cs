using Backend.Models.Database.Entities;

namespace Backend.Models.Interfaces;

public interface IHostRepository
{
    Task<Hosts> AddAsync(Hosts host);
    Task<Hosts?> GetByIdAsync(Guid id);
    Task<List<Hosts>> ListRequestsAsync();
    Task ApproveAsync(Guid id);
    Task RejectAsync(Guid id);
    Task<List<User>> ListApprovedHostsAsync();
}
