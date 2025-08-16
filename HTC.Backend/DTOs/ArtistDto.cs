namespace HTC.Backend.DTOs;

public class ArtistDto : BaseDto
{
    public string Name { get; set; } = string.Empty;
    public string? LinkX { get; set; }
    public string Style { get; set; } = string.Empty;
    public string? XTag { get; set; }
    public string? Avatar { get; set; }
    public bool Disabled { get; set; }
    public long? TotalImage { get; set; }
}

public class CreateArtistDto
{
    public string Name { get; set; } = string.Empty;
    public string? LinkX { get; set; }
    public string Style { get; set; } = string.Empty;
    public string? XTag { get; set; }
    public bool Disabled { get; set; } = false;
}

public class UpdateArtistDto
{
    public string? Name { get; set; }
    public string? LinkX { get; set; }
    public string? Style { get; set; }
    public string? XTag { get; set; }
    public bool? Disabled { get; set; }
}