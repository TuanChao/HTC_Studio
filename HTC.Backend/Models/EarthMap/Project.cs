using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using HTC.Backend.Models;

namespace HTC.Backend.Models.EarthMap
{
    [BsonCollection("projects")]
    public class Project
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string ProjectName { get; set; } = string.Empty;

        [Required]
        [StringLength(1000)]
        public string Description { get; set; } = string.Empty;

        [Required]
        [StringLength(500)]
        public string XLink { get; set; } = string.Empty;

        [Required]
        [StringLength(500)]
        public string Logo { get; set; } = string.Empty;

        [Required]
        [Range(-90, 90)]
        public double Lat { get; set; }

        [Required]
        [Range(-180, 180)]
        public double Lng { get; set; }

        [Range(0.1, 2.0)]
        public double Size { get; set; } = 0.3;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public bool IsActive { get; set; } = true;
    }
}