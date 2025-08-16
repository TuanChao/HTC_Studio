using MongoDB.Bson.Serialization.Attributes;

namespace HTC.Backend.Models;

[BsonCollection("teams")]
public class Team : BaseModel
{
    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;

    [BsonElement("description")]
    public string? Description { get; set; }

    [BsonElement("avatar")]
    public string? Avatar { get; set; }

    [BsonElement("position")]
    public string Position { get; set; } = string.Empty;

    [BsonElement("disabled")]
    public bool Disabled { get; set; } = false;
}