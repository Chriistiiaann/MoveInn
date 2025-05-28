using Microsoft.AspNetCore.Mvc;
using Backend.Models.Database.Entities;
using Backend.Models.Dtos;
using Backend.Models.Interfaces;
using Backend.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewsController : ControllerBase
    {
        private readonly IReviewService _reviewService;

        public ReviewsController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateReview([FromBody] ReviewCreateDTO reviewDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _reviewService.CreateReviewAsync(reviewDto);
                return Ok(new { message = "Reseña creada exitosamente." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllReviews()
        {
            IEnumerable<ReviewDTO> reviews = await _reviewService.GetAllReviewAsync();
            return Ok(reviews);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetReviewById(Guid id)
        {
            Review review = await _reviewService.GetReviewByIdAsync(id);
            if (review == null)
            {
                return NotFound();
            }
            return Ok(review);
        }

        [HttpGet("accommodation/{accommodationId}")]
        public async Task<IActionResult> GetReviewsByAccommodationId(Guid accommodationId)
        {
            var reviewsResponse = await _reviewService.GetReviewsByAccommodationIdAsync(accommodationId);

            if (reviewsResponse == null || !reviewsResponse.Any())
            {
                return Ok(new { message = "No hay reseñas disponibles para este alojamiento." });
            }

            return Ok(reviewsResponse);
        }

        [HttpDelete("{id:guid}")]
        [Authorize]
        public async Task<IActionResult> DeleteReview(Guid id)
        {
            var userIdClaim = User.FindFirstValue("id");
            if (string.IsNullOrEmpty(userIdClaim))
                return Forbid();

            if (!Guid.TryParse(userIdClaim, out var userId))
                return Forbid();

            bool ok;

            try
            {
                ok = await _reviewService.DeleteReviewAsync(id, userId);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = "Review not found" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }

            if (!ok)
                return Forbid(new AuthenticationProperties(), "Just the author can eliminate this review");

            return Ok(new { message = "The Review was eliminated correctly" });
        }

        [HttpGet("user/{userId:guid}")]
        public async Task<ActionResult<IEnumerable<Review>>> GetByUser(Guid userId)
        {
            var forums = await _reviewService.GetReviewsByUserIdAsync(userId);

            if (!forums.Any())
                return NotFound(new { message = "You haven’t created any Reviews yet. Why not start one now?" });

            return Ok(forums);
        }
    }
}

