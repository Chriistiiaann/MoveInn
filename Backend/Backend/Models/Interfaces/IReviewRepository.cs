using Backend.Models.Database.Entities;
using Backend.Models.Dtos;

namespace Backend.Models.Interfaces;

public interface IReviewRepository
{
    Task CreateReviewAsync(Review review);
    Task<IEnumerable<Review>> GetAllAsync();
    Task<Review> GetReviewByIdAsync(Guid id);
    Task<IEnumerable<Review>> GetReviewsByAccommodationIdAsync(Guid accommodationId);
    Task<bool> DeleteReviewAsync(Guid forumId, Guid userId);
    Task<Review> GetReviewByReservationAndUserAsync(Guid reservationId, Guid userId);
    Task<IEnumerable<Review>> GetReviewsByUserIdAsync(Guid userId);
}
