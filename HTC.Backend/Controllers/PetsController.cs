using AutoMapper;
using HTC.Backend.DTOs;
using HTC.Backend.Models;
using HTC.Backend.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace HTC.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PetsController : ControllerBase
{
    private readonly IPetRepository _petRepository;
    private readonly IMapper _mapper;

    public PetsController(
        IPetRepository petRepository,
        IMapper mapper)
    {
        _petRepository = petRepository;
        _mapper = mapper;
    }

    [HttpPost]
    public async Task<ActionResult<PetDto>> CreatePet([FromForm] CreatePetDto createDto, IFormFile? avatar)
    {
        Console.WriteLine($"CreatePet called with Name: {createDto.Name}");
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

        var pet = _mapper.Map<Pet>(createDto);

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

            pet.Avatar = $"/uploads/avatars/{fileName}";
        }

        var createdPet = await _petRepository.CreateAsync(pet);

        var result = _mapper.Map<PetDto>(createdPet);
        return CreatedAtAction(nameof(GetPet), new { id = createdPet.Id }, result);
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedResultDto<PetDto>>> GetPets(
        [FromQuery] int page = 1,
        [FromQuery] int per_page = 10,
        [FromQuery] string? name = null,
        [FromQuery] DateTime? created_at = null)
    {
        var (pets, totalCount) = await _petRepository.GetPagedAsync(
            page,
            per_page,
            filter: x => (string.IsNullOrEmpty(name) || x.Name.Contains(name)) &&
                        (!created_at.HasValue || x.CreatedAt >= created_at.Value)
        );

        var petDtos = _mapper.Map<List<PetDto>>(pets);

        var totalPages = (int)Math.Ceiling((double)totalCount / per_page);

        return Ok(new PaginatedResultDto<PetDto>
        {
            CurrentPage = page,
            TotalPages = totalPages,
            TotalRecords = totalCount,
            Datas = petDtos
        });
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PetDto>> GetPet(string id)
    {
        var pet = await _petRepository.GetByIdAsync(id);
        if (pet == null)
        {
            return NotFound(new { error = "Pet not found" });
        }

        var result = _mapper.Map<PetDto>(pet);
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<PetDto>> UpdatePet(string id, [FromForm] UpdatePetDto updateDto, IFormFile? avatar)
    {
        var pet = await _petRepository.GetByIdAsync(id);
        if (pet == null)
        {
            return NotFound(new { error = "Pet not found" });
        }

        _mapper.Map(updateDto, pet);

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
            if (!string.IsNullOrEmpty(pet.Avatar))
            {
                var oldFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", pet.Avatar.TrimStart('/'));
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

            pet.Avatar = $"/uploads/avatars/{fileName}";
        }

        await _petRepository.UpdateAsync(id, pet);

        var result = _mapper.Map<PetDto>(pet);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeletePet(string id)
    {
        var pet = await _petRepository.GetByIdAsync(id);
        if (pet == null)
        {
            return NotFound(new { error = "Pet not found" });
        }

        // Delete associated avatar file if exists
        if (!string.IsNullOrEmpty(pet.Avatar))
        {
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", pet.Avatar.TrimStart('/'));
            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }
        }

        await _petRepository.DeleteAsync(id);
        return Ok(new { message = "Pet deleted" });
    }
}