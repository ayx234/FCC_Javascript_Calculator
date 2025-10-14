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

// Display helper functions

function Buttons({
	input,
	setInput,
	setDisplay,
	isInputPrevResult,
	setIsInputPrevResult,
}) {
	// Add click events to buttons
	// Event handlers
	// process input
	const handleInput = async enteredChar => {
		// Evaluate Input when = is pressed
		if (enteredChar === "=") {
			// passing test related issues
			let stringInput = String(input);
			// const extraLeadingNumbersRegex = /\d+ (:?\d+)/;
			// const extraLeadingNumberMatch = stringInput.match(
			// 	extraLeadingNumbersRegex
			// );
			// stringInput = extraLeadingNumberMatch
			// 	? stringInput.replace(extraLeadingNumbersRegex, "")
			// 	: stringInput;
			// end of test related issues
			// CURRENTLY WORKING ON
			const extraOpRegex = /[+\-x/]$/;
			const extraOpMatch = stringInput.match(extraOpRegex);
			const expressionWithoutExtraOp = extraOpMatch
				? stringInput.slice(0, -2)
				: stringInput;
			// replace x with * for mathjs
			const finalExpression = expressionWithoutExtraOp.includes("x")
				? expressionWithoutExtraOp.replace("x", "*")
				: expressionWithoutExtraOp;

			const evaulatedExpression = await Promise.resolve(
				String(evaluate(finalExpression))
			);

			setIsInputPrevResult(true);
			setInput(evaulatedExpression);
			setDisplay(evaulatedExpression);
			return;
		}

		// Clear claculator when AC is pressed
		if (enteredChar === "AC") {
			setInput("0");
			setDisplay("0");
			setIsInputPrevResult(false);
			return;
		}

		// Process mathmatical expression for other buttons
		// Clean input
		const cleanedInput = await cleanInputAsync(
			input,
			enteredChar,
			isInputPrevResult,
			setIsInputPrevResult
		);

		// Get current number
		const currentNumber = cleanedInput.match(/\d+\.?\d*(?!.*\d)/)[0];
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

function cleanInput(
	input,
	enteredChar,
	isInputPrevResult,
	setIsInputPrevResult
) {
	const prevChar = input[input.length - 1];
	const isEnteredCharNan = isNaN(enteredChar);
	const isPrevCharNan = isNaN(prevChar);

	// hanldle isInputPrevResult === true
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
		// default: entered character is a number
		setIsInputPrevResult(false);
		return enteredChar;
	}

	// Handle entering a decimal
	if (enteredChar === ".") {
		// Case: Operator and negative
		const operaterAndNegativeMatchRegex = /[+x/]\s-$/;
		const operaterAndNegativeMatch = input.match(
			operaterAndNegativeMatchRegex
		);
		if (operaterAndNegativeMatch) return input + "0.";
		// Case: Preceding operator
		const precedingOperatorRegex = /[+\-x/]$/;
		const precedingOperatorMatch = input.match(precedingOperatorRegex);
		if (precedingOperatorMatch) return input + " " + "0.";
		// Only allow a decimal if the last character is a digit
		if (prevChar === ".") return input;
		// Find the current number at the end
		const match = input.match(/\d+\.?\d*$/);
		const lastNum = match[0];
		if (lastNum.includes(".")) return input;
		return input + ".";
	}

	// Handle entering consecutive operators
	if (isEnteredCharNan && isPrevCharNan && prevChar !== ".") {
		// Replace the last operator with the new one
		// Case: negative sign
		if (enteredChar === "-") {
			// Reject second minus
			const isMinusAlreadyEntered = prevChar === "-";
			if (isMinusAlreadyEntered) return;

			// default: add minus after operator
			return input + " " + "-";
		}

		// Other operators
		// Case: operator and negative
		const regex = /[+x/]\s-$/;
		const match = input.match(regex);
		const isOpAndNegative = match ? true : false;

		if (isOpAndNegative) return input.replace(regex, enteredChar);

		// Default
		return input.slice(0, -1) + enteredChar;
	}

	// Handle leading zero scenario
	const isInputZero = input === "0";
	if (isInputZero) {
		// Handle operator entry: always add space before operator for readability
		if (isEnteredCharNan) return input + " " + enteredChar;
		// Handle numbers
		return enteredChar;
	}

	// Handle operator entry: always add space before operator for readability
	if (isEnteredCharNan) return input + " " + enteredChar;

	// New number after operator
	// Number after operator and negative
	const OperatorAndNegativeRegex = /[+x/]\s-$/;
	const operaterAndNegativeMatch = input.match(OperatorAndNegativeRegex);
	if (operaterAndNegativeMatch) return input + enteredChar;
	// Number after operator but no negative afterwards
	if (isPrevCharNan && prevChar !== ".") return input + " " + enteredChar;

	// Normal case: just append
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
