using Microsoft.EntityFrameworkCore;
using InvoiceCraft.Models;

namespace InvoiceCraft.Data
{
    public class InvoiceDbContext : DbContext
    {
        public InvoiceDbContext(DbContextOptions<InvoiceDbContext> options) : base(options)
        {
        }

        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<InvoiceItem> InvoiceItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Invoice entity
            modelBuilder.Entity<Invoice>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.CustomerName).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Phone).IsRequired().HasMaxLength(20);
                entity.Property(e => e.Address).IsRequired().HasMaxLength(500);
                entity.Property(e => e.Total).HasColumnType("decimal(18,2)");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("datetime('now')");
            });

            // Configure InvoiceItem entity
            modelBuilder.Entity<InvoiceItem>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
                entity.Property(e => e.UnitPrice).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Tax).HasColumnType("decimal(5,2)");
                
                // Configure relationship
                entity.HasOne(e => e.Invoice)
                      .WithMany(e => e.Items)
                      .HasForeignKey(e => e.InvoiceId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
