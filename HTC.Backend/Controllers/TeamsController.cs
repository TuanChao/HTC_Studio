using AutoMapper;
using HTC.Backend.DTOs;
using HTC.Backend.Models;
using HTC.Backend.Repositories;
using HTC.Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace HTC.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TeamsController : ControllerBase
{
    private readonly ITeamRepository _teamRepository;
    private readonly IMapper _mapper;
    private readonly IS3Service _s3Service;

    public TeamsController(
        ITeamRepository teamRepository,
        IMapper mapper,
        IS3Service s3Service)
    {
        _teamRepository = teamRepository;
        _mapper = mapper;
        _s3Service = s3Service;
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

        var team = _mapper.Map<Team>(createDto);
        var createdTeam = await _teamRepository.CreateAsync(team);

        if (avatar != null && avatar.Length > 0)
        {
            var avatarUrl = await _s3Service.UploadFileAsync(avatar, $"teams/{createdTeam.Id}");
            createdTeam.Avatar = avatarUrl;
            await _teamRepository.UpdateAsync(createdTeam.Id, createdTeam);
        }

        var result = _mapper.Map<TeamDto>(createdTeam);
        if (!string.IsNullOrEmpty(createdTeam.Avatar))
        {
            result.Avatar = await _s3Service.GetPresignedUrlAsync(createdTeam.Avatar, $"teams/{createdTeam.Id}");
        }

        return CreatedAtAction(nameof(GetTeam), new { id = createdTeam.Id }, result);
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedResultDto<TeamDto>>> GetTeams(
        [FromQuery] int page = 1,
        [FromQuery] int per_page = 10,
        [FromQuery] string? name = null,
        [FromQuery] string? position = null,
        [FromQuery] DateTime? created_at = null)
    {
        var (teams, totalCount) = await _teamRepository.GetPagedAsync(
            page,
            per_page,
            filter: x => !x.Disabled &&
                        (string.IsNullOrEmpty(name) || x.Name.Contains(name)) &&
                        (string.IsNullOrEmpty(position) || x.Position.Contains(position)) &&
                        (!created_at.HasValue || x.CreatedAt >= created_at.Value)
        );

        var teamDtos = new List<TeamDto>();
        foreach (var team in teams)
        {
            var dto = _mapper.Map<TeamDto>(team);
            if (!string.IsNullOrEmpty(team.Avatar))
            {
                dto.Avatar = await _s3Service.GetPresignedUrlAsync(team.Avatar, $"teams/{team.Id}");
            }
            teamDtos.Add(dto);
        }

        var totalPages = (int)Math.Ceiling((double)totalCount / per_page);

        return Ok(new PaginatedResultDto<TeamDto>
        {
            CurrentPage = page,
            TotalPages = totalPages,
            TotalRecords = totalCount,
            Datas = teamDtos
        });
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
        if (!string.IsNullOrEmpty(team.Avatar))
        {
            result.Avatar = await _s3Service.GetPresignedUrlAsync(team.Avatar, $"teams/{team.Id}");
        }

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

        if (avatar != null && avatar.Length > 0)
        {
            // Delete old avatar if exists
            if (!string.IsNullOrEmpty(team.Avatar))
            {
                await _s3Service.DeleteFileAsync(team.Avatar, $"teams/{id}");
            }

            var avatarUrl = await _s3Service.UploadFileAsync(avatar, $"teams/{id}");
            team.Avatar = avatarUrl;
        }

        await _teamRepository.UpdateAsync(id, team);

        var result = _mapper.Map<TeamDto>(team);
        if (!string.IsNullOrEmpty(team.Avatar))
        {
            result.Avatar = await _s3Service.GetPresignedUrlAsync(team.Avatar, $"teams/{team.Id}");
        }

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

        // Delete avatar from S3 if exists
        if (!string.IsNullOrEmpty(team.Avatar))
        {
            await _s3Service.DeleteFileAsync(team.Avatar, $"teams/{id}");
        }

        await _teamRepository.DeleteAsync(id);
        return Ok(new { message = "Team member deleted" });
    }
}