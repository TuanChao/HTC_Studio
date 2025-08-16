namespace HTC.Backend.DTOs;

public class PaginatedResultDto<T>
{
    public int CurrentPage { get; set; }
    public int TotalPages { get; set; }
    public long TotalRecords { get; set; }
    public IEnumerable<T> Datas { get; set; } = new List<T>();
}

public class ArtistImagesDto
{
    public ArtistDto Artist { get; set; } = new();
    public IEnumerable<PictureDto> Pictures { get; set; } = new List<PictureDto>();
}

public class PictureDto
{
    public string Id { get; set; } = string.Empty;
    public string Picture { get; set; } = string.Empty;
}