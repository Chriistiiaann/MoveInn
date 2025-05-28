using Backend.Models.Database;
using Backend.Models.Database.Enum;
using Backend.Models.Interfaces;

namespace Backend.Services;

public class AdminService : IAdminService
{
    private readonly UnitOfWork _unitOfWork;

    public AdminService(UnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> DeleteForumAsync(Guid forumId)
    {
        try
        {
            var deleted = await _unitOfWork.AdminRepository.DeleteForumAsync(forumId);
            if (!deleted)
                throw new KeyNotFoundException("Forum not found.");
            return true;
        }
        catch (KeyNotFoundException)
        {
            throw;
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException("Error deleting forum.", ex);
        }
    }

    public async Task<bool> DeleteEventAsync(Guid eventId)
    {
        try
        {
            var deleted = await _unitOfWork.AdminRepository.DeleteEventAsync(eventId);
            if (!deleted)
                throw new KeyNotFoundException("Event not found.");
            return true;
        }
        catch (KeyNotFoundException)
        {
            throw;
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException("Error deleting event.", ex);
        }
    }

    public async Task<bool> DeleteRecommendationAsync(Guid recommendationId)
    {
        try
        {
            var deleted = await _unitOfWork.AdminRepository.DeleteRecommendationAsync(recommendationId);
            if (!deleted)
                throw new KeyNotFoundException("Recommendation not found.");
            return true;
        }
        catch (KeyNotFoundException)
        {
            throw;
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException("Error deleting recommendation.", ex);
        }
    }

    public async Task<bool> DeleteAccommodationAsync(Guid accommodationId)
    {
        try
        {
            var deleted = await _unitOfWork.AdminRepository.DeleteAccommodationAsync(accommodationId);
            if (!deleted)
                throw new KeyNotFoundException("Accommodation not found.");
            return true;
        }
        catch (KeyNotFoundException)
        {
            throw;
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException("Error deleting accommodation.", ex);
        }
    }

    public async Task<bool> DeleteReservationAsync(Guid reservationId)
    {
        try
        {
            var deleted = await _unitOfWork.AdminRepository.DeleteReservationAsync(reservationId);
            if (!deleted)
                throw new KeyNotFoundException("Reservation not found.");
            return true;
        }
        catch (KeyNotFoundException)
        {
            throw;
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException("Error deleting reservation.", ex);
        }
    }

    public async Task<bool> DeleteReviewAsync(Guid reviewId)
    {
        try
        {
            var deleted = await _unitOfWork.AdminRepository.DeleteReviewAsync(reviewId);
            if (!deleted)
                throw new KeyNotFoundException("Review not found.");
            return true;
        }
        catch (KeyNotFoundException)
        {
            throw;
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException("Error deleting review.", ex);
        }
    }

    public async Task<bool> UpdateUserRoleAsync(Guid userId, Role newRole)
    {
        return await _unitOfWork.AdminRepository.UpdateUserRoleAsync(userId, newRole);
    }
}
