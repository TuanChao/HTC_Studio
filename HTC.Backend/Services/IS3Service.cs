namespace HTC.Backend.Services;

public interface IS3Service
{
    Task<string> UploadFileAsync(IFormFile file, string location);
    Task<string> GetPresignedUrlAsync(string key, string location);
    Task<bool> DeleteFileAsync(string key, string location);
}