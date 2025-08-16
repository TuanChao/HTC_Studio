using MongoDB.Bson.Serialization.Attributes;

namespace HTC.Backend.Models;

[BsonCollection("artists")]
public class Artist : BaseModel
{
    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;

    [BsonElement("link_x")]
    public string? LinkX { get; set; }

    [BsonElement("style")]
    public string Style { get; set; } = string.Empty;

    [BsonElement("x_tag")]
    public string? XTag { get; set; }

    [BsonElement("avatar")]
    public string? Avatar { get; set; }

    [BsonElement("disabled")]
    public bool Disabled { get; set; } = false;
}

public class BsonCollectionAttribute : Attribute
{
    public string CollectionName { get; }

    public BsonCollectionAttribute(string collectionName)
    {
        CollectionName = collectionName;
    }
}