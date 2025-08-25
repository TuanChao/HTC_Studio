using AutoMapper;
using HTC.Backend.DTOs;
using HTC.Backend.Models;
using HTC.Backend.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace HTC.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GalleriesController : ControllerBase
{
    private readonly IGalleryRepository _galleryRepository;
    private readonly IArtistRepository _artistRepository;
    private readonly IMapper _mapper;

    public GalleriesController(
        IGalleryRepository galleryRepository,
        IArtistRepository artistRepository,
        IMapper mapper)
    {
        _galleryRepository = galleryRepository;
        _artistRepository = artistRepository;
        _mapper = mapper;
    }

    [HttpPost]
    public async Task<ActionResult<GalleryDto>> CreateGallery([FromForm] CreateGalleryDto createDto, IFormFile? picture)
    {
        Console.WriteLine($"CreateGallery called with ArtistId: {createDto.ArtistId}");
        Console.WriteLine($"ShowOnTop: {createDto.ShowOnTop}");
        Console.WriteLine($"Picture file received: {picture?.FileName ?? "null"}");
        Console.WriteLine($"Picture file size: {picture?.Length ?? 0}");
        
        if (string.IsNullOrEmpty(createDto.ArtistId))
        {
            return BadRequest(new { error = "Artist ID is required" });
        }

        var artist = await _artistRepository.GetByIdAsync(createDto.ArtistId);
        if (artist == null)
        {
            return BadRequest(new { error = "Artist not found" });
        }

        var gallery = _mapper.Map<Gallery>(createDto);

        if (picture != null && picture.Length > 0)
        {
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
            var extension = Path.GetExtension(picture.FileName).ToLowerInvariant();
            
            if (!allowedExtensions.Contains(extension))
            {
                return BadRequest(new { error = "Invalid file type. Only JPG, PNG, GIF, and WEBP files are allowed." });
            }

            if (picture.Length > 5 * 1024 * 1024)
            {
                return BadRequest(new { error = "File size must be less than 5MB." });
            }

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "galleries");
            Directory.CreateDirectory(uploadsFolder);

            var fileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await picture.CopyToAsync(stream);
            }

            gallery.Picture = $"/uploads/galleries/{fileName}";
        }

        var createdGallery = await _galleryRepository.CreateAsync(gallery);

        var result = _mapper.Map<GalleryDto>(createdGallery);
        return CreatedAtAction(nameof(GetGallery), new { id = createdGallery.Id }, result);
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedResultDto<GalleryDto>>> GetGalleries(
        [FromQuery] int page = 1,
        [FromQuery] int per_page = 10,
        [FromQuery] string? artist_id = null,
        [FromQuery] bool? show_on_top = null)
    {
        var (galleries, totalCount) = await _galleryRepository.GetPagedAsync(
            page,
            per_page,
            filter: x => (string.IsNullOrEmpty(artist_id) || x.ArtistId == artist_id) &&
                        (!show_on_top.HasValue || x.ShowOnTop == show_on_top.Value)
        );

        var galleryDtos = _mapper.Map<List<GalleryDto>>(galleries);

        var totalPages = (int)Math.Ceiling((double)totalCount / per_page);

        return Ok(new PaginatedResultDto<GalleryDto>
        {
            CurrentPage = page,
            TotalPages = totalPages,
            TotalRecords = totalCount,
            Datas = galleryDtos
        });
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<GalleryDto>> GetGallery(string id)
    {
        var gallery = await _galleryRepository.GetByIdAsync(id);
        if (gallery == null)
        {
            return NotFound(new { error = "Gallery not found" });
        }

        var result = _mapper.Map<GalleryDto>(gallery);
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<GalleryDto>> UpdateGallery(string id, [FromForm] UpdateGalleryDto updateDto, IFormFile? picture)
    {
        var gallery = await _galleryRepository.GetByIdAsync(id);
        if (gallery == null)
        {
            return NotFound(new { error = "Gallery not found" });
        }

        _mapper.Map(updateDto, gallery);

        if (picture != null && picture.Length > 0)
        {
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
            var extension = Path.GetExtension(picture.FileName).ToLowerInvariant();
            
            if (!allowedExtensions.Contains(extension))
            {
                return BadRequest(new { error = "Invalid file type. Only JPG, PNG, GIF, and WEBP files are allowed." });
            }

            if (picture.Length > 5 * 1024 * 1024)
            {
                return BadRequest(new { error = "File size must be less than 5MB." });
            }

            // Delete old picture if exists
            if (!string.IsNullOrEmpty(gallery.Picture))
            {
                var oldFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", gallery.Picture.TrimStart('/'));
                if (System.IO.File.Exists(oldFilePath))
                {
                    System.IO.File.Delete(oldFilePath);
                }
            }

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "galleries");
            Directory.CreateDirectory(uploadsFolder);

            var fileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await picture.CopyToAsync(stream);
            }

            gallery.Picture = $"/uploads/galleries/{fileName}";
        }

        await _galleryRepository.UpdateAsync(id, gallery);

        var result = _mapper.Map<GalleryDto>(gallery);
        return Ok(result);
    }

    [HttpGet("{id}/images")]
    public async Task<ActionResult> GetGalleryImages(string id)
    {
        var gallery = await _galleryRepository.GetByIdAsync(id);
        if (gallery == null)
        {
            return NotFound(new { error = "Gallery not found" });
        }

        var artist = await _artistRepository.GetByIdAsync(gallery.ArtistId);
        if (artist == null)
        {
            return NotFound(new { error = "Artist not found" });
        }

        // Get all galleries from the same artist
        var (galleries, _) = await _galleryRepository.GetPagedAsync(
            1, 
            1000, // Large number to get all
            filter: x => x.ArtistId == gallery.ArtistId
        );

        var pictures = galleries.Select(g => new 
        {
            id = g.Id,
            picture = g.Picture,
            alt = $"Gallery image {g.Id}",
            artist_id = g.ArtistId,
            created_at = g.CreatedAt.ToString("yyyy-MM-ddTHH:mm:ss.fffZ"),
            show_on_top = g.ShowOnTop,
            updated_at = g.UpdatedAt.ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
        }).ToList();

        var artistDto = _mapper.Map<ArtistDto>(artist);

        return Ok(new 
        {
            pictures = pictures,
            artist = artistDto
        });
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteGallery(string id)
    {
        var gallery = await _galleryRepository.GetByIdAsync(id);
        if (gallery == null)
        {
            return NotFound(new { error = "Gallery not found" });
        }

        // Delete associated picture file if exists
        if (!string.IsNullOrEmpty(gallery.Picture))
        {
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", gallery.Picture.TrimStart('/'));
            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }
        }

        await _galleryRepository.DeleteAsync(id);
        return Ok(new { message = "Gallery deleted" });
    }
}