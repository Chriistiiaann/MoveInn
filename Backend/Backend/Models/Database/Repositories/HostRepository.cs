using Backend.Models.Database.Entities;
using Backend.Models.Database.Enum;
using Backend.Models.Interfaces;
using Microsoft.EntityFrameworkCore;

public class HostRepository : IHostRepository
{
    private readonly DataContext _context;

    public HostRepository(DataContext context)
    {
        _context = context;
    }

    public async Task<Hosts> AddAsync(Hosts host)
    {
        host.CreatedAt = DateTime.UtcNow;
        _context.Hosts.Add(host);
        await _context.SaveChangesAsync();
        return host;
    }

    public async Task<Hosts?> GetByIdAsync(Guid id)
    {
        return await _context.Hosts
            .Include(h => h.User)
            .Include(h => h.Specialties)
            .FirstOrDefaultAsync(h => h.Id == id);
    }

    public async Task<List<Hosts>> ListRequestsAsync()
    {
        return await _context.Hosts
            .Include(h => h.User)
            .Include(h => h.Specialties)
            .OrderBy(h => h.CreatedAt)
            .ToListAsync();
    }

    public async Task ApproveAsync(Guid id)
    {
        var host = await _context.Hosts.FindAsync(id)
                   ?? throw new KeyNotFoundException($"Host request {id} no encontrado.");

        host.Status = RequestStatus.Approved;
        host.UpdatedAt = DateTime.UtcNow;
        host.HostSince = host.CreatedAt;

        await _context.SaveChangesAsync();
    }

    public async Task RejectAsync(Guid id)
    {
        var host = await _context.Hosts.FindAsync(id)
                   ?? throw new KeyNotFoundException($"Host request {id} not found.");

        _context.Hosts.Remove(host);
        await _context.SaveChangesAsync();
    }

    public async Task<List<User>> ListApprovedHostsAsync()
    {
        return await _context.Hosts
            .Where(h => h.Status == RequestStatus.Approved)
            .Select(h => h.User)
            .ToListAsync();
    }
}