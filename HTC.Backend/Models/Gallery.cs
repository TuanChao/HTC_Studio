using MongoDB.Bson.Serialization.Attributes;

namespace HTC.Backend.Models;

[BsonCollection("galleries")]
public class Gallery : BaseModel
{
    [BsonElement("artist_id")]
    public string ArtistId { get; set; } = string.Empty;

    [BsonElement("picture")]
    public string Picture { get; set; } = string.Empty;

    [BsonElement("show_on_top")]
    public bool ShowOnTop { get; set; } = false;
}