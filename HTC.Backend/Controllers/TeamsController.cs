using AutoMapper;
using HTC.Backend.DTOs;
using HTC.Backend.Models;
using HTC.Backend.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace HTC.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TeamsController : ControllerBase
{
    private readonly ITeamRepository _teamRepository;
    private readonly IMapper _mapper;

    public TeamsController(
        ITeamRepository teamRepository,
        IMapper mapper)
    {
        _teamRepository = teamRepository;
        _mapper = mapper;
    }

    [HttpPost]
    public async Task<ActionResult<TeamDto>> CreateTeam([FromForm] CreateTeamDto createDto, IFormFile? avatar)
    {
        if (string.IsNullOrEmpty(createDto.Name))
        {
            return BadRequest(new { error = "Name is required" });
        }

        if (string.IsNullOrEmpty(createDto.Position))
        {
            return BadRequest(new { error = "Position is required" });
        }

        if (!string.IsNullOrEmpty(createDto.LinkX) && !Uri.IsWellFormedUriString(createDto.LinkX, UriKind.Absolute))
        {
            return BadRequest(new { error = "Invalid URL format for link_x" });
        }

        var team = _mapper.Map<Team>(createDto);
        
        // Handle avatar upload
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

            var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "avatars");
            if (!Directory.Exists(uploadsPath))
            {
                Directory.CreateDirectory(uploadsPath);
            }

            var fileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(uploadsPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await avatar.CopyToAsync(stream);
            }

            team.Avatar = $"/uploads/avatars/{fileName}";
        }
        
        var createdTeam = await _teamRepository.CreateAsync(team);
        var result = _mapper.Map<TeamDto>(createdTeam);
        return CreatedAtAction(nameof(GetTeam), new { id = createdTeam.Id }, result);
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedResultDto<TeamDto>>> GetTeams(
        [FromQuery] int page = 1,
        [FromQuery] int per_page = 10,
        [FromQuery] string? name = null,
        [FromQuery] string? position = null,
        [FromQuery] bool? disabled = null,
        [FromQuery] DateTime? created_at = null)
    {
        var (teams, totalCount) = await _teamRepository.GetPagedAsync(
            page,
            per_page,
            filter: x => (string.IsNullOrEmpty(name) || x.Name.Contains(name)) &&
                        (string.IsNullOrEmpty(position) || x.Position.Contains(position)) &&
                        (!disabled.HasValue || x.Disabled == disabled.Value) &&
                        (!created_at.HasValue || x.CreatedAt >= created_at.Value)
        );

        var teamDtos = _mapper.Map<List<TeamDto>>(teams);

        var totalPages = (int)Math.Ceiling((double)totalCount / per_page);

        return Ok(new PaginatedResultDto<TeamDto>
        {
            CurrentPage = page,
            TotalPages = totalPages,
            TotalRecords = totalCount,
            Datas = teamDtos
        });
    }

    [HttpGet("active")]
    public async Task<ActionResult<List<TeamDto>>> GetActiveTeams()
    {
        var teams = await _teamRepository.GetActiveTeamsAsync();
        var teamDtos = _mapper.Map<List<TeamDto>>(teams);
        return Ok(teamDtos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TeamDto>> GetTeam(string id)
    {
        var team = await _teamRepository.GetByIdAsync(id);
        if (team == null)
        {
            return NotFound(new { error = "Team member not found" });
        }

        var result = _mapper.Map<TeamDto>(team);
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TeamDto>> UpdateTeam(string id, [FromForm] UpdateTeamDto updateDto, IFormFile? avatar)
    {
        var team = await _teamRepository.GetByIdAsync(id);
        if (team == null)
        {
            return NotFound(new { error = "Team member not found" });
        }

        _mapper.Map(updateDto, team);
        
        // Handle avatar upload
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
            if (!string.IsNullOrEmpty(team.Avatar))
            {
                var oldFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", team.Avatar.TrimStart('/'));
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

            var fileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(uploadsPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await avatar.CopyToAsync(stream);
            }

            team.Avatar = $"/uploads/avatars/{fileName}";
        }
        
        await _teamRepository.UpdateAsync(id, team);
        var result = _mapper.Map<TeamDto>(team);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteTeam(string id)
    {
        var team = await _teamRepository.GetByIdAsync(id);
        if (team == null)
        {
            return NotFound(new { error = "Team member not found" });
        }

        // Delete associated avatar file if exists
        if (!string.IsNullOrEmpty(team.Avatar))
        {
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", team.Avatar.TrimStart('/'));
            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }
        }

        await _teamRepository.DeleteAsync(id);
        return Ok(new { message = "Team member deleted" });
    }
}