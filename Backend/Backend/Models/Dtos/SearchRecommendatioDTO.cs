using Backend.Models.Database.Enum;

namespace Backend.Models.Dtos;

public class SearchRecommendatioDTO
{
    public string Query { get; set; } = "";
    public string SortField { get; set; } = "none";
    public string SortOrder { get; set; } = "none";
    public string Country { get; set; }
    public Category? Category { get; set; }

    public string City { get; set; }
    public int Page { get; set; } = 1;
    public int Limit { get; set; } = 10;

}
