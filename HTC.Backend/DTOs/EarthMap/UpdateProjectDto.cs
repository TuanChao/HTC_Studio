using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace HTC.Backend.DTOs.EarthMap
{
    public class UpdateProjectDto
    {
        [Required(ErrorMessage = "Tên dự án là bắt buộc")]
        [StringLength(200, ErrorMessage = "Tên dự án không được quá 200 ký tự")]
        [JsonPropertyName("projectName")]
        public string ProjectName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Mô tả là bắt buộc")]
        [StringLength(1000, ErrorMessage = "Mô tả không được quá 1000 ký tự")]
        [JsonPropertyName("description")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "Link X/Twitter là bắt buộc")]
        [StringLength(500, ErrorMessage = "Link không được quá 500 ký tự")]
        [Url(ErrorMessage = "Link không hợp lệ")]
        [JsonPropertyName("xLink")]
        public string XLink { get; set; } = string.Empty;

        [StringLength(500, ErrorMessage = "Đường dẫn logo không được quá 500 ký tự")]
        [JsonPropertyName("logo")]
        public string Logo { get; set; } = string.Empty;

        [Required(ErrorMessage = "Vĩ độ là bắt buộc")]
        [Range(-90, 90, ErrorMessage = "Vĩ độ phải nằm trong khoảng -90 đến 90")]
        [JsonPropertyName("lat")]
        public double Lat { get; set; }

        [Required(ErrorMessage = "Kinh độ là bắt buộc")]
        [Range(-180, 180, ErrorMessage = "Kinh độ phải nằm trong khoảng -180 đến 180")]
        [JsonPropertyName("lng")]
        public double Lng { get; set; }

        [Range(0.1, 2.0, ErrorMessage = "Kích thước marker phải nằm trong khoảng 0.1 đến 2.0")]
        [JsonPropertyName("size")]
        public double Size { get; set; } = 0.3;

        [JsonPropertyName("isActive")]
        public bool IsActive { get; set; } = true;
    }
}