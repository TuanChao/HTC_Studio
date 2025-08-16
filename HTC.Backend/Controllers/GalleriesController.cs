using AutoMapper;
using HTC.Backend.DTOs;
using HTC.Backend.Models;
using HTC.Backend.Repositories;
using HTC.Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace HTC.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GalleriesController : ControllerBase
{
    private readonly IGalleryRepository _galleryRepository;
    private readonly IArtistRepository _artistRepository;
    private readonly IMapper _mapper;
    private readonly IS3Service _s3Service;

    public GalleriesController(
        IGalleryRepository galleryRepository,
        IArtistRepository artistRepository,
        IMapper mapper,
        IS3Service s3Service)
    {
        _galleryRepository = galleryRepository;
        _artistRepository = artistRepository;
        _mapper = mapper;
        _s3Service = s3Service;
    }

    [HttpPost]
    public async Task<ActionResult<GalleryDto>> CreateGallery([FromForm] CreateGalleryDto createDto, IFormFile picture)
    {
        if (string.IsNullOrEmpty(createDto.ArtistId))
        {
            return BadRequest(new { error = "Artist ID is required" });
        }

        var artist = await _artistRepository.GetByIdAsync(createDto.ArtistId);
        if (artist == null)
        {
            return BadRequest(new { error = "Artist not found" });
        }

        if (picture == null || picture.Length == 0)
        {
            return BadRequest(new { error = "Picture is required" });
        }

        var gallery = _mapper.Map<Gallery>(createDto);
        var createdGallery = await _galleryRepository.CreateAsync(gallery);

        var pictureUrl = await _s3Service.UploadFileAsync(picture, $"galleries/{createdGallery.Id}");
        createdGallery.Picture = pictureUrl;
        await _galleryRepository.UpdateAsync(createdGallery.Id, createdGallery);

        var result = _mapper.Map<GalleryDto>(createdGallery);
        result.Picture = await _s3Service.GetPresignedUrlAsync(createdGallery.Picture, $"galleries/{createdGallery.Id}");

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

        var galleryDtos = new List<GalleryDto>();
        foreach (var gallery in galleries)
        {
            var dto = _mapper.Map<GalleryDto>(gallery);
            if (!string.IsNullOrEmpty(gallery.Picture))
            {
                dto.Picture = await _s3Service.GetPresignedUrlAsync(gallery.Picture, $"galleries/{gallery.Id}");
            }
            galleryDtos.Add(dto);
        }

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
        if (!string.IsNullOrEmpty(gallery.Picture))
        {
            result.Picture = await _s3Service.GetPresignedUrlAsync(gallery.Picture, $"galleries/{gallery.Id}");
        }

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
            // Delete old picture if exists
            if (!string.IsNullOrEmpty(gallery.Picture))
            {
                await _s3Service.DeleteFileAsync(gallery.Picture, $"galleries/{id}");
            }

            var pictureUrl = await _s3Service.UploadFileAsync(picture, $"galleries/{id}");
            gallery.Picture = pictureUrl;
        }

        await _galleryRepository.UpdateAsync(id, gallery);

        var result = _mapper.Map<GalleryDto>(gallery);
        if (!string.IsNullOrEmpty(gallery.Picture))
        {
            result.Picture = await _s3Service.GetPresignedUrlAsync(gallery.Picture, $"galleries/{gallery.Id}");
        }

        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteGallery(string id)
    {
        var gallery = await _galleryRepository.GetByIdAsync(id);
        if (gallery == null)
        {
            return NotFound(new { error = "Gallery not found" });
        }

        // Delete picture from S3 if exists
        if (!string.IsNullOrEmpty(gallery.Picture))
        {
            await _s3Service.DeleteFileAsync(gallery.Picture, $"galleries/{id}");
        }

        await _galleryRepository.DeleteAsync(id);
        return Ok(new { message = "Gallery deleted" });
    }
}