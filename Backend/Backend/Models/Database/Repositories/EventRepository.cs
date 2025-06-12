using Backend.Models.Database.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models.Database.Repositories
{
    public class EventRepository : Repository<Event>
    {
        private readonly DataContext _context;
        public EventRepository(DataContext context) : base(context)
        {
            _context = context;
        }

        public async Task<Event?> GetByIdWithRelationsAsync(Guid id)
        {
            return await _context.Events
                .Include(e => e.Creator)
                .Include(e => e.Participants)
                .SingleOrDefaultAsync(e => e.Id == id);
        }

        public async Task<List<Event>> GetAllWithRelationsAsync()
        {
            return await _context.Events
                .Include(e => e.Creator)
                .Include(e => e.Participants)
                .ToListAsync();
        }

        public async Task<bool> DeleteEventAsync(Guid eventId, Guid userId)
        {
            var ev = await _context.Events
                .FirstOrDefaultAsync(e => e.Id == eventId);

            if (ev == null)
                throw new KeyNotFoundException("This event doesn`t exists");

            if (ev.CreatorId != userId)
                return false;

            _context.Events.Remove(ev);
            var changes = await _context.SaveChangesAsync();
            return changes > 0;
        }

        public async Task<IEnumerable<Event>> GetByUserAsync(Guid userId)
        {
            return await _context.Events
                .Include(e => e.Creator)
                .Include(e => e.Participants)
                .Where(e =>
                    e.CreatorId == userId
                    || e.Participants.Any(p => p.Id == userId)
                )
                .ToListAsync();
        }

        public async Task<IEnumerable<string>> GetAllCountriesAsync()
        {
            return await _context.Events
                .Where(a => !string.IsNullOrEmpty(a.Country))
                .Select(a => a.Country)
                .Distinct()
                .ToListAsync();
        }

        public async Task<IEnumerable<string>> GetCitiesByCountryAsync(string country)
        {
            return await _context.Events
                .Where(a => a.Country == country && !string.IsNullOrEmpty(a.City))
                .Select(a => a.City)
                .Distinct()
                .ToListAsync();
        }

        public async Task<IEnumerable<Event>> GetEventsWhereUserIsParticipatingAsync(Guid userId)
        {
            return await _context.Events
                .Where(e => e.Participants.Any(p => p.Id == userId))
                .ToListAsync();
        }
    }
}
