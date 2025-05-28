using Backend.Models.Database.Entities;
using Backend.Models.Dtos;

namespace Backend.Models.Interfaces;

public interface IReviewService
{
    Task CreateReviewAsync(ReviewCreateDTO reviewDto);
    Task<IEnumerable<ReviewDTO>> GetAllReviewAsync();
    Task<Review> GetReviewByIdAsync(Guid id);
    Task<IEnumerable<ReviewDTO>> GetReviewsByAccommodationIdAsync(Guid accommodationId);

    Task<bool> DeleteReviewAsync(Guid forumId, Guid userId);
    Task<IEnumerable<Review>> GetReviewsByUserIdAsync(Guid userId);
}
