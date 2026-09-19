document.addEventListener("DOMContentLoaded", () => {
  const itemsList = document.getElementById("items-list");
  const addItemBtn = document.getElementById("add-item-btn");
  const subtotalEl = document.getElementById("subtotal-val");
  const grandTotalEl = document.getElementById("grand-total-val");
  const taxInput = document.getElementById("tax-rate");
  const pdfBtn = document.getElementById("download-pdf-btn");

  // Set default current date
  document.getElementById("invoice-date").valueAsDate = new Date();

  // Add initial item row
  addItemRow();

  addItemBtn.addEventListener("click", () => addItemRow());
  taxInput.addEventListener("input", calculateTotals);

  function addItemRow() {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><input type="text" class="item-desc" placeholder="Service description" required></td>
      <td><input type="number" class="item-qty" value="1" min="1"></td>
      <td><input type="number" class="item-rate" value="0.00" min="0" step="0.01"></td>
      <td class="item-total-val">$0.00</td>
      <td><button type="button" class="btn btn-danger remove-btn">×</button></td>
    `;

    tr.querySelector(".remove-btn").addEventListener("click", () => {
      tr.remove();
      calculateTotals();
    });

    tr.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", calculateTotals);
    });

    itemsList.appendChild(tr);
    calculateTotals();
  }

  function calculateTotals() {
    let subtotal = 0;
    const rows = itemsList.querySelectorAll("tr");

    rows.forEach((row) => {
      const qty = parseFloat(row.querySelector(".item-qty").value) || 0;
      const rate = parseFloat(row.querySelector(".item-rate").value) || 0;
      const rowTotal = qty * rate;

      row.querySelector(".item-total-val").textContent = `$${rowTotal.toFixed(2)}`;
      subtotal += rowTotal;
    });

    const taxRate = parseFloat(taxInput.value) || 0;
    const taxAmount = subtotal * (taxRate / 100);
    const grandTotal = subtotal + taxAmount;

    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    grandTotalEl.textContent = `$${grandTotal.toFixed(2)}`;
  }

  // Export Form to PDF
  pdfBtn.addEventListener("click", () => {
    const element = document.getElementById("invoice-form");

    // Hide action buttons during PDF generation
    addItemBtn.style.display = "none";
    pdfBtn.style.display = "none";
    document.querySelectorAll(".remove-btn").forEach((b) => (b.style.display = "none"));

    const opt = {
      margin: 0.5,
      filename: `invoice_${Date.now()}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      // Restore buttons after PDF is generated
      addItemBtn.style.display = "inline-block";
      pdfBtn.style.display = "block";
      document.querySelectorAll(".remove-btn").forEach((b) => (b.style.display = "inline-block"));
    });
  });
});
