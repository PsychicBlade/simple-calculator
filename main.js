/** @type {HTMLDivElement} */
const screen = document.querySelector(".calculator-screen");

let operator = "";
let accumulator = "";
let value = "0";

function isDecimal() {
  return value.includes(".");
}

function update() {
  screen.classList.remove("calculator-screen--error");
  screen.textContent = value;
}

function error() {
  screen.classList.add("calculator-screen--error");
  screen.textContent = "ERROR";
}

update();

const handlers = {
  ".": createDotClickHandler(),
  "="() {
    if (operator === "") return;

    const op = operators[operator];

    const a = parseFloat(accumulator);
    const b = parseFloat(value);

    if (operator === "÷" && b === 0) return error();

    const result = op(a, b);

    value = result.toString();

    update();
  },
};

const strings = {
  ".": ".",
  "+": "+",
  "-": "-",
  "/": "÷",
  "*": "×",
};

const operators = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "÷": (a, b) => a / b,
  "×": (a, b) => a * b,
};

for (let i = 0; i < 10; i++) {
  handlers[i] = createDigitClickHandler(i);
}

for (const operator of ["+", "-", "÷", "×"]) {
  handlers[operator] = createOperatorHandler(operator);
}

/** @param {MouseEvent} event */
function onButtonClick(event) {
  handlers[event.target.textContent]();
}

const others = [".", "+", "-", "/", "*"];

/** @param {KeyboardEvent} event */
function onKeyPressed(event) {
  const k = event.key;

  if (k === "Enter") return handlers["="]();

  if (others.includes(k)) return handlers[strings[k]]();

  if (0 <= k && k <= 9) return handlers[k]();
}

/** @type {NodeListOf<HTMLButtonElement>} */
const buttons = document.querySelectorAll(".calculator-buttons button");

for (const button of buttons) {
  button.addEventListener("click", onButtonClick, false);
}

document.addEventListener("keyup", onKeyPressed, false);

function createOperatorHandler(op) {
  return () => {
    operator = op;
    accumulator = value;
    value = "0";
    update();
  };
}

function createDotClickHandler() {
  const dotHandler = createDigitClickHandler(".");
  return () => {
    if (isDecimal()) return;
    return dotHandler();
  };
}

function createDigitClickHandler(digit) {
  digit = digit.toString();
  return () => {
    if (value.length === 21) return;

    if (value === "0" && digit !== ".") {
      value = digit;
    } else {
      value += digit;
    }

    update();
  };
}
