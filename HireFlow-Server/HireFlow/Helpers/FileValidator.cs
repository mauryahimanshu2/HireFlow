namespace HireFlow.Helpers;

public static class FileValidator
{
    private const long MaxImageSize = 5 * 1024 * 1024;   // 5 MB
    private const long MaxResumeSize = 10 * 1024 * 1024; // 10 MB

    private static readonly string[] AllowedImageExtensions =
    {
        ".jpg",
        ".jpeg",
        ".png",
        ".webp"
    };

    private static readonly string[] AllowedImageContentTypes =
    {
        "image/jpeg",
        "image/png",
        "image/webp"
    };

    private static readonly string[] AllowedResumeExtensions =
    {
        ".pdf",
        ".doc",
        ".docx"
    };

    private static readonly string[] AllowedResumeContentTypes =
    {
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    };

    public static string? ValidateImage(IFormFile? file)
    {
        if (file == null || file.Length == 0)
        {
            return "Profile image is required.";
        }

        if (file.Length > MaxImageSize)
        {
            return "Profile image must be 5 MB or smaller.";
        }

        string extension = Path.GetExtension(file.FileName);

        if (!AllowedImageExtensions.Contains(
                extension,
                StringComparer.OrdinalIgnoreCase))
        {
            return "Only JPG, JPEG, PNG and WEBP images are allowed.";
        }

        if (!AllowedImageContentTypes.Contains(
                file.ContentType,
                StringComparer.OrdinalIgnoreCase))
        {
            return "Invalid image file type.";
        }

        return null;
    }

    public static string? ValidateResume(IFormFile? file)
    {
        if (file == null || file.Length == 0)
        {
            return "Resume file is required.";
        }

        if (file.Length > MaxResumeSize)
        {
            return "Resume must be 10 MB or smaller.";
        }

        string extension = Path.GetExtension(file.FileName);

        if (!AllowedResumeExtensions.Contains(
                extension,
                StringComparer.OrdinalIgnoreCase))
        {
            return "Only PDF, DOC and DOCX files are allowed.";
        }

        if (!AllowedResumeContentTypes.Contains(
                file.ContentType,
                StringComparer.OrdinalIgnoreCase))
        {
            return "Invalid resume file type.";
        }

        return null;
    }
}