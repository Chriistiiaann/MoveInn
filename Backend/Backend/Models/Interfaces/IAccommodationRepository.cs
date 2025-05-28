using Backend.Models.Database.Entities;
using Backend.Models.Dtos;

namespace Backend.Models.Interfaces;

public interface IAccommodationRepository
{
    Task InsertAsync(Accommodation accommodation);
    Task<IEnumerable<Accommodation>> GetAllAsync();
    Task<Accommodation> GetByIdAsync(Guid id);
    Task<IEnumerable<string>> GetAllCountriesAsync();
    Task<IEnumerable<string>> GetCitiesByCountryAsync(string country);
    Task UpdateAsync(Accommodation accommodation);
    Task<bool> DeleteAccommodation(Guid forumId, Guid userId);
    Task<IEnumerable<Accommodation>> GetAccommodationsByUser(Guid userId);

}
