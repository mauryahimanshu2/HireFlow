using HireFlow.DTOs.Company;
using HireFlow.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace HireFlow.Controllers;

[ApiController]
[Route("api/companies")]
[Authorize(Roles = "Recruiter")]
public class CompanyController : ControllerBase
{
    private readonly ICompanyService _companyService;

    public CompanyController(ICompanyService companyService)
    {
        _companyService = companyService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateCompany(
        CreateCompanyDto dto)
    {
        int userId = GetUserId();

        var company = await _companyService
            .CreateAsync(userId, dto);

        return Ok(company);
    }

    [HttpGet]
    public async Task<IActionResult> GetCompany()
    {
        int userId = GetUserId();

        var company = await _companyService
            .GetAsync(userId);

        if (company == null)
        {
            return NotFound(new
            {
                message = "Company not found."
            });
        }

        return Ok(company);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateCompany(
        UpdateCompanyDto dto)
    {
        int userId = GetUserId();

        var company = await _companyService
            .UpdateAsync(userId, dto);

        if (company == null)
        {
            return NotFound(new
            {
                message = "Company not found."
            });
        }

        return Ok(company);
    }

    [HttpPatch]
    public async Task<IActionResult> PatchCompany(
        UpdateCompanyDto dto)
    {
        int userId = GetUserId();

        var company = await _companyService
            .PatchAsync(userId, dto);

        if (company == null)
        {
            return NotFound(new
            {
                message = "Company not found."
            });
        }

        return Ok(company);
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteCompany()
    {
        int userId = GetUserId();

        bool deleted = await _companyService
            .DeleteAsync(userId);

        if (!deleted)
        {
            return NotFound(new
            {
                message = "Company not found."
            });
        }

        return Ok(new
        {
            message = "Company deleted successfully."
        });
    }

    [HttpPost("logo")]
    public async Task<IActionResult> UploadLogo(
    IFormFile file)
    {
        int userId = GetUserId();

        var logoUrl = await _companyService
            .UploadLogoAsync(userId, file);

        if (logoUrl == null)
        {
            return NotFound(new
            {
                message = "Company not found."
            });
        }

        return Ok(new
        {
            message = "Company logo uploaded successfully.",
            logoUrl
        });
    }

    private int GetUserId()
    {
        string? userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (userId == null)
        {
            userId = User.FindFirstValue(
                JwtRegisteredClaimNames.Sub);
        }

        return int.Parse(userId!);
    }
}