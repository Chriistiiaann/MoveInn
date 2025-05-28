using Backend.Models.Database.Entities;
using Backend.Models.Dtos;
using Backend.Models.Interfaces;
using Backend.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.Mail;
using System.Security.Claims;

namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AccommodationsController : ControllerBase
{
    private readonly IAccommodationService _accommodationService;
    private readonly SmartSearchService _smartSearchService;
    private readonly DataContext _contex;

    public AccommodationsController(IAccommodationService accommodationService, DataContext context, SmartSearchService smartSearchService)
    {
        _accommodationService = accommodationService;
        _smartSearchService = smartSearchService;
        _contex = context;
    }

    [HttpPost("CreateAccommodation")]
    public async Task<IActionResult> CreateAccommodation([FromForm] AccommodationCreateDTO dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var userExists = await _contex.Users.AnyAsync(u => u.Id == dto.OwnerId);
            if (!userExists)
            {
                return BadRequest(new { message = "El usuario especificado no existe." });
            }

            var createdAccommodation = await _accommodationService.CreateAccommodationAsync(dto);
            return Ok(new { message = "Alojamiento registrado correctamente." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                message = "Hubo un problema al crear el alojamiento.",
                error = ex.Message,
                inner = ex.InnerException?.Message,
                trace = ex.StackTrace
            });
        }
    }

    [HttpPost("SearchAccommodation")]
    public async Task<IActionResult> Search([FromBody] SearchAccommodationDTO request)
    {
        if (request.Page < 1 || request.Limit < 1)
            return BadRequest("La página y el límite deben ser mayores que 0.");

        if (request.AvailableFrom.HasValue
            && request.AvailableTo.HasValue
            && request.AvailableFrom > request.AvailableTo)
        {
            return BadRequest("La fecha de inicio debe ser anterior o igual a la fecha de fin.");
        }

        try
        {
            var accommodations = string.IsNullOrWhiteSpace(request.Query)
                ? (await _accommodationService.GetAllAccommodationsAsync()).ToList()
                : (await _smartSearchService.SearchAccommodationAsync(request.Query)).ToList();

            if (accommodations == null || !accommodations.Any())
                return NotFound("No se han encontrado alojamientos.");

            if (request.AvailableFrom.HasValue || request.AvailableTo.HasValue)
            {
                var from = request.AvailableFrom?.Date ?? DateTime.MinValue;
                var to = request.AvailableTo?.Date ?? DateTime.MaxValue;

                accommodations = accommodations
                    .Where(a =>
                        a.AvailableFrom != default(DateTime) &&
                        a.AvailableTo != default(DateTime) &&
                        a.AvailableFrom.Date <= to &&
                        a.AvailableTo.Date >= from
                    )
                    .ToList();
            }

            if (!string.IsNullOrWhiteSpace(request.Country))
            {
                accommodations = accommodations
                    .Where(a =>
                        !string.IsNullOrWhiteSpace(a.Country) &&
                        a.Country.Equals(request.Country, StringComparison.OrdinalIgnoreCase)
                    )
                    .ToList();
            }

            if (!string.IsNullOrWhiteSpace(request.SortField))
            {
                var field = request.SortField.Trim().ToLower();
                var asc = string.Equals(request.SortOrder, "asc", StringComparison.OrdinalIgnoreCase);

                if (field == "price")
                    accommodations = asc
                        ? accommodations.OrderBy(a => a.PricePerMonth).ToList()
                        : accommodations.OrderByDescending(a => a.PricePerMonth).ToList();
                else if (field == "name")
                    accommodations = asc
                        ? accommodations.OrderBy(a => a.Title).ToList()
                        : accommodations.OrderByDescending(a => a.Title).ToList();
            }

            int totalItems = accommodations.Count;
            int totalPages = (int)Math.Ceiling(totalItems / (double)request.Limit);

            var paginatedItems = accommodations
                .Skip((request.Page - 1) * request.Limit)
                .Take(request.Limit)
                .ToList();

            var result = new
            {
                currentPage = request.Page,
                totalPages,
                totalItems,
                items = paginatedItems
            };

            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Error interno del servidor: " + ex.Message);
        }
    }


    [HttpPut("{id}/{ownerId}")]
    public async Task<IActionResult> Update(Guid id, Guid ownerId, [FromBody] AccommodationUpdateDTO updateDto)
    {
        var result = await _accommodationService.UpdateAccommodationAsync(id, updateDto, ownerId);

        if (!result)
        {
            return Ok(new { message = "No se ha encontrado el alojamiento, o no eres el propietario del alojamiento" });
        }

        return Ok(new { message = "¡Alojamiento actualizado correctamente!" });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAccommodation(Guid id)
    {
        var accomodation = await _accommodationService.GetByIdAsync(id);
        return Ok(accomodation);
    }

    [HttpGet("allAccommodations")]
    public async Task<IActionResult> GetAccommodations()
    {
        var accommodations = await _accommodationService.GetAllAccommodationsAsync();
        return Ok(accommodations);
    }

    [HttpGet("countries")]
    public async Task<IActionResult> GetCountries()
    {
        var countries = await _accommodationService.GetAllCountriesAsync();
        return Ok(countries);
    }

    [HttpGet("cities/{country}")]
    public async Task<IActionResult> GetCitiesByCountry(string country)
    {
        var cities = await _accommodationService.GetCitiesByCountryAsync(country);
        return Ok(cities);
    }

    [HttpGet("UnavailableDates/{id}")]
    public async Task<ActionResult<IEnumerable<DateTime>>> GetUnavailableDates(Guid id)
    {
        var accommodation = await _accommodationService.GetByIdAsync(id);
        if (accommodation == null)
            return NotFound($"Alojamiento {id} no encontrado.");

        var blockedDates = await _accommodationService.GetUnavailableDatesAsync(id);
        return Ok(blockedDates);
    }

    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> DeleteAccommodation(Guid id)
    {
        var userIdClaim = User.FindFirstValue("id");
        if (string.IsNullOrEmpty(userIdClaim))
            return Forbid();

        if (!Guid.TryParse(userIdClaim, out var userId))
            return Forbid();

        bool ok;

        try
        {
            ok = await _accommodationService.DeleteAccommodationAsync(id, userId);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Accommodation not found" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }

        if (!ok)
            return Forbid(new AuthenticationProperties(), "The author is the only one who can delete de accommodation");

        return Ok(new { message = "The Accommodation was eliminated correctly" });
    }

    [HttpGet("user/{userId:guid}")]
    public async Task<ActionResult<IEnumerable<Forum>>> GetByUser(Guid userId)
    {
        var forums = await _accommodationService.GetAccommodationsByUser(userId);

        if (!forums.Any())
            return NotFound(new { message = "You haven’t created any Accommodations yet. Why not start one now?" });

        return Ok(forums);
    }
}
