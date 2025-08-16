using AutoMapper;
using HTC.Backend.DTOs;
using HTC.Backend.Models;
using HTC.Backend.Repositories;
using HTC.Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace HTC.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class KolsController : ControllerBase
{
    private readonly IKolRepository _kolRepository;
    private readonly IMapper _mapper;
    private readonly IS3Service _s3Service;

    public KolsController(
        IKolRepository kolRepository,
        IMapper mapper,
        IS3Service s3Service)
    {
        _kolRepository = kolRepository;
        _mapper = mapper;
        _s3Service = s3Service;
    }

    [HttpPost]
    public async Task<ActionResult<KolDto>> CreateKol([FromForm] CreateKolDto createDto, IFormFile? avatar)
    {
        if (string.IsNullOrEmpty(createDto.Name))
        {
            return BadRequest(new { error = "Name is required" });
        }

        if (!string.IsNullOrEmpty(createDto.LinkX) && !Uri.IsWellFormedUriString(createDto.LinkX, UriKind.Absolute))
        {
            return BadRequest(new { error = "Invalid URL format for link_x" });
        }

        var kol = _mapper.Map<Kol>(createDto);
        var createdKol = await _kolRepository.CreateAsync(kol);

        if (avatar != null && avatar.Length > 0)
        {
            var avatarUrl = await _s3Service.UploadFileAsync(avatar, $"kols/{createdKol.Id}");
            createdKol.Avatar = avatarUrl;
            await _kolRepository.UpdateAsync(createdKol.Id, createdKol);
        }

        var result = _mapper.Map<KolDto>(createdKol);
        if (!string.IsNullOrEmpty(createdKol.Avatar))
        {
            result.Avatar = await _s3Service.GetPresignedUrlAsync(createdKol.Avatar, $"kols/{createdKol.Id}");
        }

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
            filter: x => !x.Disabled &&
                        (string.IsNullOrEmpty(name) || x.Name.Contains(name)) &&
                        (!created_at.HasValue || x.CreatedAt >= created_at.Value)
        );

        var kolDtos = new List<KolDto>();
        foreach (var kol in kols)
        {
            var dto = _mapper.Map<KolDto>(kol);
            if (!string.IsNullOrEmpty(kol.Avatar))
            {
                dto.Avatar = await _s3Service.GetPresignedUrlAsync(kol.Avatar, $"kols/{kol.Id}");
            }
            kolDtos.Add(dto);
        }

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
        if (!string.IsNullOrEmpty(kol.Avatar))
        {
            result.Avatar = await _s3Service.GetPresignedUrlAsync(kol.Avatar, $"kols/{kol.Id}");
        }

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
            // Delete old avatar if exists
            if (!string.IsNullOrEmpty(kol.Avatar))
            {
                await _s3Service.DeleteFileAsync(kol.Avatar, $"kols/{id}");
            }

            var avatarUrl = await _s3Service.UploadFileAsync(avatar, $"kols/{id}");
            kol.Avatar = avatarUrl;
        }

        await _kolRepository.UpdateAsync(id, kol);

        var result = _mapper.Map<KolDto>(kol);
        if (!string.IsNullOrEmpty(kol.Avatar))
        {
            result.Avatar = await _s3Service.GetPresignedUrlAsync(kol.Avatar, $"kols/{kol.Id}");
        }

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

        // Delete avatar from S3 if exists
        if (!string.IsNullOrEmpty(kol.Avatar))
        {
            await _s3Service.DeleteFileAsync(kol.Avatar, $"kols/{id}");
        }

        await _kolRepository.DeleteAsync(id);
        return Ok(new { message = "KOL deleted" });
    }
}