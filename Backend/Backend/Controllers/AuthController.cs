using Backend.Models.Database.Enum;
using Backend.Models.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly TokenValidationParameters _tokenParameters;
        private readonly UserService _userService;
        private readonly AuthService _authService;

        public AuthController(IOptionsMonitor<JwtBearerOptions> jwtOptions, UserService userService, AuthService authService)
        {
            _tokenParameters = jwtOptions.Get(JwtBearerDefaults.AuthenticationScheme)
            .TokenValidationParameters;

            _userService = userService;
            _authService = authService;
        }


        [HttpPost("Login")]
        public async Task<ActionResult> Login([FromBody] LoginRequest model)
        {
            if (model == null)
                return BadRequest(new { Message = "Invalid user data" });

            bool isCorrect = await _userService.IsLoginCorrect(model.Mail, model.Password);
            if (!isCorrect)
                return BadRequest(new { message = "Mail or Password incorrect" });

            string stringToken = await _authService.Login(model);

            var handler = new JwtSecurityTokenHandler();
            var jwt = handler.ReadJwtToken(stringToken);
            var roleClaim = jwt.Claims.FirstOrDefault(c =>
                c.Type == ClaimTypes.Role || c.Type == "role")?.Value;

            if (roleClaim == Role.Banned.ToString())
            {
                return StatusCode(
                    StatusCodes.Status403Forbidden,
                    new { message = "Your account has been banned and you cannot log in" }
                );
            }

            return Ok(new LoginResult { AccessToken = stringToken });
        }


        [HttpPost("Register")]
        public async Task<ActionResult> Register([FromBody] RegisterRequest userRequest)
        {
            if (userRequest == null) return BadRequest(new { Message = "Los datos de usuario son inválidos." });
            if (await _userService.GetUserByMailAsync(userRequest.Mail) != null)
            {
                return BadRequest(new { message = "El usuario ya existe" });
            }

            string stringToken = await _authService.Register(userRequest);
            return Ok(new LoginResult { AccessToken = stringToken });
        }
    }
}
