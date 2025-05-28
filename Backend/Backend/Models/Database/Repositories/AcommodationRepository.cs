using Backend.Models.Database.Entities;
using Backend.Models.Dtos;
using Backend.Models.Interfaces;
using Backend.Models.Mappers;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models.Database.Repositories;

public class AccommodationRepository : IAccommodationRepository
{
    private readonly DataContext _context;
    public AccommodationRepository(DataContext context)
    {
        _context = context;
    }

    public async Task InsertAsync(Accommodation accommodation)
    {
        await _context.Accommodations.AddAsync(accommodation);
    }

    public async Task<Accommodation> GetByIdAsync(Guid accommodationId)
    {
        return await _context.Set<Accommodation>()
            .Include(r => r.AccomodationImages)
            .FirstOrDefaultAsync(r => r.Id == accommodationId);
    }

    public async Task<IEnumerable<Accommodation>> GetAllAsync()
    {
        return await _context.Accommodations.Include(a => a.OwnerId).ToListAsync();
    }

    public async Task<IEnumerable<string>> GetAllCountriesAsync()
    {
        return await _context.Accommodations
            .Where(a => !string.IsNullOrEmpty(a.Country))
            .Select(a => a.Country)
            .Distinct()
            .ToListAsync();
    }

    public async Task<IEnumerable<string>> GetCitiesByCountryAsync(string country)
    {
        return await _context.Accommodations
            .Where(a => a.Country == country && !string.IsNullOrEmpty(a.City))
            .Select(a => a.City)
            .Distinct()
            .ToListAsync();
    }

    public async Task UpdateAsync(Accommodation accommodation)
    {
        _context.Accommodations.Update(accommodation);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> DeleteAccommodation(Guid accommodationId, Guid userId)
    {
        var accommodation = await _context.Accommodations
            .Include(a => a.AccomodationImages)
            .FirstOrDefaultAsync(a => a.Id == accommodationId);

        if (accommodation == null)
            throw new KeyNotFoundException("The Accommodation doesn't exists");

        if (accommodation.OwnerId != userId)
            return false;

        _context.ImageAccommodations.RemoveRange(accommodation.AccomodationImages);
        _context.Accommodations.Remove(accommodation);
        var changes = await _context.SaveChangesAsync();
        return changes > 0;
    }


    public async Task<IEnumerable<Accommodation>> GetAccommodationsByUser(Guid userId)
    {
        return await _context.Accommodations
                             .Where(f => f.OwnerId == userId)
                             .ToListAsync();
    }
}
