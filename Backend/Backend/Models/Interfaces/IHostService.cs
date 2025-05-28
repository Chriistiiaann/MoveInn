using Backend.Models.Database.Entities;
using Backend.Models.Database.Enum;
using Backend.Models.Dtos;

namespace Backend.Models.Interfaces;

public interface IHostService
{
    Task<Hosts> RequestHostAsync(Guid userId, string reason, List<string> specialtyNames);
    Task<List<HostRequestSummaryDTO>> GetAllRequestsAsync();
    Task<HostRequestSummaryDTO?> GetByIdAsync(Guid id);
    Task ApproveRequestAsync(Guid id);
    Task RejectRequestAsync(Guid id);
    Task<List<HostSummaryDTO>> GetApprovedHostsAsync();
}
