using Backend.Models.Database.Entities;
using Backend.Models.Dtos;
using Backend.Models.Interfaces;
using Microsoft.AspNetCore.Mvc;
namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HostsController : ControllerBase
{
    private readonly IHostService _hostService;

    public HostsController(IHostService hostService)
    {
        _hostService = hostService;
    }


    [HttpPost]
    public async Task<IActionResult> RequestHost([FromBody] HostRequestDTO dto)
    {
        try
        {
            var host = await _hostService.RequestHostAsync(dto.UserId, dto.Reason, dto.Specialties);
            return CreatedAtAction(
                nameof(GetRequest),
                new { id = host.Id },
                new { message = "You have successfully requested to become a host." }
            );
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetApprovedHosts()
    {
        var users = await _hostService.GetApprovedHostsAsync();
        if (!users.Any())
            return Ok(new { message = "No approved hosts found." });

        return Ok(users);
    }

    [HttpGet("requests")]
    public async Task<ActionResult<IEnumerable<Hosts>>> GetAllRequests()
    {
        var requests = await _hostService.GetAllRequestsAsync();
        if (!requests.Any())
            return Ok(new { message = "No host requests found." });

        return Ok(requests);
    }

    [HttpGet("requests/{id:guid}")]
    public async Task<ActionResult<Hosts>> GetRequest(Guid id)
    {
        var host = await _hostService.GetByIdAsync(id);
        return host is null
            ? NotFound(new { message = "Host request not found." })
            : Ok(host);
    }

    [HttpPost("{id:guid}/approve")]
    public async Task<IActionResult> Approve(Guid id)
    {
        try
        {
            await _hostService.ApproveRequestAsync(id);
            return Ok(new { message = "Host request approved successfully." });
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Host request not found." });
        }
    }

    [HttpPost("{id:guid}/reject")]
    public async Task<IActionResult> Reject(Guid id)
    {
        try
        {
            await _hostService.RejectRequestAsync(id);
            return Ok(new { message = "Host request rejected successfully." });
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Host request not found." });
        }
    }

}
