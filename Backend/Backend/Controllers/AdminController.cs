using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.Models.Database.Enum;
using Backend.Models.Interfaces;

namespace Backend.Controllers;
[Route("api/[controller]")]
[ApiController]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;

    public AdminController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    [Authorize(Roles = nameof(Role.Administrator))]
    [HttpDelete("forum/{id:guid}")]
    public async Task<IActionResult> DeleteForum(Guid id)
    {
        bool ok;
        try
        {
            ok = await _adminService.DeleteForumAsync(id);
            if (ok)
                return Ok(new { message = "Forum eliminated correctly." });
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Forum not found." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }

        if (!ok)
            return NotFound(new { message = "Forum not found or it cannot be deleted" });

        return NoContent();
    }

    [Authorize(Roles = nameof(Role.Administrator))]
    [HttpDelete("event/{id:guid}")]
    public async Task<IActionResult> DeleteEvent(Guid id)
    {
        bool ok;
        try
        {
            ok = await _adminService.DeleteEventAsync(id);
            if (ok)
                return Ok(new { message = "Event eliminated correctly." });
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Event not found." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }

        if (!ok)
            return NotFound(new { message = "Event not found or it cannot be deleted" });

        return NoContent();
    }

    [Authorize(Roles = nameof(Role.Administrator))]
    [HttpDelete("recommendation/{id:guid}")]
    public async Task<IActionResult> DeleteRecommendation(Guid id)
    {
        bool ok;
        try
        {
            ok = await _adminService.DeleteRecommendationAsync(id);
            if (ok)
                return Ok(new { message = "Recommendation eliminated correctly." });
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Recommendation not found." });
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException("Error deleting recommendation.", ex);
        }

        if (!ok)
            return NotFound(new { message = "Recommendation not found or it cannot be deleted" });

        return NoContent();
    }

    [Authorize(Roles = nameof(Role.Administrator))]
    [HttpDelete("accommodation/{id:guid}")]
    public async Task<IActionResult> DeleteAccommodation(Guid id)
    {
        bool ok;
        try
        {
            ok = await _adminService.DeleteAccommodationAsync(id);
            if (ok)
                return Ok(new { message = "Accommodation eliminated correctly." });
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Accommodation not found." });
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException("Error deleting accommodation.", ex);
        }

        if (!ok)
            return NotFound(new { message = "Accommodation not found or it cannot be deleted" });

        return NoContent();
    }

    [Authorize(Roles = nameof(Role.Administrator))]
    [HttpDelete("reservation/{id:guid}")]
    public async Task<IActionResult> DeleteReservation(Guid id)
    {
        bool ok;
        try
        {
            ok = await _adminService.DeleteReservationAsync(id);
            if (ok)
                return Ok(new { message = "Reservation eliminated correctly." });
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Reservation not found." });
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException("Error deleting reservation.", ex);
        }

        if (!ok)
            return NotFound(new { message = "Reservation not found or it cannot be deleted" });

        return NoContent();
    }

    [Authorize(Roles = nameof(Role.Administrator))]
    [HttpDelete("review/{id:guid}")]
    public async Task<IActionResult> DeleteReview(Guid id)
    {
        bool ok;
        try
        {
            ok = await _adminService.DeleteReviewAsync(id);
            if (ok)
                return Ok(new { message = "Review eliminated correctly." });
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Review not found." });
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException("Error deleting review.", ex);
        }

        if (!ok)
            return NotFound(new { message = "Review not found or it cannot be deleted" });

        return NoContent();
    }

    [Authorize(Roles = nameof(Role.Administrator))]
    [HttpPut("user/{id:guid}")]
    public async Task<IActionResult> UpdateUserRole(Guid id, Role newRole)
    {
        bool ok;
        try
        {
            ok = await _adminService.UpdateUserRoleAsync(id, newRole);
            if (ok)
                return Ok(new { message = "User role updated correctly." });
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "User not found." });
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException("Error updating user role.", ex);
        }

        if (!ok)
            return NotFound(new { message = "User not found or role cannot be updated." });

        return NoContent();
    }
}
