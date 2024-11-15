
let weight = document.querySelector("#weight");
let particular = document.querySelector("#particular");
let amount = document.querySelector("#amount");
let cashout = document.querySelector("#cashout"); // Cash out field

// Arrays to store values
const wght = [];
const prtclr = [];
const amnt = [];
const cashOut = []; // Cash Out array
const dates = []; // Date array

// Elements for DOM updates
let submit = document.querySelector("#submit");
let validation = document.querySelector("#validation");

// Submit button and validation message
submit.addEventListener("click", () => {
  // Validation: Check if any field is empty
  if (weight.value === "" || particular.value === "" || amount.value === "" || cashout === ""){
    validation.style.display = "block";
    weight.style.border = "1px solid red";
    particular.style.border = "1px solid red";
    amount.style.border = "1px solid red";
  } else {
    validation.style.display = "none";
    weight.style.border = "";
    particular.style.border = "";
    amount.style.border = "";

    // Get current date
    let currentDate = new Date().toLocaleDateString();

    // Push input values into arrays
    wght.push(parseFloat(weight.value)); // Convert to number
    prtclr.push(particular.value);
    amnt.push(parseFloat(amount.value)); // Convert to number
    cashOut.push(parseFloat(cashout.value));
    dates.push(currentDate); // Date value

    // Clear input fields
    weight.value = "";
    particular.value = "";
    amount.value = "";
    cashout.value = "";

    // Create a new row in the entry section
    let entryRow = document.createElement("div");
    entryRow.classList.add("entryRow");

    // Add the weight, particular, amount, cash out, and date to the new row
    entryRow.innerHTML = `
        <span>${wght[wght.length - 1]}</span>
        <span>${prtclr[prtclr.length - 1]}</span>
        <span>${amnt[amnt.length - 1]}</span>
        <span>${cashOut[cashOut.length-1]}</span>
        <span>${dates[dates.length - 1]}</span>
        <span class="deleteBtn"><i class="fa-solid fa-trash"></i></span>
    `;

    // Append the new row to the entryValue section
    let entryValue = document.querySelector(".entryValue");
    entryValue.appendChild(entryRow);

    // Add delete event listener to the new row
    entryRow.querySelector(".deleteBtn").addEventListener("click", () => {
      let index = Array.from(entryValue.children).indexOf(entryRow);
      // Remove the corresponding data from arrays
      wght.splice(index, 1);
      prtclr.splice(index, 1);
      amnt.splice(index, 1);
      cashOut.splice(index, 1);
      dates.splice(index, 1);

      // Remove the row from the DOM
      entryRow.remove();

      // Recalculate the totals after removal
      calculateTotals();
    });
  }
});

// Function to calculate the total weight and total amount
function calculateTotals() {
  let totalW = wght.reduce((acc, val) => acc + val, 0);
  let totalAm = amnt.reduce((acc, val) => acc + val, 1);
  let cashOUT = cashOut.reduce((acc, val ) => acc + val, 1);
  totalAm = totalAm - cashOUT;

  // Update the total values in the DOM
  document.querySelector(".weight-total").textContent = ` ${totalW} kg`;
  document.querySelector(".amount-total").textContent = `RS= ${totalAm}`;
}

// Event listener for the total button
let btn = document.querySelector("#btn");
btn.addEventListener("click", calculateTotals);

// Save as PDF function
document.querySelector("#saveBtn").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let yOffset = 10;

  // Add title
  doc.setFontSize(18);
  doc.text("MA STEEL CASH ACCOUNT", 10, yOffset);
  yOffset += 10;

  // Add table headers
  doc.setFontSize(12);
  doc.text("Weight", 10, yOffset);
  doc.text("Particular", 40, yOffset);
  doc.text("Cash In", 90, yOffset);
  doc.text("Cash Out", 130, yOffset);
  doc.text("Date", 170, yOffset);
  yOffset += 10;

  // Add data rows
  for (let i = 0; i < wght.length; i++) {
    doc.text(`${wght[i]}`, 10, yOffset);
    doc.text(`${prtclr[i]}`, 40, yOffset);
    doc.text(`${amnt[i]}`, 90, yOffset);
    doc.text(`${cashOut[i]}`, 130, yOffset);
    doc.text(`${dates[i]}`, 170, yOffset);
    yOffset += 10;
  }

  // Add total
  doc.text(
    `Total Weight: ${wght.reduce((acc, val) => acc + val, 0)} kg`,
    10,
    yOffset
  );
  doc.text(
    `Total Cash In: Rs ${amnt.reduce((acc, val) => acc + val, 0)}`,
    90,
    yOffset
  );

  // Save the PDF
  doc.save("cash_account_report.pdf");
});
