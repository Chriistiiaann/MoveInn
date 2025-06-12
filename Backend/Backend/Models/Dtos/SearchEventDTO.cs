using System.ComponentModel.DataAnnotations;

public class SearchEventDTO
{
    [Range(1, int.MaxValue, ErrorMessage = "La página debe ser mayor que 0")]
    public int Page { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "El límite debe ser mayor que 0")]
    public int Limit { get; set; }
    public string? Query { get; set; }
    public string? Location { get; set; }
    public string? City { get; set;}
    public string? Country { get; set; }
    public string? Category { get; set; }
    public List<string>? Tags { get; set; }
    public string? SortField { get; set; }
    public string? SortOrder { get; set; }
    public Guid? CurrentUserId { get; set; }

}

