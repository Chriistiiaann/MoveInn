using Backend.Models.Database.Entities;
using Backend.Models.Dtos;
using Backend.Models.Interfaces;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecommendationController : ControllerBase
    {
        private readonly RecommendationService _recommendationService;
        private readonly SmartSearchService _smartSearchService;


        public RecommendationController(RecommendationService recommendationService, SmartSearchService smartSearchService)
        {
            _recommendationService = recommendationService;
            _smartSearchService = smartSearchService;
        }

        [HttpPost]
        public async Task<ActionResult<RecommendationDto>> CreateRecommendation([FromForm] RecommendationCreateRequest request)
        {
            Guid? userId = null;
            var userClaim = User.FindFirst("id");
            if (userClaim != null && Guid.TryParse(userClaim.Value, out Guid parsedUserId))
            {
                userId = parsedUserId;
            }

            var result = await _recommendationService.CreateRecommendationAsync(request, userId);
            if (result == null)
                return StatusCode(500, "No se pudo crear la recomendación.");

            return Ok(result);
        }

        [HttpPost("SearchRecommendation")]
        public async Task<IActionResult> Search([FromBody] SearchRecommendatioDTO request)
        {
            if (request.Page < 1 || request.Limit < 1)
            {
                return BadRequest("La página y el límite deben ser mayores que 0.");
            }
            try
            {
                var accommodations = string.IsNullOrWhiteSpace(request.Query)
                    ? await _recommendationService.GetAllRecommendationsAsync()
                    : await _smartSearchService.SearchReccomendationAsync(request.Query);

                if (accommodations == null || !accommodations.Any())
                {
                    return NotFound("No accommodations found.");
                }

                if (!string.IsNullOrWhiteSpace(request.Country))
                {
                    accommodations = accommodations
                        .Where(a => a.Country != null &&
                                    a.Country.Equals(request.Country, StringComparison.OrdinalIgnoreCase))
                        .ToList();
                }

                if (!string.IsNullOrWhiteSpace(request.City))
                {
                    accommodations = accommodations
                        .Where(a => a.City != null &&
                                    a.City.Equals(request.City, StringComparison.OrdinalIgnoreCase))
                        .ToList();
                }

                if (request.SortField?.ToLower() == "name")
                {
                    accommodations = request.SortOrder?.ToLower() == "asc"
                        ? accommodations.OrderBy(p => p.Title).ToList()
                        : accommodations.OrderByDescending(p => p.Title).ToList();
                }

                var totalItems = accommodations.Count();
                var totalPages = (int)Math.Ceiling(totalItems / (double)request.Limit);

                var paginatedProducts = accommodations
                    .Skip((request.Page - 1) * request.Limit)
                    .Take(request.Limit)
                    .ToList();

                var result = new
                {
                    currentPage = request.Page,
                    totalPages,
                    totalItems,
                    items = paginatedProducts
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<RecommendationDto>> GetRecommendationById(Guid id)
        {
            var recommendation = await _recommendationService.GetRecommendationByIdAsync(id);
            if (recommendation == null)
                return NotFound();
            return Ok(recommendation);
        }

        [HttpGet("AllRecommendations")]
        public async Task<ActionResult<IEnumerable<RecommendationDto>>> GetAllRecommendations()
        {
            var recommendations = await _recommendationService.GetAllRecommendationsAsync();
            return Ok(recommendations);
        }

        [HttpGet("countries")]
        public async Task<IActionResult> GetCountries()
        {
            var countries = await _recommendationService.GetAllCountriesAsync();
            return Ok(countries);
        }

        [HttpGet("cities/{country}")]
        public async Task<IActionResult> GetCitiesByCountry(string country)
        {
            var cities = await _recommendationService.GetCitiesByCountryAsync(country);
            return Ok(cities);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<RecommendationDto>> UpdateRecommendation(Guid id, [FromForm]RecommendationUpdateRequest request)
        {
            var updated = await _recommendationService.UpdateRecommendationAsync(id, request);
            if (updated == null)
                return NotFound("Recomendación no encontrada o no se pudo actualizar.");
            return Ok(updated);
        }

        [HttpGet("user/{userId:guid}")]
        public async Task<ActionResult<IEnumerable<Recommendation>>> GetByUser(Guid userId)
        {
            var recommendations = await _recommendationService.GetRecommendationsByUserAsync(userId);

            if (!recommendations.Any())
                return NotFound(new { message = "No recommendations found for this user." });

            return Ok(recommendations);
        }

        [HttpDelete("{id:guid}")]
        [Authorize]
        public async Task<IActionResult> Delete(Guid id)
        {
            var userIdClaim = User.FindFirstValue("id");
            if (string.IsNullOrEmpty(userIdClaim))
                return Forbid();

            if (!Guid.TryParse(userIdClaim, out var userId))
                return Forbid();

            bool ok;
            try
            {
                ok = await _recommendationService.DeleteRecommendationAsync(id, userId);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = "Recommendation not found" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }

            if (!ok)
                return StatusCode(403, new { message = "Only the author can delete this recommendation." });

            return Ok(new { message = "The recommendation was deleted successfully" });
        }
    }
}
