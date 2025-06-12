using Backend.Models.Database.Entities;
using Backend.Models.Dtos;
using Backend.Models.Interfaces;
using Backend.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventController : ControllerBase
{
    private readonly EventService _eventService;
    private readonly SmartSearchService _smartSearchService;

    public EventController(EventService eventService, SmartSearchService smartSearchService)
    {
        _eventService = eventService;
        _smartSearchService = smartSearchService;
    }

    [HttpPost]
    public async Task<ActionResult<EventDto>> Create([FromForm] EventCreateDto dto)
    {

        Guid? userId = null;
        var claim = User.FindFirst("id")?.Value;
        if (claim != null && Guid.TryParse(claim, out var uid))
            userId = uid;

        var created = await _eventService.CreateAsync(dto);

        return Ok(created);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<EventDto>>> GetAll()
    {
        Guid? userId = null;
        var claim = User.FindFirst("id")?.Value;
        if (claim != null && Guid.TryParse(claim, out var uid))
            userId = uid;

        var list = await _eventService.GetAllAsync(userId);
        return Ok(list);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<EventDto>> GetById(Guid id)
    {
        Guid? userId = null;
        var claim = User.FindFirst("id")?.Value;
        if (claim != null && Guid.TryParse(claim, out var uid))
            userId = uid;

        var ev = await _eventService.GetByIdAsync(id, userId);
        if (ev == null) return NotFound();
        return Ok(ev);
    }

    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> DeleteEvent(Guid id)
    {
        var userIdClaim = User.FindFirstValue("id");
        if (string.IsNullOrEmpty(userIdClaim))
            return Forbid();

        if (!Guid.TryParse(userIdClaim, out var userId))
            return Forbid();

        bool ok;

        try
        {
            ok = await _eventService.DeleteEventAsync(id, userId);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Event not found" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }

        if (!ok)
            return Forbid(new AuthenticationProperties(), "Sólo el autor puede eliminar este evento.");

        return Ok(new { message = "The Event was eliminated correctly" });
    }

    [HttpPost("{id}/join")]
    public async Task<IActionResult> Join(Guid id, Guid userId)
    {
        var success = await _eventService.JoinAsync(id, userId);
        if (!success)
            return BadRequest("No se pudo unir al evento.");

        return Ok();
    }

    [HttpPost("{id:guid}/leave")]
    public async Task<IActionResult> Leave(Guid id, Guid userId)
    {

        var success = await _eventService.LeaveAsync(id, userId); ;
        if (!success)
            return BadRequest("No se pudo abandonar al evento.");
        return Ok();
    }

    [HttpGet("user/{userId:guid}")]
    public async Task<ActionResult<IEnumerable<Event>>> GetByUser(Guid userId)
    {
        var events = await _eventService.GetEventsByUserAsync(userId);

        if (!events.Any())
            return NotFound(new { message = "You haven’t organized or joined any events yet. Why not create one now?" });

        return Ok(events);
    }

    [HttpPost("SearchEvents")]
    public async Task<IActionResult> Search([FromBody] SearchEventDTO request)
    {
        if (request.Page < 1 || request.Limit < 1)
            return BadRequest("La página y el límite deben ser mayores que 0.");

        Guid? currentUserId = request.CurrentUserId;

        var events = string.IsNullOrWhiteSpace(request.Query)
            ? (await _eventService.GetAllAsync(currentUserId)).ToList()
            : (await _smartSearchService.SearchEventsAsync(request.Query, currentUserId)).ToList();

        if (!events.Any())
            return NotFound("No se han encontrado eventos.");

        if (!string.IsNullOrWhiteSpace(request.Location))
            events = events.Where(e => e.Location.Equals(request.Location, StringComparison.OrdinalIgnoreCase)).ToList();

        if (!string.IsNullOrWhiteSpace(request.City))
            events = events.Where(e => e.City.Equals(request.City, StringComparison.OrdinalIgnoreCase)).ToList();

        if (!string.IsNullOrWhiteSpace(request.Country))
            events = events.Where(e => e.Country.Equals(request.Country, StringComparison.OrdinalIgnoreCase)).ToList();

        if (!string.IsNullOrWhiteSpace(request.Category))
            events = events.Where(e => !string.IsNullOrWhiteSpace(e.Category) && e.Category.Equals(request.Category, StringComparison.OrdinalIgnoreCase)).ToList();

        if (request.Tags != null && request.Tags.Any())
            events = events.Where(e => request.Tags.All(tag => e.Tags.Any(t => t.Equals(tag, StringComparison.OrdinalIgnoreCase)))).ToList();

        if (!string.IsNullOrWhiteSpace(request.SortField))
        {
            var field = request.SortField.Trim().ToLower();
            var asc = string.Equals(request.SortOrder, "asc", StringComparison.OrdinalIgnoreCase);

            if (field == "date")
                events = asc ? events.OrderBy(e => e.Date).ToList() : events.OrderByDescending(e => e.Date).ToList();
            else if (field == "name")
                events = asc ? events.OrderBy(e => e.Title).ToList() : events.OrderByDescending(e => e.Title).ToList();
        }

        var totalItems = events.Count;
        var totalPages = (int)Math.Ceiling(totalItems / (double)request.Limit);
        var pagedEvents = events.Skip((request.Page - 1) * request.Limit).Take(request.Limit).ToList();

        return Ok(new
        {
            currentPage = request.Page,
            totalPages,
            totalItems,
            items = pagedEvents
        });
    }


    [HttpGet("countries")]
    public async Task<IActionResult> GetCountries()
    {
        var countries = await _eventService.GetAllCountriesAsync();
        return Ok(countries);
    }

    [HttpGet("cities/{country}")]
    public async Task<IActionResult> GetCitiesByCountry(string country)
    {
        var cities = await _eventService.GetCitiesByCountryAsync(country);
        return Ok(cities);
    }

    [HttpGet("participating")]
    public async Task<ActionResult<IEnumerable<EventDto>>> GetParticipatingEvents(Guid userId)
    {
        try
        {
            var dtos = await _eventService.GetParticipatingEventsAsync(userId);
            return Ok(dtos);
        }
        catch (KeyNotFoundException)
        {
            return NotFound($"No existe usuario con Id = {userId}");
        }
    }

}
