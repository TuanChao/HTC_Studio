using MongoDB.Bson.Serialization.Attributes;

namespace HTC.Backend.Models;

[BsonCollection("kols")]
public class Kol : BaseModel
{
    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;

    [BsonElement("link_x")]
    public string? LinkX { get; set; }

    [BsonElement("avatar")]
    public string? Avatar { get; set; }

    [BsonElement("disabled")]
    public bool Disabled { get; set; } = false;
}