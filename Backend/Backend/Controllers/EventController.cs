using Backend.Models.Database.Entities;
using Backend.Models.Dtos;
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

    public EventController(EventService eventService)
    {
        _eventService = eventService;
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
}
