using HireFlow.Models;

namespace HireFlow.Services.Interfaces;

public interface IJwtService
{
    string GenerateToken(User user);
}