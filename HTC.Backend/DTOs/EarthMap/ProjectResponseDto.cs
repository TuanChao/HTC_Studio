namespace HTC.Backend.DTOs.EarthMap
{
    public class ProjectResponseDto
    {
        public string Id { get; set; } = string.Empty;
        public string ProjectName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string XLink { get; set; } = string.Empty;
        public string Logo { get; set; } = string.Empty;
        public double Lat { get; set; }
        public double Lng { get; set; }
        public double Size { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool IsActive { get; set; }
    }
}