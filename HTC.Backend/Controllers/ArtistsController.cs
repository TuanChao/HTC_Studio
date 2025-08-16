using Microsoft.AspNetCore.Mvc;
using HTC.Backend.DTOs;
using HTC.Backend.Repositories;
using HTC.Backend.Models;
using AutoMapper;

namespace HTC.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ArtistsController : ControllerBase
{
    private readonly IArtistRepository _artistRepository;
    private readonly IMapper _mapper;

    public ArtistsController(IArtistRepository artistRepository, IMapper mapper)
    {
        _artistRepository = artistRepository;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedResultDto<ArtistDto>>> GetArtists(
        [FromQuery] int page = 1,
        [FromQuery] int per_page = 10,
        [FromQuery] string? style = null,
        [FromQuery] string? name = null,
        [FromQuery] DateTime? created_at = null)
    {
        var (artists, totalCount) = await _artistRepository.GetPagedAsync(
            page,
            per_page,
            filter: x => (string.IsNullOrEmpty(style) || x.Style.Contains(style)) &&
                        (string.IsNullOrEmpty(name) || x.Name.Contains(name)) &&
                        (!created_at.HasValue || x.CreatedAt >= created_at.Value)
        );

        Console.WriteLine($"Found {totalCount} artists, returning {artists.Count()} for page {page}");
        var artistDtos = _mapper.Map<List<ArtistDto>>(artists);
        var totalPages = (int)Math.Ceiling((double)totalCount / per_page);

        return Ok(new PaginatedResultDto<ArtistDto>
        {
            CurrentPage = page,
            TotalPages = totalPages,
            TotalRecords = totalCount,
            Datas = artistDtos
        });
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ArtistDto>> GetArtist(string id)
    {
        var artist = await _artistRepository.GetByIdAsync(id);
        if (artist == null)
        {
            return NotFound(new { error = "Artist not found" });
        }

        var result = _mapper.Map<ArtistDto>(artist);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<ArtistDto>> CreateArtist([FromForm] CreateArtistDto createDto, IFormFile? avatar)
    {
        if (string.IsNullOrEmpty(createDto.Name))
        {
            return BadRequest(new { error = "Name is required" });
        }

        if (string.IsNullOrEmpty(createDto.Style))
        {
            return BadRequest(new { error = "Style is required" });
        }

        if (!string.IsNullOrEmpty(createDto.LinkX) && !Uri.IsWellFormedUriString(createDto.LinkX, UriKind.Absolute))
        {
            return BadRequest(new { error = "Invalid URL format for link_x" });
        }

        var artist = _mapper.Map<Artist>(createDto);
        Console.WriteLine($"Creating artist: {artist.Name}, Style: {artist.Style}");
        
        // Handle avatar upload
        if (avatar != null && avatar.Length > 0)
        {
            var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "avatars");
            if (!Directory.Exists(uploadsPath))
            {
                Directory.CreateDirectory(uploadsPath);
            }

            var fileExtension = Path.GetExtension(avatar.FileName);
            var fileName = $"{Guid.NewGuid()}{fileExtension}";
            var filePath = Path.Combine(uploadsPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await avatar.CopyToAsync(stream);
            }

            artist.Avatar = $"/uploads/avatars/{fileName}";
        }
        
        var createdArtist = await _artistRepository.CreateAsync(artist);
        Console.WriteLine($"Created artist with ID: {createdArtist.Id}");

        var result = _mapper.Map<ArtistDto>(createdArtist);
        return CreatedAtAction(nameof(GetArtist), new { id = createdArtist.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ArtistDto>> UpdateArtist(string id, [FromForm] UpdateArtistDto updateDto, IFormFile? avatar)
    {
        var artist = await _artistRepository.GetByIdAsync(id);
        if (artist == null)
        {
            return NotFound(new { error = "Artist not found" });
        }

        _mapper.Map(updateDto, artist);
        
        // Handle avatar upload
        if (avatar != null && avatar.Length > 0)
        {
            // Delete old avatar if exists
            if (!string.IsNullOrEmpty(artist.Avatar))
            {
                var oldFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", artist.Avatar.TrimStart('/'));
                if (System.IO.File.Exists(oldFilePath))
                {
                    System.IO.File.Delete(oldFilePath);
                }
            }

            var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "avatars");
            if (!Directory.Exists(uploadsPath))
            {
                Directory.CreateDirectory(uploadsPath);
            }

            var fileExtension = Path.GetExtension(avatar.FileName);
            var fileName = $"{Guid.NewGuid()}{fileExtension}";
            var filePath = Path.Combine(uploadsPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await avatar.CopyToAsync(stream);
            }

            artist.Avatar = $"/uploads/avatars/{fileName}";
        }
        
        await _artistRepository.UpdateAsync(id, artist);

        var result = _mapper.Map<ArtistDto>(artist);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteArtist(string id)
    {
        var artist = await _artistRepository.GetByIdAsync(id);
        if (artist == null)
        {
            return NotFound(new { error = "Artist not found" });
        }

        await _artistRepository.DeleteAsync(id);
        return Ok(new { message = "Artist deleted" });
    }
}