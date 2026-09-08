using HireFlow.DTOs.Auth;
using HireFlow.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HireFlow.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    // POST: api/auth/register
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        bool result = await _authService.RegisterAsync(dto);

        if (!result)
        {
            return BadRequest(new
            {
                message = "Email already exists."
            });
        }

        return Ok(new
        {
            message = "Registration successful."
        });
    }

    // POST: api/auth/login
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var result = await _authService.LoginAsync(dto);

        if (result == null)
        {
            return Unauthorized(new
            {
                message = "Invalid email or password."
            });
        }

        return Ok(result);
    }
}