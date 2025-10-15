/** @format */

import { useState } from "react";
import { evaluate } from "mathjs";

export default function App() {
	const [input, setInput] = useState("0");
	const [display, setDisplay] = useState("0");
	const [isInputPrevResult, setIsInputPrevResult] = useState(false);

	return (
		<div
			id="outer-container"
			className="d-flex flex-column text-center bg-primary min-vh-100 fw-bold"
		>
			<h1 className="p-3 mb-0 bg-secondary">Javascript Calculator</h1>
			<div
				id="calculator-container"
				className="flex-fill d-flex justify-content-center align-items-center bg-primary-subtle"
			>
				<div id="calculator" className="calculator bg-success">
					<Screen input={input} display={display} />
					<Buttons
						input={input}
						setInput={setInput}
						setDisplay={setDisplay}
						isInputPrevResult={isInputPrevResult}
						setIsInputPrevResult={setIsInputPrevResult}
					/>
				</div>
			</div>
		</div>
	);
}

function Screen({ input, display }) {
	return (
		<div className="bg-warning calc-grid-col-4 text-end" id="screen">
			<div id="input" className="input-display mx-3 fw-light">
				{input}
			</div>
			<div className="mx-3 fs-3" id="display">
				{display}
			</div>
		</div>
	);
}

// --- Helper regexes ---
const TRAILING_OPERATOR_REGEX = /[+\-x/]$/;
const OPERATOR_AND_NEGATIVE_REGEX = /[+x/]\s-$/;

// --- Buttons Component ---
function Buttons({
	input,
	setInput,
	setDisplay,
	isInputPrevResult,
	setIsInputPrevResult,
}) {
	// Handles all button input
	const handleInput = async enteredChar => {
		// --- Evaluate expression ---
		if (enteredChar === "=") {
			let stringInput = String(input);

			// Remove trailing operator if present
			const hasTrailingOperator =
				TRAILING_OPERATOR_REGEX.test(stringInput);
			const expression = hasTrailingOperator
				? stringInput.slice(0, -2)
				: stringInput;

			// Replace 'x' with '*' for mathjs
			const mathExpression = expression.replace(/x/g, "*");

			const evaluated = await Promise.resolve(
				String(evaluate(mathExpression))
			);

			setIsInputPrevResult(true);
			setInput(evaluated);
			setDisplay(evaluated);
			return;
		}

		// --- Clear calculator ---
		if (enteredChar === "AC") {
			setInput("0");
			setDisplay("0");
			setIsInputPrevResult(false);
			return;
		}

		// --- Process other input ---
		const cleanedInput = await cleanInputAsync(
			input,
			enteredChar,
			isInputPrevResult,
			setIsInputPrevResult
		);

		// Extract the current number for display
		const currentNumberMatch = cleanedInput.match(/\d+\.?\d*(?!.*\d)/);
		const currentNumber = currentNumberMatch ? currentNumberMatch[0] : "0";
		/* 
			\d+ 			=> Matches one or more digits (0–9).
			\.? 			=> Matches an optional decimal point.
			\d* 			=> Matches zero or more digits after the decimal point, allowing for whole numbers and decimals.
			(?!.*\d) 	=> This is a negative lookahead assertion 
											- ensures no digits appear after the matched number in the string
											- effectively captures that this is the last number in the string.
			*/

		setDisplay(currentNumber);
		setInput(cleanedInput);
	};

	const handleClick = e => {
		handleInput(e.target.textContent);
	};

	return (
		<>
			<button
				onClick={handleClick}
				id="clear"
				className="btn border rounded-0 calc-grid-col-2"
			>
				AC
			</button>
			<button
				onClick={handleClick}
				id="divide"
				className="btn border rounded-0"
			>
				/
			</button>
			<button
				onClick={handleClick}
				id="multiply"
				className="btn border rounded-0"
			>
				x
			</button>
			<button
				onClick={handleClick}
				id="seven"
				className="btn border rounded-0"
			>
				7
			</button>
			<button
				onClick={handleClick}
				id="eight"
				className="btn border rounded-0"
			>
				8
			</button>
			<button
				onClick={handleClick}
				id="nine"
				className="btn border rounded-0"
			>
				9
			</button>
			<button
				onClick={handleClick}
				id="subtract"
				className="btn border rounded-0"
			>
				-
			</button>
			<button
				onClick={handleClick}
				id="four"
				className="btn border rounded-0"
			>
				4
			</button>
			<button
				onClick={handleClick}
				id="five"
				className="btn border rounded-0"
			>
				5
			</button>
			<button
				onClick={handleClick}
				id="six"
				className="btn border rounded-0"
			>
				6
			</button>
			<button
				onClick={handleClick}
				id="add"
				className="btn border rounded-0"
			>
				+
			</button>
			<button
				onClick={handleClick}
				id="one"
				className="btn border rounded-0"
			>
				1
			</button>
			<button
				onClick={handleClick}
				id="two"
				className="btn border rounded-0"
			>
				2
			</button>
			<button
				onClick={handleClick}
				id="three"
				className="btn border rounded-0"
			>
				3
			</button>
			<button
				onClick={handleClick}
				id="equals"
				className="btn border rounded-0 calc-grid-row-2"
			>
				=
			</button>
			<button
				onClick={handleClick}
				id="zero"
				className="btn border rounded-0 calc-grid-col-2"
			>
				0
			</button>
			<button
				onClick={handleClick}
				id="decimal"
				className="btn border rounded-0"
			>
				.
			</button>
		</>
	);
}

// --- Input Cleaning Logic ---
function cleanInput(
	input,
	enteredChar,
	isInputPrevResult,
	setIsInputPrevResult
) {
	const prevChar = input[input.length - 1];
	const isEnteredCharNan = isNaN(enteredChar);
	const isPrevCharNan = isNaN(prevChar);

	// --- If previous input was a result ---
	if (isInputPrevResult) {
		if (enteredChar === "=") return;

		if (enteredChar === ".") {
			setIsInputPrevResult(false);
			return "0.";
		}
		if (isEnteredCharNan) {
			setIsInputPrevResult(false);
			return input + " " + enteredChar;
		}
		// Default: entered character is a number
		setIsInputPrevResult(false);
		return enteredChar;
	}

	// --- Handle decimal entry ---
	if (enteredChar === ".") {
		// Operator and negative
		if (OPERATOR_AND_NEGATIVE_REGEX.test(input)) return input + "0.";
		// Preceding operator
		if (TRAILING_OPERATOR_REGEX.test(input)) return input + " 0.";
		// Prevent double decimal
		if (prevChar === ".") return input;
		// Only allow decimal if not already present in current number
		const match = input.match(/\d+\.?\d*$/);
		const lastNum = match ? match[0] : "";
		if (lastNum.includes(".")) return input;
		return input + ".";
	}

	// --- Handle consecutive operators ---
	if (isEnteredCharNan && isPrevCharNan && prevChar !== ".") {
		// Negative sign after operator
		if (enteredChar === "-") {
			if (prevChar === "-") return; // Reject double minus
			return input + " -";
		}
		// Operator and negative
		if (OPERATOR_AND_NEGATIVE_REGEX.test(input)) {
			return input.replace(OPERATOR_AND_NEGATIVE_REGEX, enteredChar);
		}
		// Replace last operator
		return input.slice(0, -1) + enteredChar;
	}

	// --- Leading zero ---
	if (input === "0") {
		if (isEnteredCharNan) return input + " " + enteredChar;
		return enteredChar;
	}

	// --- Operator entry: always add space before operator for readability ---
	if (isEnteredCharNan) return input + " " + enteredChar;

	// --- Number after operator and negative ---
	if (OPERATOR_AND_NEGATIVE_REGEX.test(input)) return input + enteredChar;

	// --- Number after operator (no negative) ---
	if (isPrevCharNan && prevChar !== ".") return input + " " + enteredChar;

	// --- Default: append ---
	return input + enteredChar;
}

const cleanInputAsync = (
	input,
	enteredChar,
	isInputPrevResult,
	setIsInputPrevResult
) =>
	Promise.resolve(
		cleanInput(input, enteredChar, isInputPrevResult, setIsInputPrevResult)
	);
