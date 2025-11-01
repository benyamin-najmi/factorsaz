using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InvoiceCraft.Models
{
    public class InvoiceItem
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "تعداد باید بیشتر از صفر باشد")]
        public int Quantity { get; set; }
        
        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "قیمت نمی‌تواند منفی باشد")]
        [Column(TypeName = "decimal(18,2)")]
        public decimal UnitPrice { get; set; }
        
        [Range(0, 100, ErrorMessage = "مالیات باید بین 0 تا 100 درصد باشد")]
        [Column(TypeName = "decimal(5,2)")]
        public decimal Tax { get; set; }
        
        public int InvoiceId { get; set; }
        public Invoice Invoice { get; set; } = null!;
    }
}
