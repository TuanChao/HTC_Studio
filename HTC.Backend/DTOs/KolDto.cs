namespace HTC.Backend.DTOs;

public class KolDto : BaseDto
{
    public string Name { get; set; } = string.Empty;
    public string? LinkX { get; set; }
    public string? Avatar { get; set; }
    public bool Disabled { get; set; }
}

public class CreateKolDto
{
    public string Name { get; set; } = string.Empty;
    public string? LinkX { get; set; }
    public bool Disabled { get; set; } = false;
}

public class UpdateKolDto
{
    public string? Name { get; set; }
    public string? LinkX { get; set; }
    public bool? Disabled { get; set; }
}