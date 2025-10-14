/** @format */

function Buttons({
	input,
	setInput,
	setDisplay,
	isInputPrevResult,
	setIsInputPrevResult,
}) {
	const handleButtonClick = enteredChar => {
		// Move the existing handleInput logic here
		// Replace the useEffect event listener approach
		const processInput = async () => {
			// Your existing input processing logic
			if (enteredChar === "=") {
				// Existing evaluation logic
			}
			// Other button handling logic
			const cleanedInput = await cleanInputAsync(
				input,
				enteredChar,
				isInputPrevResult,
				setIsInputPrevResult
			);

			const currentNumber = cleanedInput.match(/\d+\.?\d*(?!.*\d)/)[0];

			setDisplay(currentNumber);
			setInput(cleanedInput);
		};

		processInput();
	};

	return (
		<>
			<button
				id="clear"
				className="btn border rounded-0 calc-grid-col-2"
				onClick={() => handleButtonClick("AC")}
			>
				AC
			</button>
			<button
				id="divide"
				className="btn border rounded-0"
				onClick={() => handleButtonClick("/")}
			>
				/
			</button>
			{/* Repeat for all other buttons, adding onClick with handleButtonClick */}
		</>
	);
}
