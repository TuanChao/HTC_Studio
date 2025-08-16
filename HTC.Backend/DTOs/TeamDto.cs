namespace HTC.Backend.DTOs;

public class TeamDto : BaseDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Avatar { get; set; }
    public string Position { get; set; } = string.Empty;
    public bool Disabled { get; set; }
}

public class CreateTeamDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Position { get; set; } = string.Empty;
    public bool Disabled { get; set; } = false;
}

public class UpdateTeamDto
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? Position { get; set; }
    public bool? Disabled { get; set; }
}