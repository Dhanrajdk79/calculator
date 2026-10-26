
const form = document.getElementById("calculator-form");
const resultElement = document.getElementById("result");
const historyList = document.getElementById("history");
const copyButton = document.getElementById("copy-result");
const resetButton = document.getElementById("reset");

let latestResult = null;
let calculationHistory = [];

const page = document.body.id;

const operations = {
    addition: {
        symbol: "+",
        calculate: (a, b) => a + b
    },
    subtraction: {
        symbol: "-",
        calculate: (a, b) => a - b
    },
    multiplication: {
        symbol: "×",
        calculate: (a, b) => a * b
    },
    division: {
        symbol: "÷",
        calculate: (a, b) => a / b
    }
};

function showResult(message) {
    resultElement.textContent = message;
}

function renderHistory() {
    historyList.replaceChildren();

    calculationHistory.forEach(function (item) {
        const li = document.createElement("li");
        li.textContent = item;
        historyList.appendChild(li);
    });
}

if (form && operations[page]) {
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const firstValue = document.getElementById("num1").value;
        const secondValue = document.getElementById("num2").value;

        if (firstValue.trim() === "" || secondValue.trim() === "") {
            showResult("Please enter both numbers.");
            return;
        }

        const a = Number(firstValue);
        const b = Number(secondValue);

        if (!Number.isFinite(a) || !Number.isFinite(b)) {
            showResult("Please enter valid numbers.");
            return;
        }

        if (page === "division" && b === 0) {
            latestResult = null;
            showResult("Cannot divide by zero.");
            return;
        }

        const operation = operations[page];
        const answer = operation.calculate(a, b);

        if (!Number.isFinite(answer)) {
            showResult("The result is outside the supported range.");
            return;
        }

        latestResult = String(answer);

        showResult(`${a} ${operation.symbol} ${b} = ${latestResult}`);

        calculationHistory.unshift(
            `${a} ${operation.symbol} ${b} = ${latestResult}`
        );

        calculationHistory = calculationHistory.slice(0, 5);
        renderHistory();
    });
}

if (resetButton) {
    resetButton.addEventListener("click", function () {
        latestResult = null;
        showResult("Your answer will appear here");
    });
}

if (copyButton) {
    copyButton.addEventListener("click", async function () {
        if (latestResult === null) {
            showResult("Calculate a result before copying.");
            return;
        }

        try {
            await navigator.clipboard.writeText(latestResult);
            showResult(`Copied result: ${latestResult}`);
        } catch {
            showResult("Copy is unavailable in this browser context.");
        }
    });
}
