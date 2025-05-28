using Backend.Models.Database.Entities;
using Backend.Models.Dtos;

namespace Backend.Models.Interfaces;

public interface IAccommodationService
{
    Task<AccommodationDTO> CreateAccommodationAsync(AccommodationCreateDTO accommodation);
    Task<bool> UpdateAccommodationAsync(Guid accommodationId, AccommodationUpdateDTO updatedAccommodation, Guid currentUserId);
    Task<IEnumerable<AccommodationDTO>> GetAllAccommodationsAsync();
    Task<IEnumerable<string>> GetAllCountriesAsync();
    Task<IEnumerable<string>> GetCitiesByCountryAsync(string country);
    Task<Accommodation> GetByIdAsync(Guid id);
    Task<IEnumerable<DateTime>> GetUnavailableDatesAsync(Guid accommodationId);
    Task<bool> DeleteAccommodationAsync(Guid forumId, Guid userId);
    Task<IEnumerable<Accommodation>> GetAccommodationsByUser(Guid userId);
}
