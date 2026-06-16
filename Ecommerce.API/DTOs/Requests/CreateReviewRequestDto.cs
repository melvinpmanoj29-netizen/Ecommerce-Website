namespace Ecommerce.API.DTOs.Requests;

public class CreateReviewRequestDto
{
    public int ProductId { get; set; }

    public int Rating { get; set; }

    public string Comment { get; set; }
        = string.Empty;
}