using Backend.Models.Database;
using Backend.Models.Database.Entities;
using Backend.Models.Database.Enum;
using Backend.Models.Database.Repositories;
using Backend.Models.Dtos;
using Backend.Models.Interfaces;

namespace Backend.Services;

public class ReviewService : IReviewService
{
    private readonly IReviewRepository _reviewRepository;
    private readonly ReservationRepository _reservationRepository;

    public ReviewService(IReviewRepository reviewRepository, ReservationRepository reservationRepository)
    {
        _reviewRepository = reviewRepository;
        _reservationRepository = reservationRepository;
    }

    public async Task CreateReviewAsync(ReviewCreateDTO reviewDto)
    {
        var reservation = await _reservationRepository.GetByIdAsync(reviewDto.ReservationId);
        if (reservation == null)
        {
            throw new Exception("Reserva no encontrada.");
        }

        if (reservation.Status != ReservationStatus.Completed)
        {
            throw new Exception("Solo se pueden evaluar estancias completadas.");
        }

        if (reservation.UserId != reviewDto.UserId)
        {
            throw new Exception("El usuario no coincide con el propietario de la reserva.");
        }

        var existingReview = await _reviewRepository.GetReviewByReservationAndUserAsync(reviewDto.ReservationId, reviewDto.UserId);
        if (existingReview != null)
        {
            throw new Exception("Ya has evaluado esta reserva.");
        }

        var review = new Review
        {
            Id = Guid.NewGuid(),
            Title = reviewDto.Title,
            Content = reviewDto.Content,
            Rating = reviewDto.Rating,
            ReservationId = reviewDto.ReservationId,
            UserId = reviewDto.UserId
        };

        await _reviewRepository.CreateReviewAsync(review);
    }

    public async Task<IEnumerable<ReviewDTO>> GetAllReviewAsync()
    {
        var reviews = await _reviewRepository.GetAllAsync();

        var response = reviews.Select(r => new ReviewDTO
        {
            Id = r.Id,
            Title = r.Title,
            Content = r.Content,
            Rating = (int)r.Rating,
            CreatedAt = r.CreatedAt,
            User = new UserDTO
            {
                Name = r.User.Name,   
                LastName = r.User.LastName,
                AvatarUrl = r.User.AvatarUrl
            },
            Reservation = new ReservationDTO
            {
                StartDate = r.Reservation.StartDate,
                EndDate = r.Reservation.EndDate
            }
        });

        return response;
    }

    public async Task<Review> GetReviewByIdAsync(Guid id)
    {
        return await _reviewRepository.GetReviewByIdAsync(id);
    }

    public async Task<IEnumerable<ReviewDTO>> GetReviewsByAccommodationIdAsync(Guid accommodationId)
    {
        var reviews = await _reviewRepository.GetReviewsByAccommodationIdAsync(accommodationId);
        var response = reviews.Select(r => new ReviewDTO
        {
            Id = r.Id,
            Title = r.Title,
            Content = r.Content,
            Rating = (int)r.Rating,
            CreatedAt = r.CreatedAt,
            User = new UserDTO
            {
                Name = r.User.Name,
                LastName = r.User.LastName,
                AvatarUrl = r.User.AvatarUrl
            },
            Reservation = new ReservationDTO
            {
                StartDate = r.Reservation.StartDate,
                EndDate = r.Reservation.EndDate
            }
        });
        return response;
    }

    public async Task<bool> DeleteReviewAsync(Guid reviewId, Guid userId)
    {
        try
        {
            return await _reviewRepository.DeleteReviewAsync(reviewId, userId);
        }
        catch (KeyNotFoundException)
        {
            throw;
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException("There was a problem until the Review was being deleted", ex);
        }
    }

    public async Task<IEnumerable<Review>> GetReviewsByUserIdAsync(Guid userId)
    {
        return await _reviewRepository.GetReviewsByUserIdAsync(userId);
    }
}
