/** @format */

import { useState, useEffect } from "react";

export default function App() {
	const [input, setInput] = useState("0");
	const [display, setDisplay] = useState(0);

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

function Buttons({ input, setInput, setDisplay }) {
	// Add click events to buttons
	useEffect(() => {
		// Event handlers
		const handleInput = async enteredChar => {
			let cleanedInput;

			if (enteredChar === "AC") {
				setInput("0");
				setDisplay("0");
				return;
			}

			// clean input
			cleanedInput = await cleanInputAsync(input, enteredChar);
			// setInput(prev => prev + " " + enteredChar);
			setInput(cleanedInput);
		};

		const buttons = document.querySelectorAll("button");

		const handleClick = e => {
			handleInput(e.target.textContent);
		};

		// Add event listeners
		buttons.forEach(b => b.addEventListener("click", handleClick));

		// Cleanup event listeners on App unmount
		return () =>
			buttons.forEach(b => b.removeEventListener("click", handleClick));
	}, [input, setInput, setDisplay]);

	return (
		<>
			<button id="clear" className="btn border rounded-0 calc-grid-col-2">
				AC
			</button>
			<button id="divide" className="btn border rounded-0">
				/
			</button>
			<button id="multiply" className="btn border rounded-0">
				x
			</button>
			<button id="seven" className="btn border rounded-0">
				7
			</button>
			<button id="eight" className="btn border rounded-0">
				8
			</button>
			<button id="nine" className="btn border rounded-0">
				9
			</button>
			<button id="subtract" className="btn border rounded-0">
				-
			</button>
			<button id="four" className="btn border rounded-0">
				4
			</button>
			<button id="five" className="btn border rounded-0">
				5
			</button>
			<button id="six" className="btn border rounded-0">
				6
			</button>
			<button id="add" className="btn border rounded-0">
				+
			</button>
			<button id="one" className="btn border rounded-0">
				1
			</button>
			<button id="two" className="btn border rounded-0">
				2
			</button>
			<button id="three" className="btn border rounded-0">
				3
			</button>
			<button
				id="equals"
				className="btn border rounded-0 calc-grid-row-2"
			>
				=
			</button>
			<button id="zero" className="btn border rounded-0 calc-grid-col-2">
				0
			</button>
			<button id="decimal" className="btn border rounded-0">
				.
			</button>
		</>
	);
}

function cleanInput(input, enteredChar) {
	const prevChar = input[input.length - 1];
	const isEnteredCharNan = isNaN(enteredChar);
	const isPrevCharNan = isNaN(prevChar);

	// Handle entering a decimal
	if (enteredChar === ".") {
		// Only allow a decimal if the last character is a digit
		if (isPrevCharNan) return input;
		// Find the current number at the end
		const match = input.match(/\d+\.?\d*$/);
		const lastNum = match[0];
		if (lastNum.includes(".")) return input;
		return input + ".";
	}

	// Handle entering consecutive operators
	if (isEnteredCharNan && isPrevCharNan) {
		// Replace the last operator with the new one
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
	if (isPrevCharNan && prevChar !== ".") return input + " " + enteredChar;

	// Normal case: just append
	return input + enteredChar;
}

const cleanInputAsync = (input, enteredChar) =>
	Promise.resolve(cleanInput(input, enteredChar));
