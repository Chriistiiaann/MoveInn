using Backend.Models.Database;
using Backend.Models.Database.Entities;
using Backend.Models.Database.Enum;
using Backend.Models.Dtos;
using Backend.Models.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class HostService : IHostService
    {
        private readonly UnitOfWork _unitOfWork;
        private readonly DataContext _context;

        public HostService(UnitOfWork unitOfWork, DataContext context)
        {
            _unitOfWork = unitOfWork;
            _context = context;
        }

        public async Task<Hosts> RequestHostAsync(Guid userId, string reason, List<string> specialtyNames)
        {
            if (specialtyNames == null || !specialtyNames.Any())
                throw new ArgumentException("Debe indicar al menos una especialidad.");
            if (specialtyNames.Count > 3)
                throw new ArgumentException("Máximo 3 especialidades permitidas.");

            var specialties = new List<Speciality>();
            foreach (var name in specialtyNames)
            {
                var normalized = name.Trim().ToLowerInvariant();
                var sp = await _context.Speciality
                    .FirstOrDefaultAsync(s => s.Name.ToLower() == normalized);

                if (sp == null)
                {
                    sp = new Speciality
                    {
                        Id = Guid.NewGuid(),
                        Name = name.Trim()
                    };
                    _context.Speciality.Add(sp);
                }

                specialties.Add(sp);
            }

            var hostRequest = new Hosts
            {
                UserId = userId,
                Reason = reason,
                CreatedAt = DateTime.UtcNow,
                Status = RequestStatus.Pending,
                Specialties = specialties
            };

            await _unitOfWork.HostRepository.AddAsync(hostRequest);
            return hostRequest;
        }

        public async Task<List<HostRequestSummaryDTO>> GetAllRequestsAsync()
        {
            var hosts = await _unitOfWork.HostRepository.ListRequestsAsync();
            return hosts.Select(h => new HostRequestSummaryDTO
            {
                Id = h.Id,
                Reason = h.Reason,
                UserName = h.User.Name,
                AvatarUrl = h.User.AvatarUrl,
                Status = h.Status,
                HostSince = h.HostSince,
                UpdatedAt = h.UpdatedAt,
                Specialties = h.Specialties.Select(s => s.Name).ToList()
            }).ToList();
        }

        public async Task<HostRequestSummaryDTO?> GetByIdAsync(Guid id)
        {
            var h = await _unitOfWork.HostRepository.GetByIdAsync(id);
            if (h == null) return null;

            return new HostRequestSummaryDTO
            {
                Id = h.Id,
                Reason = h.Reason,
                UserName = h.User.Name,
                AvatarUrl = h.User.AvatarUrl,
                Status = h.Status,
                HostSince = h.HostSince,
                UpdatedAt = h.UpdatedAt,
                Specialties = h.Specialties.Select(s => s.Name).ToList()
            };
        }

        public async Task ApproveRequestAsync(Guid id)
        {
            await _unitOfWork.HostRepository.ApproveAsync(id);
        }

        public async Task RejectRequestAsync(Guid id)
        {
            await _unitOfWork.HostRepository.RejectAsync(id);
        }

        public async Task<List<HostSummaryDTO>> GetApprovedHostsAsync()
        {
            var hosts = await _unitOfWork.HostRepository.ListRequestsAsync();
            return hosts
                .Where(h => h.Status == RequestStatus.Approved)
                .Select(h => new HostSummaryDTO
                {
                    HostId = h.Id,
                    UserId = h.UserId,
                    UserName = h.User.Name,
                    AvatarUrl = h.User.AvatarUrl,
                    HostSince = h.HostSince,
                    Specialties = h.Specialties.Select(s => s.Name).ToList()
                })
                .ToList();
        }
    }
}
