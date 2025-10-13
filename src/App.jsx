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
			cleanedInput = await cleanInput(input, enteredChar);
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

// Buttons helper functions
const cleanInput = (input, enteredChar) =>
	new Promise(resolve => {
		let result;

		const prevInputLastChar = input[input.length - 1];
		const enteredCharIsNan = isNaN(enteredChar);
		const prevInputLastCharIsNan = isNaN(prevInputLastChar);

		// Handle decimals
		if (enteredChar === ".") {
			// Deny entry when last char is not a number
			if (prevInputLastCharIsNan) resolve(input);
			else {
				// Handle dot when last entry is a number
				// extract current number
				const regexLastNumberGroup = /\d+\.?\d*$/;
				/* 
				\d+ => Matches one or more digits.
				\.? => Optional decimal point
				\d* => Zero or more digits
				$   => End of string
				*/
				const lastNumberGroup = input.match(regexLastNumberGroup)[0];
				const hasDot = lastNumberGroup.includes(".");

				// prev logic
				if (hasDot) resolve(input);
				else result = input + enteredChar;
			}
		} else {
			// Handle consecutive operator entry
			if (enteredCharIsNan && prevInputLastCharIsNan) {
				if (input.length === 0) {
					result = input;
				} else {
					result = input.slice(0, -1) + enteredChar;
				}
			} else {
				// Handle leading 0 entries when input is 0
				const isFirstEntry =
					(input.length === 0 || input.length === 1) && input === "0";
				if (isFirstEntry) {
					// Handle adding 0 to 0
					if (isFirstEntry && enteredChar === "0") result = "0";
					// Handle operator on first entry
					else if (enteredCharIsNan)
						result = input + " " + enteredChar;
					// handle non zero number when input is 0
					else {
						// handle entering non zero numbers when input is 0
						result = enteredChar;
					}
				} else {
					// handle non first entries number entry
					// handle operator entries
					if (enteredCharIsNan) result = input + " " + enteredChar;
					else {
						// handle number entries
						// handle previous operand entry
						if (prevInputLastCharIsNan && prevInputLastChar !== ".")
							result = input + " " + enteredChar;
						// handle number entries when prev char is a number
						else result = input + enteredChar;
					}
				}
			}
		}
		resolve(result);
	});
