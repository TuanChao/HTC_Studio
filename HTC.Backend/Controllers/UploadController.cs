using Microsoft.AspNetCore.Mvc;

namespace HTC.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UploadController : ControllerBase
{
    private readonly IWebHostEnvironment _environment;

    public UploadController(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    [HttpPost("avatar")]
    public async Task<ActionResult<object>> UploadAvatar(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { error = "No file uploaded" });
        }

        // Validate file type
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
        var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
        
        if (!allowedExtensions.Contains(fileExtension))
        {
            return BadRequest(new { error = "Invalid file type. Only JPG, PNG, and GIF are allowed." });
        }

        // Validate file size (max 5MB)
        if (file.Length > 5 * 1024 * 1024)
        {
            return BadRequest(new { error = "File size too large. Maximum 5MB allowed." });
        }

        try
        {
            // Create uploads directory if it doesn't exist
            var uploadsPath = Path.Combine(_environment.ContentRootPath, "wwwroot", "uploads", "avatars");
            if (!Directory.Exists(uploadsPath))
            {
                Directory.CreateDirectory(uploadsPath);
            }

            // Generate unique filename
            var fileName = $"{Guid.NewGuid()}{fileExtension}";
            var filePath = Path.Combine(uploadsPath, fileName);

            // Save file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Return the relative URL
            var fileUrl = $"/uploads/avatars/{fileName}";
            
            return Ok(new { 
                url = fileUrl,
                fileName = fileName,
                originalName = file.FileName,
                size = file.Length
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Failed to upload file", details = ex.Message });
        }
    }

    [HttpDelete("avatar/{fileName}")]
    public ActionResult DeleteAvatar(string fileName)
    {
        try
        {
            var filePath = Path.Combine(_environment.ContentRootPath, "wwwroot", "uploads", "avatars", fileName);
            
            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
                return Ok(new { message = "File deleted successfully" });
            }
            
            return NotFound(new { error = "File not found" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Failed to delete file", details = ex.Message });
        }
    }
}