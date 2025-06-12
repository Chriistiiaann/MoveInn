using Backend.Models.Database.Entities;
using Backend.Models.Dtos;
using Backend.Models.Mappers;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

//[Authorize]
[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly UserService _userService;
    private readonly SmartSearchService _smartSearchService;
    public UserController(UserService userService, SmartSearchService smartSearchService)
    {
        _userService = userService;
        _smartSearchService = smartSearchService;
    }

    //[Authorize]
    [HttpGet("{id}")]
    public async Task<ActionResult<User>> GetUserByIdAsync(Guid id)
    {
        var user = await _userService.GetUserByIdAsync(id);
        if (user == null)
        {
            return NotFound(new { Message = "Usuario no encontrado" });
        }
        return Ok(user);
    }

    //[Authorize(Roles = nameof(Role.Administrator))]
    [HttpDelete("Delete/{id}")]
    public async Task<ActionResult<User>> DeleteUserByIdAsync(Guid id)
    {
        var user = await _userService.DeleteAsyncUserById(id);
        if (user == null)
        {
            return NotFound(new { Message = "Usuario no encontrado" });
        }
        return Ok(user);
    }

    [HttpPut("Update/{id}")]
    public async Task<ActionResult<UserDto>> UpdateUser(Guid id, [FromForm] UpdateUserRequest request)
    {
        var updatedUser = await _userService.UpdateUserAsync(id, request);
        if (updatedUser == null)
        {
            return NotFound("Usuario no encontrado o no se pudo actualizar.");
        }
        return Ok(UserMapper.ToDto(updatedUser));
    }

    [HttpPut("{id}/Languages")]
    public async Task<IActionResult> UpdateSocialMedias(Guid id, [FromBody] UserLanguageUpdateRequest req)
    {
        var dto = await _userService.UpdateUserLanguageAsync(id, req.UserLanguages);
        if (dto == null) return NotFound();
        return Ok(dto);
    }

    [HttpPut("{id}/SocialMedias")]
    public async Task<IActionResult> UpdateLanguages(Guid id, [FromBody] SocialMediasUpdateRequest req)
    {
        var dto = await _userService.UpdateUserSocialMediaAsync(id, req.SocialMedias);
        if (dto == null) return NotFound();
        return Ok(dto);
    }

    //[Authorize(Roles = nameof(Role.Administrator))]
    [HttpGet("All")]
    public async Task<ActionResult> GetAllAsync()
    {
        //Claim? userClaimId = User.FindFirst("id");
        //if (userClaimId == null) return Unauthorized(new { Message = "Debe iniciar sesión para llevar a cabo esta acción" });

        return Ok(await _userService.GetAllAsync());
    }

    [HttpGet("{id:guid}/followers")]
    public async Task<ActionResult<List<UserRelationDto>>> GetFollowers(Guid id)
    {
        var list = await _userService.GetFollowersAsync(id);
        return Ok(list);
    }

    [HttpGet("{id:guid}/followings")]
    public async Task<ActionResult<List<UserRelationDto>>> GetFollowings(Guid id)
    {
        var list = await _userService.GetFollowingsAsync(id);
        return Ok(list);
    }

    [HttpPost("SearchUsers")]
    public async Task<IActionResult> Search([FromBody] SearchUserDTO request)
    {
        if (request.Page < 1 || request.Limit < 1)
            return BadRequest("La página y el límite deben ser mayores que 0.");

        try
        {
            var allResults = (await _smartSearchService.SearchUsersAsync(request.Query ?? string.Empty))
                             .ToList();

            if (!allResults.Any())
                return NotFound("No se han encontrado usuarios.");

            if (!string.IsNullOrWhiteSpace(request.Country))
            {
                allResults = allResults
                    .Where(u =>
                        u.ErasmusCountry != null &&
                        u.ErasmusCountry.Equals(request.Country, StringComparison.OrdinalIgnoreCase))
                    .ToList();
            }

            if (!string.IsNullOrWhiteSpace(request.City))
            {
                allResults = allResults
                    .Where(u =>
                        u.City != null &&
                        u.City.Equals(request.City, StringComparison.OrdinalIgnoreCase))
                    .ToList();
            }

            if (!allResults.Any())
                return NotFound("No se han encontrado usuarios con esos filtros.");

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
        var countries = await _userService.GetAllCountriesAsync();
        return Ok(countries);
    }

    [HttpGet("cities/{country}")]
    public async Task<IActionResult> GetCitiesByCountry(string country)
    {
        var cities = await _userService.GetCitiesByCountryAsync(country);
        return Ok(cities);
    }
}
