using Backend.Models.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ReservationController : ControllerBase
    {
        private readonly ReservationService _reservationService;

        public ReservationController(ReservationService reservationService)
        {
            _reservationService = reservationService;
        }

        [HttpPost("CreateReservation")]
        public async Task<IActionResult> CreateReservation([FromBody] ReservationCreateRequest request)
        {
            var result = await _reservationService.CreateReservationAsync(request);
            if (result == null)
                return StatusCode(500, "Error al crear la reserva.");
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetReservationById(Guid id)
        {
            var reservation = await _reservationService.GetReservationByIdAsync(id);
            if (reservation == null)
                return NotFound("Reserva no encontrada.");
            return Ok(reservation);
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAllReservations()
        {
            var reservations = await _reservationService.GetAllReservationsAsync();
            return Ok(reservations);
        }

        [HttpPut("Update/{id}")]
        public async Task<IActionResult> UpdateReservation(Guid id, ReservationUpdateRequest request)
        {
            var updated = await _reservationService.UpdateReservationAsync(id, request);
            if (updated == null)
                return NotFound("Reserva no encontrada o no se pudo actualizar.");
            return Ok(updated);
        }

        [HttpGet("user/{userId:guid}")]
        public async Task<ActionResult<IEnumerable<ReservationDto>>> GetByUser(Guid userId)
        {
            var reservations = await _reservationService.GetReservationsByUserAsync(userId);

            if (!reservations.Any())
                return NotFound(new { message = "This user doesn't have any reservations" });

            return Ok(reservations);
        }

        [HttpDelete("{id:guid}")]
        [Authorize]
        public async Task<IActionResult> Delete(Guid id)
        {
            var userIdClaim = User.FindFirstValue("id");
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return Forbid();

            bool ok;
            try
            {
                ok = await _reservationService.DeleteReservationAsync(id, userId);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = "Reservation not found" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }

            if (!ok)
                return StatusCode(403, new { message = "Only the owner can delete this reservation." });

            return Ok(new { message = "Reservation deleted successfully" });
        }


    }
}
