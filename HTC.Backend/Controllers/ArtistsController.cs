using Microsoft.AspNetCore.Mvc;
using HTC.Backend.DTOs;

namespace HTC.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ArtistsController : ControllerBase
{
    public ArtistsController()
    {
        // Mock data controller - no dependencies needed
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedResultDto<ArtistDto>>> GetArtists(
        [FromQuery] int page = 1,
        [FromQuery] int per_page = 10,
        [FromQuery] string? style = null,
        [FromQuery] string? name = null,
        [FromQuery] DateTime? created_at = null)
    {
        // Mock data for demo
        var mockArtists = new List<ArtistDto>
        {
            new ArtistDto
            {
                Id = "1",
                Name = "John Artist",
                Style = "Digital Art",
                LinkX = "https://twitter.com/johnartist",
                XTag = "johnartist",
                Avatar = "https://via.placeholder.com/150",
                Disabled = false,
                TotalImage = 15,
                CreatedAt = DateTime.UtcNow.AddDays(-10),
                UpdatedAt = DateTime.UtcNow.AddDays(-5)
            },
            new ArtistDto
            {
                Id = "2",
                Name = "Jane Creator",
                Style = "3D Art",
                LinkX = "https://twitter.com/janecreator",
                XTag = "janecreator",
                Avatar = "https://via.placeholder.com/150",
                Disabled = false,
                TotalImage = 8,
                CreatedAt = DateTime.UtcNow.AddDays(-8),
                UpdatedAt = DateTime.UtcNow.AddDays(-3)
            },
            new ArtistDto
            {
                Id = "3",
                Name = "Bob Designer",
                Style = "Concept Art",
                LinkX = "https://twitter.com/bobdesigner",
                XTag = "bobdesigner",
                Avatar = "https://via.placeholder.com/150",
                Disabled = false,
                TotalImage = 22,
                CreatedAt = DateTime.UtcNow.AddDays(-15),
                UpdatedAt = DateTime.UtcNow.AddDays(-1)
            }
        };

        await Task.Delay(1); // Make it async

        var filteredArtists = mockArtists.AsQueryable();

        if (!string.IsNullOrEmpty(style))
            filteredArtists = filteredArtists.Where(x => x.Style.Contains(style));
        
        if (!string.IsNullOrEmpty(name))
            filteredArtists = filteredArtists.Where(x => x.Name.Contains(name));

        var totalCount = filteredArtists.Count();
        var pagedArtists = filteredArtists.Skip((page - 1) * per_page).Take(per_page).ToList();
        var totalPages = (int)Math.Ceiling((double)totalCount / per_page);

        return Ok(new PaginatedResultDto<ArtistDto>
        {
            CurrentPage = page,
            TotalPages = totalPages,
            TotalRecords = totalCount,
            Datas = pagedArtists
        });
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ArtistDto>> GetArtist(string id)
    {
        await Task.Delay(1); // Make it async

        // Mock artist data
        var mockArtist = new ArtistDto
        {
            Id = id,
            Name = "John Artist",
            Style = "Digital Art",
            LinkX = "https://twitter.com/johnartist",
            XTag = "johnartist",
            Avatar = "https://via.placeholder.com/150",
            Disabled = false,
            TotalImage = 15,
            CreatedAt = DateTime.UtcNow.AddDays(-10),
            UpdatedAt = DateTime.UtcNow.AddDays(-5)
        };

        return Ok(mockArtist);
    }

    // TODO: Implement other CRUD operations when MongoDB/S3 are configured
    // [HttpPost]
    // [HttpPut("{id}")]
    // [HttpDelete("{id}")]
    // [HttpGet("{id}/images")]
}