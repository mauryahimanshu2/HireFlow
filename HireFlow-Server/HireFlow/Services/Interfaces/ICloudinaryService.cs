namespace HireFlow.Services.Interfaces;

public interface ICloudinaryService
{
    Task<string> UploadImageAsync(IFormFile file);

    Task<string> UploadResumeAsync(IFormFile file);
}