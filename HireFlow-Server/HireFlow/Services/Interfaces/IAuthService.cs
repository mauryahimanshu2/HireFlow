using HireFlow.DTOs.Auth;

namespace HireFlow.Services.Interfaces;

public interface IAuthService
{
    Task<bool> RegisterAsync(RegisterDto dto);

    Task<LoginResponseDto?> LoginAsync(LoginDto dto);
}
