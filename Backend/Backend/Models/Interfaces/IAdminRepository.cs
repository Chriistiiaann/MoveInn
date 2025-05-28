using Backend.Models.Database.Entities;
using Backend.Models.Database.Enum;

namespace Backend.Models.Interfaces;

public interface IAdminRepository
{
    Task<bool> DeleteEntityAsync<TEntity>(Guid id) where TEntity : class;

    Task<bool> DeleteForumAsync(Guid forumId);
    Task<bool> DeleteEventAsync(Guid eventId);
    Task<bool> DeleteRecommendationAsync(Guid recommendationId);
    Task<bool> DeleteAccommodationAsync(Guid accommodationId);
    Task<bool> DeleteReservationAsync(Guid reservationId);
    Task<bool> DeleteReviewAsync(Guid reviewId);
    Task<bool> UpdateUserRoleAsync(Guid userId, Role newRole);

}

