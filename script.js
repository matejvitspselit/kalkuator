const inputDisplay = document.getElementById("calculator-input");
const outputDisplay = document.getElementById("calculator-output");
const historyDisplay = document.getElementById("history-display");

let currentInput = "";
let lastResult = null;

// Handle button clicks
document.querySelectorAll(".calculator-buttons button").forEach(button =>
  button.addEventListener("click", () => handleInput(button.value))
);

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
      currentInput = currentInput.slice(0, -1);
      break;
    case "CE":
      currentInput = "";
      outputDisplay.textContent = "0";
      break;
    default:
      const isOperator = ["+", "-", "*", "/", "^"].includes(value);
      currentInput += isOperator && !currentInput && lastResult !== null
        ? lastResult + value
        : value;
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
