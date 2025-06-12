using Backend.Models.Database.Entities;
using Backend.Models.Dtos;
using Backend.Models.Interfaces;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HostsController : ControllerBase
{
    private readonly IHostService _hostService;
    private readonly SmartSearchService _smartSearchService;

    public HostsController(IHostService hostService, SmartSearchService smartSearchService)
    {
        _hostService = hostService;
        _smartSearchService = smartSearchService;
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

    [HttpPost("SearchHosts")]
    public async Task<IActionResult> SearchHosts([FromBody] SearchUserDTO request)
    {
        if (request.Page < 1 || request.Limit < 1)
            return BadRequest("La página y el límite deben ser mayores que 0.");

        try
        {
            var allResults = (await _smartSearchService.SearchHostsAsync(request.Query ?? string.Empty))
                             .ToList();

            if (!allResults.Any())
                return NotFound("No se han encontrado hosts.");

            if (!string.IsNullOrWhiteSpace(request.Country))
            {
                allResults = allResults
                    .Where(h =>
                        h.ErasmusCountry != null &&
                        h.ErasmusCountry.Equals(request.Country, StringComparison.OrdinalIgnoreCase))
                    .ToList();
            }

            if (!string.IsNullOrWhiteSpace(request.City))
            {
                allResults = allResults
                    .Where(h =>
                        h.City != null &&
                        h.City.Equals(request.City, StringComparison.OrdinalIgnoreCase))
                    .ToList();
            }

            if (!allResults.Any())
                return NotFound("No se han encontrado hosts con esos filtros.");

            var totalItems = allResults.Count;
            var totalPages = (int)Math.Ceiling(totalItems / (double)request.Limit);

            var paged = allResults
                .Skip((request.Page - 1) * request.Limit)
                .Take(request.Limit)
                .ToList();

            return Ok(new
            {
                currentPage = request.Page,
                totalPages,
                totalItems,
                items = paged
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Error interno del servidor: " + ex.Message);
        }
    }

    [HttpGet("countries")]
    public async Task<IActionResult> GetCountries()
    {
        var countries = await _hostService.GetAllCountriesAsync();
        return Ok(countries);
    }

    [HttpGet("cities/{country}")]
    public async Task<IActionResult> GetCitiesByCountry(string country)
    {
        var cities = await _hostService.GetCitiesByCountryAsync(country);
        return Ok(cities);
    }

}
