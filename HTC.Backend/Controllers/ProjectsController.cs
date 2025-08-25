using HTC.Backend.DTOs.EarthMap;
using HTC.Backend.Models.EarthMap;
using HTC.Backend.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace HTC.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase
    {
        private readonly IMongoDbContext _dbContext;
        private readonly IMongoCollection<Project> _projectCollection;

        public ProjectsController(IMongoDbContext dbContext)
        {
            _dbContext = dbContext;
            _projectCollection = _dbContext.GetCollection<Project>();
        }

        // GET: api/projects
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectResponseDto>>> GetProjects()
        {
            try
            {
                var projects = await _projectCollection
                    .Find(p => p.IsActive)
                    .ToListAsync();

                var projectDtos = projects.Select(MapToResponseDto).ToList();
                return Ok(projectDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy danh sách dự án", error = ex.Message });
            }
        }

        // GET: api/projects/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectResponseDto>> GetProject(string id)
        {
            try
            {
                var project = await _projectCollection
                    .Find(p => p.Id == id && p.IsActive)
                    .FirstOrDefaultAsync();

                if (project == null)
                {
                    return NotFound(new { message = "Không tìm thấy dự án" });
                }

                return Ok(MapToResponseDto(project));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy thông tin dự án", error = ex.Message });
            }
        }

        // POST: api/projects
        [HttpPost]
        public async Task<ActionResult<ProjectResponseDto>> CreateProject([FromForm] CreateProjectDto createDto, IFormFile? logo)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var project = MapToProject(createDto);
                
                // Handle logo upload
                if (logo != null && logo.Length > 0)
                {
                    var logoUrl = await SaveLogoFile(logo);
                    project.Logo = logoUrl;
                }
                // If no file uploaded, leave logo empty or use a default

                project.CreatedAt = DateTime.UtcNow;
                project.UpdatedAt = DateTime.UtcNow;

                await _projectCollection.InsertOneAsync(project);

                return CreatedAtAction(
                    nameof(GetProject),
                    new { id = project.Id },
                    MapToResponseDto(project)
                );
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi tạo dự án", error = ex.Message });
            }
        }

        // PUT: api/projects/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(string id, [FromForm] UpdateProjectDto updateDto, IFormFile? logo)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var existingProject = await _projectCollection
                    .Find(p => p.Id == id && p.IsActive)
                    .FirstOrDefaultAsync();

                if (existingProject == null)
                {
                    return NotFound(new { message = "Không tìm thấy dự án" });
                }

                // Update fields
                existingProject.ProjectName = updateDto.ProjectName;
                existingProject.Description = updateDto.Description;
                existingProject.XLink = updateDto.XLink;
                existingProject.Lat = updateDto.Lat;
                existingProject.Lng = updateDto.Lng;
                existingProject.Size = updateDto.Size;
                existingProject.IsActive = updateDto.IsActive;
                existingProject.UpdatedAt = DateTime.UtcNow;

                // Handle logo upload
                if (logo != null && logo.Length > 0)
                {
                    var logoUrl = await SaveLogoFile(logo);
                    existingProject.Logo = logoUrl;
                }
                // Keep existing logo if no new file uploaded

                await _projectCollection.ReplaceOneAsync(
                    p => p.Id == id,
                    existingProject
                );

                return Ok(new { message = "Cập nhật dự án thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi cập nhật dự án", error = ex.Message });
            }
        }

        // DELETE: api/projects/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(string id)
        {
            try
            {
                var project = await _projectCollection
                    .Find(p => p.Id == id && p.IsActive)
                    .FirstOrDefaultAsync();

                if (project == null)
                {
                    return NotFound(new { message = "Không tìm thấy dự án" });
                }

                // Soft delete
                project.IsActive = false;
                project.UpdatedAt = DateTime.UtcNow;

                await _projectCollection.ReplaceOneAsync(
                    p => p.Id == id,
                    project
                );

                return Ok(new { message = "Xóa dự án thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi xóa dự án", error = ex.Message });
            }
        }

        // GET: api/projects/public (for public display)
        [HttpGet("public")]
        public async Task<ActionResult<IEnumerable<ProjectResponseDto>>> GetPublicProjects()
        {
            try
            {
                var projects = await _projectCollection
                    .Find(p => p.IsActive)
                    .SortBy(p => p.CreatedAt)
                    .ToListAsync();

                var projectDtos = projects.Select(MapToResponseDto).ToList();
                return Ok(projectDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy danh sách dự án công khai", error = ex.Message });
            }
        }

        #region Private Methods

        private static ProjectResponseDto MapToResponseDto(Project project)
        {
            return new ProjectResponseDto
            {
                Id = project.Id,
                ProjectName = project.ProjectName,
                Description = project.Description,
                XLink = project.XLink,
                Logo = project.Logo,
                Lat = project.Lat,
                Lng = project.Lng,
                Size = project.Size,
                CreatedAt = project.CreatedAt,
                UpdatedAt = project.UpdatedAt,
                IsActive = project.IsActive
            };
        }

        private static Project MapToProject(CreateProjectDto dto)
        {
            return new Project
            {
                ProjectName = dto.ProjectName,
                Description = dto.Description,
                XLink = dto.XLink,
                Logo = dto.Logo,
                Lat = dto.Lat,
                Lng = dto.Lng,
                Size = dto.Size,
                IsActive = dto.IsActive
            };
        }

        private async Task<string> SaveLogoFile(IFormFile logo)
        {
            var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "logos");
            if (!Directory.Exists(uploadsPath))
            {
                Directory.CreateDirectory(uploadsPath);
            }

            var fileExtension = Path.GetExtension(logo.FileName);
            var fileName = $"{Guid.NewGuid()}{fileExtension}";
            var filePath = Path.Combine(uploadsPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await logo.CopyToAsync(stream);
            }

            return $"/uploads/logos/{fileName}";
        }

        #endregion
    }
}