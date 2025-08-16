using AutoMapper;
using HTC.Backend.DTOs;
using HTC.Backend.Models;
using HTC.Backend.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace HTC.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class KolsController : ControllerBase
{
    private readonly IKolRepository _kolRepository;
    private readonly IMapper _mapper;

    public KolsController(
        IKolRepository kolRepository,
        IMapper mapper)
    {
        _kolRepository = kolRepository;
        _mapper = mapper;
    }

    [HttpPost]
    public async Task<ActionResult<KolDto>> CreateKol([FromForm] CreateKolDto createDto, IFormFile? avatar)
    {
        Console.WriteLine($"CreateKol called with Name: {createDto.Name}");
        Console.WriteLine($"Avatar file received: {avatar?.FileName ?? "null"}");
        Console.WriteLine($"Avatar file size: {avatar?.Length ?? 0}");
        
        if (string.IsNullOrEmpty(createDto.Name))
        {
            return BadRequest(new { error = "Name is required" });
        }

        if (!string.IsNullOrEmpty(createDto.LinkX) && !Uri.IsWellFormedUriString(createDto.LinkX, UriKind.Absolute))
        {
            return BadRequest(new { error = "Invalid URL format for link_x" });
        }

        var kol = _mapper.Map<Kol>(createDto);

        if (avatar != null && avatar.Length > 0)
        {
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
            var extension = Path.GetExtension(avatar.FileName).ToLowerInvariant();
            
            if (!allowedExtensions.Contains(extension))
            {
                return BadRequest(new { error = "Invalid file type. Only JPG, PNG, and GIF files are allowed." });
            }

            if (avatar.Length > 5 * 1024 * 1024)
            {
                return BadRequest(new { error = "File size must be less than 5MB." });
            }

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "avatars");
            Directory.CreateDirectory(uploadsFolder);

            var fileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await avatar.CopyToAsync(stream);
            }

            kol.Avatar = $"/uploads/avatars/{fileName}";
        }

        var createdKol = await _kolRepository.CreateAsync(kol);

        var result = _mapper.Map<KolDto>(createdKol);
        return CreatedAtAction(nameof(GetKol), new { id = createdKol.Id }, result);
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedResultDto<KolDto>>> GetKols(
        [FromQuery] int page = 1,
        [FromQuery] int per_page = 10,
        [FromQuery] string? name = null,
        [FromQuery] DateTime? created_at = null)
    {
        var (kols, totalCount) = await _kolRepository.GetPagedAsync(
            page,
            per_page,
            filter: x => (string.IsNullOrEmpty(name) || x.Name.Contains(name)) &&
                        (!created_at.HasValue || x.CreatedAt >= created_at.Value)
        );

        var kolDtos = _mapper.Map<List<KolDto>>(kols);

        var totalPages = (int)Math.Ceiling((double)totalCount / per_page);

        return Ok(new PaginatedResultDto<KolDto>
        {
            CurrentPage = page,
            TotalPages = totalPages,
            TotalRecords = totalCount,
            Datas = kolDtos
        });
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<KolDto>> GetKol(string id)
    {
        var kol = await _kolRepository.GetByIdAsync(id);
        if (kol == null)
        {
            return NotFound(new { error = "KOL not found" });
        }

        var result = _mapper.Map<KolDto>(kol);
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<KolDto>> UpdateKol(string id, [FromForm] UpdateKolDto updateDto, IFormFile? avatar)
    {
        var kol = await _kolRepository.GetByIdAsync(id);
        if (kol == null)
        {
            return NotFound(new { error = "KOL not found" });
        }

        _mapper.Map(updateDto, kol);

        if (avatar != null && avatar.Length > 0)
        {
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
            var extension = Path.GetExtension(avatar.FileName).ToLowerInvariant();
            
            if (!allowedExtensions.Contains(extension))
            {
                return BadRequest(new { error = "Invalid file type. Only JPG, PNG, and GIF files are allowed." });
            }

            if (avatar.Length > 5 * 1024 * 1024)
            {
                return BadRequest(new { error = "File size must be less than 5MB." });
            }

            // Delete old avatar if exists
            if (!string.IsNullOrEmpty(kol.Avatar))
            {
                var oldFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", kol.Avatar.TrimStart('/'));
                if (System.IO.File.Exists(oldFilePath))
                {
                    System.IO.File.Delete(oldFilePath);
                }
            }

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "avatars");
            Directory.CreateDirectory(uploadsFolder);

            var fileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await avatar.CopyToAsync(stream);
            }

            kol.Avatar = $"/uploads/avatars/{fileName}";
        }

        await _kolRepository.UpdateAsync(id, kol);

        var result = _mapper.Map<KolDto>(kol);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteKol(string id)
    {
        var kol = await _kolRepository.GetByIdAsync(id);
        if (kol == null)
        {
            return NotFound(new { error = "KOL not found" });
        }

        // Delete associated avatar file if exists
        if (!string.IsNullOrEmpty(kol.Avatar))
        {
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", kol.Avatar.TrimStart('/'));
            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }
        }

        await _kolRepository.DeleteAsync(id);
        return Ok(new { message = "KOL deleted" });
    }
}