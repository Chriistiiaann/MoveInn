using System.Security.Claims;
using Backend.Models.Database.Entities;
using Backend.Models.Database.Enum;
using Backend.Models.Dtos;
using Backend.Models.Mappers;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;
        public UserController(UserService userService)
        {
            _userService = userService;
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
    }
}
