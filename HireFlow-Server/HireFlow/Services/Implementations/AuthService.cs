using HireFlow.Data;
using HireFlow.DTOs.Auth;
using HireFlow.Helpers;
using HireFlow.Models;
using HireFlow.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HireFlow.Services.Implementations;

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;
    private readonly PasswordHasher _passwordHasher;

    private readonly IJwtService _jwtService;

    public AuthService(
        ApplicationDbContext context,
        PasswordHasher passwordHasher,
        IJwtService jwtService)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _jwtService = jwtService;
    }

    public async Task<bool> RegisterAsync(RegisterDto dto)
    {
        // Check whether email already exists
        bool emailExists = await _context.Users
            .AnyAsync(u => u.Email == dto.Email);

        if (emailExists)
        {
            return false;
        }

        // Create new user
        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            PasswordHash = _passwordHasher.HashPassword(dto.Password),
            Role = dto.Role,
            IsBlocked = false,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<LoginResponseDto?> LoginAsync(LoginDto dto)
    {
        // Find user by email
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (user == null)
        {
            return null;
        }

        // Check whether user is blocked
        if (user.IsBlocked)
        {
            return null;
        }

        // Verify password
        bool passwordValid = _passwordHasher.VerifyPassword(
            dto.Password,
            user.PasswordHash
        );

        if (!passwordValid)
        {
            return null;
        }

        // JWT will be added here later
        return new LoginResponseDto
        {
            UserId = user.Id,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role,
            Token = _jwtService.GenerateToken(user)
        };
    }
}