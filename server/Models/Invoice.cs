using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InvoiceCraft.Models
{
    public class Invoice
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(200)]
        public string CustomerName { get; set; } = string.Empty;
        
        [Required]
        [StringLength(20)]
        public string Phone { get; set; } = string.Empty;
        
        [Required]
        [StringLength(500)]
        public string Address { get; set; } = string.Empty;
        
        public List<InvoiceItem> Items { get; set; } = new List<InvoiceItem>();
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Total { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
