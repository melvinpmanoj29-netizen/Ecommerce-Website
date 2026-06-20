namespace Ecommerce.API.Models;

public class Product
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal Price { get; set; }
    
    public decimal CostPrice { get; set; }

    public int Stock { get; set; }

    public string ImageUrl { get; set; } = string.Empty;

    public int CategoryId { get; set; }

    public Category Category { get; set; } = null!;

    public DateTime CreatedDate { get; set; }

    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}