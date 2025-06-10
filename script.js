const inputDisplay = document.getElementById("calculator-input");
const outputDisplay = document.getElementById("calculator-output");
const historyDisplay = document.getElementById("history-display");

// Explicitly select the C and CE buttons
const clearButton = document.getElementById("clear-btn");        // C button
const clearEverythingButton = document.getElementById("clear-all-btn"); // CE button

let currentInput = "";
let lastResult = null;

// Handle all other buttons except C and CE
document.querySelectorAll(".calculator-buttons button").forEach(button => {
  // Skip C and CE buttons here to avoid double binding
  if (button === clearButton || button === clearEverythingButton) return;
  button.addEventListener("click", () => handleInput(button.value));
});

// Add event listener for clear (C) button
clearButton.addEventListener("click", () => {
  handleInput("C");
});

// Add event listener for clear everything (CE) button
clearEverythingButton.addEventListener("click", () => {
  handleInput("CE");
});

// Handle keyboard input
document.addEventListener("keydown", ({ key }) => {
  if (/[0-9+\-*/.^()]/.test(key)) handleInput(key);
  if (key === "Enter") handleInput("=");
  if (key === "Backspace") handleInput("C");
});

function handleInput(value) {
  switch (value) {
    case "=":
      return calculate();

    case "C":
      // Remove last character
      currentInput = currentInput.slice(0, -1);
      break;

    case "CE":
      // Clear all input and output, reset lastResult
      currentInput = "";
      lastResult = null;
      outputDisplay.textContent = "0";
      break;

    default:
      const isOperator = ["+", "-", "*", "/", "^"].includes(value);
      if (isOperator && !currentInput && lastResult !== null) {
        currentInput = lastResult.toString() + value;
      } else {
        currentInput += value;
      }
  }

  inputDisplay.textContent = currentInput || "0";
}

function calculate() {
  if (!currentInput) return;
  try {
    const expression = currentInput.replace(/\^/g, "**");
    const result = eval(expression);
    outputDisplay.textContent = result;
    addToHistory(currentInput, result);
    lastResult = result;
    currentInput = "";
  } catch {
    outputDisplay.textContent = "Error";
  }
}

function addToHistory(expression, result) {
  const entry = `${expression} = ${result}`;
  const div = document.createElement("div");
  div.textContent = entry;
  historyDisplay.appendChild(div);

  const history = JSON.parse(localStorage.getItem("calcHistory") || "[]");
  history.push(entry);
  localStorage.setItem("calcHistory", JSON.stringify(history));
}

window.addEventListener("load", () => {
  const history = JSON.parse(localStorage.getItem("calcHistory") || "[]");
  history.forEach(entry => {
    const div = document.createElement("div");
    div.textContent = entry;
    historyDisplay.appendChild(div);
  });
});

document.getElementById("clear-history-btn").addEventListener("click", () => {
  historyDisplay.innerHTML = "";
  localStorage.removeItem("calcHistory");
});
