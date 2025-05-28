using Backend.Models.Database.Entities;
using Backend.Models.Database.Enum;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models.Database.Repositories
{
    public class ReservationRepository : Repository<Reservation>
    {
        private readonly DataContext _context;

        public ReservationRepository(DataContext context) : base(context)
        {
            _context = context;
        }

        public async Task<Reservation?> GetByIdAsync(Guid id)
        {
            return await _context.Reservations.FindAsync(id);
        }
        public async Task<IEnumerable<Reservation>> GetReservationsByAccommodationIdAsync(Guid accommodationId)
        {
            return await _context.Reservations
                .Where(r => r.AccommodationId == accommodationId && r.Status != ReservationStatus.Cancelled)
                .ToListAsync();
        }

        public async Task<IEnumerable<Reservation>> GetAllAsync()
        {
            return await _context.Reservations.ToListAsync();
        }

        public async Task InsertAsync(Reservation reservation)
        {
            await _context.Reservations.AddAsync(reservation);
        }

        public async Task UpdateAsync(Reservation reservation)
        {
            _context.Reservations.Update(reservation);
        }

        public async Task<IEnumerable<Reservation>> GetByUserAsync(Guid userId)
        {
            return await _context.Reservations
                .Include(r => r.Accommodation)
                .Where(r => r.UserId == userId)
                .ToListAsync();
        }

        public async Task<bool> DeleteReservationAsync(Guid reservationId, Guid userId)
        {
            var reservation = await _context.Reservations
                .FirstOrDefaultAsync(r => r.Id == reservationId);

            if (reservation == null)
                throw new KeyNotFoundException("This reservation doesn’t exist");

            if (reservation.UserId != userId)
                return false;

            _context.Reservations.Remove(reservation);
            var changes = await _context.SaveChangesAsync();
            return changes > 0;
        }
    }
}
