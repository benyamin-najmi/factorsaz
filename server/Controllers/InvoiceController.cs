using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InvoiceCraft.Data;
using InvoiceCraft.Models;

namespace InvoiceCraft.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InvoiceController : ControllerBase
    {
        private readonly InvoiceDbContext _context;

        public InvoiceController(InvoiceDbContext context)
        {
            _context = context;
        }

        // GET: api/invoices
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Invoice>>> GetInvoices()
        {
            try
            {
                var invoices = await _context.Invoices
                    .Include(i => i.Items)
                    .OrderByDescending(i => i.CreatedAt)
                    .ToListAsync();

                return Ok(invoices);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "خطا در دریافت فاکتورها", error = ex.Message });
            }
        }

        // GET: api/invoices/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Invoice>> GetInvoice(int id)
        {
            try
            {
                var invoice = await _context.Invoices
                    .Include(i => i.Items)
                    .FirstOrDefaultAsync(i => i.Id == id);

                if (invoice == null)
                {
                    return NotFound(new { message = "فاکتور مورد نظر یافت نشد" });
                }

                return Ok(invoice);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "خطا در دریافت فاکتور", error = ex.Message });
            }
        }

        // POST: api/invoices
        [HttpPost]
        public async Task<ActionResult<Invoice>> CreateInvoice(Invoice invoice)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Calculate total
                invoice.Total = CalculateInvoiceTotal(invoice.Items);
                invoice.CreatedAt = DateTime.Now;

                _context.Invoices.Add(invoice);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetInvoice), new { id = invoice.Id }, invoice);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "خطا در ایجاد فاکتور", error = ex.Message });
            }
        }

        // PUT: api/invoices/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateInvoice(int id, Invoice invoice)
        {
            try
            {
                if (id != invoice.Id)
                {
                    return BadRequest(new { message = "شناسه فاکتور مطابقت ندارد" });
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var existingInvoice = await _context.Invoices
                    .Include(i => i.Items)
                    .FirstOrDefaultAsync(i => i.Id == id);

                if (existingInvoice == null)
                {
                    return NotFound(new { message = "فاکتور مورد نظر یافت نشد" });
                }

                // Update invoice properties
                existingInvoice.CustomerName = invoice.CustomerName;
                existingInvoice.Phone = invoice.Phone;
                existingInvoice.Address = invoice.Address;
                existingInvoice.Total = CalculateInvoiceTotal(invoice.Items);

                // Remove existing items
                _context.InvoiceItems.RemoveRange(existingInvoice.Items);

                // Add new items
                foreach (var item in invoice.Items)
                {
                    item.InvoiceId = id;
                    _context.InvoiceItems.Add(item);
                }

                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "خطا در به‌روزرسانی فاکتور", error = ex.Message });
            }
        }

        // DELETE: api/invoices/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInvoice(int id)
        {
            try
            {
                var invoice = await _context.Invoices
                    .Include(i => i.Items)
                    .FirstOrDefaultAsync(i => i.Id == id);

                if (invoice == null)
                {
                    return NotFound(new { message = "فاکتور مورد نظر یافت نشد" });
                }

                _context.Invoices.Remove(invoice);
                await _context.SaveChangesAsync();

                return Ok(new { message = "فاکتور با موفقیت حذف شد" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "خطا در حذف فاکتور", error = ex.Message });
            }
        }

        private decimal CalculateInvoiceTotal(List<InvoiceItem> items)
        {
            decimal total = 0;
            foreach (var item in items)
            {
                decimal subtotal = item.Quantity * item.UnitPrice;
                decimal taxAmount = (subtotal * item.Tax) / 100;
                total += subtotal + taxAmount;
            }
            return total;
        }
    }
}
