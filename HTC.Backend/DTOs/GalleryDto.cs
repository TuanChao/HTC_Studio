namespace HTC.Backend.DTOs;

public class GalleryDto : BaseDto
{
    public string ArtistId { get; set; } = string.Empty;
    public string Picture { get; set; } = string.Empty;
    public bool ShowOnTop { get; set; }
}

public class CreateGalleryDto
{
    public string ArtistId { get; set; } = string.Empty;
    public string Picture { get; set; } = string.Empty;
    public bool ShowOnTop { get; set; } = false;
}

public class UpdateGalleryDto
{
    public string? ArtistId { get; set; }
    public string? Picture { get; set; }
    public bool? ShowOnTop { get; set; }
}