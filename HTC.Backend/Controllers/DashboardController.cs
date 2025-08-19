using Microsoft.AspNetCore.Mvc;
using HTC.Backend.Repositories;
using AutoMapper;

namespace HTC.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly IArtistRepository _artistRepository;
    private readonly IGalleryRepository _galleryRepository;
    private readonly IKolRepository _kolRepository;
    private readonly ITeamRepository _teamRepository;
    private readonly IMapper _mapper;

    public DashboardController(
        IArtistRepository artistRepository,
        IGalleryRepository galleryRepository,
        IKolRepository kolRepository,
        ITeamRepository teamRepository,
        IMapper mapper)
    {
        _artistRepository = artistRepository;
        _galleryRepository = galleryRepository;
        _kolRepository = kolRepository;
        _teamRepository = teamRepository;
        _mapper = mapper;
    }

    [HttpGet("stats")]
    public async Task<ActionResult> GetDashboardStats()
    {
        try
        {
            // Get actual counts from repositories
            var (artists, artistCount) = await _artistRepository.GetPagedAsync(1, 1000);
            var (galleries, galleryCount) = await _galleryRepository.GetPagedAsync(1, 1000);
            var (kols, kolCount) = await _kolRepository.GetPagedAsync(1, 1000);
            var (teams, teamCount) = await _teamRepository.GetPagedAsync(1, 1000);

            return Ok(new
            {
                artists = artistCount,
                galleries = galleryCount,
                kols = kolCount,
                teams = teamCount
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Failed to fetch dashboard stats", details = ex.Message });
        }
    }

    [HttpGet("activities")]
    public async Task<ActionResult> GetRecentActivities()
    {
        try
        {
            var activities = new List<object>();

            // Get recent artists (last 5)
            var (recentArtists, _) = await _artistRepository.GetPagedAsync(1, 5);
            foreach (var artist in recentArtists.OrderByDescending(a => a.CreatedAt))
            {
                activities.Add(new
                {
                    id = $"artist_{artist.Id}",
                    type = "artist",
                    action = "created",
                    name = $"Artist: {artist.Name}",
                    time = GetTimeAgo(artist.CreatedAt)
                });
            }

            // Get recent galleries (last 5)
            var (recentGalleries, _) = await _galleryRepository.GetPagedAsync(1, 5);
            foreach (var gallery in recentGalleries.OrderByDescending(g => g.CreatedAt))
            {
                activities.Add(new
                {
                    id = $"gallery_{gallery.Id}",
                    type = "gallery", 
                    action = "created",
                    name = $"Gallery: {gallery.Id}",
                    time = GetTimeAgo(gallery.CreatedAt)
                });
            }

            // Get recent KOLs (last 5)
            var (recentKols, _) = await _kolRepository.GetPagedAsync(1, 5);
            foreach (var kol in recentKols.OrderByDescending(k => k.CreatedAt))
            {
                activities.Add(new
                {
                    id = $"kol_{kol.Id}",
                    type = "kol",
                    action = "created", 
                    name = $"KOL: {kol.Name}",
                    time = GetTimeAgo(kol.CreatedAt)
                });
            }

            // Get recent teams (last 5)
            var (recentTeams, _) = await _teamRepository.GetPagedAsync(1, 5);
            foreach (var team in recentTeams.OrderByDescending(t => t.CreatedAt))
            {
                activities.Add(new
                {
                    id = $"team_{team.Id}",
                    type = "team",
                    action = "created",
                    name = $"Team: {team.Name}",
                    time = GetTimeAgo(team.CreatedAt)
                });
            }

            // Sort all activities by creation time and take top 10
            var sortedActivities = activities
                .OrderByDescending(a => a.GetType().GetProperty("time")?.GetValue(a))
                .Take(10)
                .ToList();

            return Ok(sortedActivities);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Failed to fetch recent activities", details = ex.Message });
        }
    }

    private string GetTimeAgo(DateTime dateTime)
    {
        var timeSpan = DateTime.UtcNow - dateTime;

        if (timeSpan.Days > 0)
            return $"{timeSpan.Days} day{(timeSpan.Days > 1 ? "s" : "")} ago";
        if (timeSpan.Hours > 0)
            return $"{timeSpan.Hours} hour{(timeSpan.Hours > 1 ? "s" : "")} ago";
        if (timeSpan.Minutes > 0)
            return $"{timeSpan.Minutes} minute{(timeSpan.Minutes > 1 ? "s" : "")} ago";
        
        return "Just now";
    }
}