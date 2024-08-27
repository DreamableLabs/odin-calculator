// global constants and vars
let firstOperand;
let secondOperand;
let operator;
let displayText;
let display = document.querySelector('#display');
let inputs = document.querySelector('#inputs');
let waitingForNewOperand;
const TOTAL_DISPLAY_DIGITS = 9;
const DIV_BY_ZERO_MESSAGE = 'LOL';

// functions
function add(a, b) {
    if (!(typeof(a) === 'number') || !(typeof(b) === 'number')) {
        alert('Invalid inputs. Inputs must be numerical.')
        return;
    }
    
    return a+b;
}

function subtract(a, b) {
    if (!(typeof(a) === 'number') || !(typeof(b) === 'number')) {
        alert('Invalid inputs. Inputs must be numerical.')
        return;
    }
    
    return a-b;
}

function multiply(a, b) {
    if (!(typeof(a) === 'number') || !(typeof(b) === 'number')) {
        alert('Invalid inputs. Inputs must be numerical.')
        return;
    }
    
    return a*b;
}

function divide(a, b) {
    if (!(typeof(a) === 'number') || !(typeof(b) === 'number')) {
        alert('Invalid inputs. Inputs must be numerical.')
        return;
    }

    if (b === 0) {
        return DIV_BY_ZERO_MESSAGE;
    }
    
    return parseFloat(a/b);
}

function operate(a, b, operator) {
    const validOperators = '+-x/';

    if (!validOperators.includes(operator)) {
        alert('Invalid operator. Must be +, -, x or /.')
        return;
    }

    switch(operator) {
        case '+':
            return add(a, b);
            break;
        case '-':
            return subtract(a, b);
            break;
        case 'x':
            return multiply(a, b);
            break;
        case '/':
            return divide(a, b);
            break;
    }
}

function respondToInput(e) {
    const numericalInputs = '0123456789';
    const operatorInputs = '+-x/';
    let input = e.target.innerText;
    if (numericalInputs.includes(input)) {
        if (waitingForNewOperand) {
            setDisplayValue(input);
            waitingForNewOperand = false;
        } else {
            if (display.innerText.length < TOTAL_DISPLAY_DIGITS) {
                setDisplayValue(getDisplayValue() + input);
            }
        }
    } else if (input === 'AC') {
        resetCalculator();
    } else if (operatorInputs.includes(input)) {
        if (firstOperand === null) {
            updateCalculatorState(getDisplayValue(), null, input, getDisplayValue())
        } else {
            let result = operate(firstOperand, getDisplayValue(), operator);
            updateCalculatorState(result, null, input, result);
        }
    } else if (input === '=') {
        if (firstOperand != null && operator != null) {
            let result = operate(firstOperand, getDisplayValue(), operator);
            updateCalculatorState(null, null, null, result);
        }
    } else if (input === '+/-') {
        let value = getDisplayValue();
        value *= -1;
        setDisplayValue(value);
    } else if (input === '%') {
        let value = getDisplayValue();
        value /= 100;
        setDisplayValue(value);
    }
}

function resetCalculator() {
    updateCalculatorState(null, null, null, '0');
} 

function updateCalculatorState(op1, op2, operatorValue, displayText) {
    firstOperand = op1;
    secondOperand = op2;
    operator = operatorValue;
    setDisplayValue(displayText);
    waitingForNewOperand = true;
}

function getDisplayValue() {
    let value = parseFloat(display.innerText);
    if (!isNaN(value) && isFinite(value)) {
        return value;
    } else {
        alert('Invalid input. Inputs must be finite integer values.');
        resetCalculator();
        return null;
    }
}

function setDisplayValue(value) {
    if (value === DIV_BY_ZERO_MESSAGE) {
        display.innerText = DIV_BY_ZERO_MESSAGE;
    } else {
        display.innerText = formatDisplayValue(value);
    }
}

function formatDisplayValue(value) {
    value = parseFloat(value);
    const isScientificNotation = value.toString().includes('e');
    const isNegative = value.toString().startsWith('-');
    let base = value.toString().split('e')[0];
    let baseInt = base.split('.')[0];
    let powerTen = isScientificNotation ? 'e' + value.toString().split('e').slice(-1) : '';
    // one display digit needed for negative sign and one needed for ones digit in base
    let fixedPointDecimalDigits = isNegative ? TOTAL_DISPLAY_DIGITS - powerTen.length - 2 : TOTAL_DISPLAY_DIGITS - powerTen.length - 1;
    if (parseFloat(base) === 0) {
        console.log('hell');
    }
    if (isScientificNotation) {
        return parseFloat(base).toFixed(fixedPointDecimalDigits).toString() + powerTen;
    } else {
        let baseIntDigits = isNegative ? baseInt.length - 1 : baseInt.length;
        if (baseIntDigits > TOTAL_DISPLAY_DIGITS) {
            //convert to scientific notation
            powerTen = `e${baseIntDigits-1}`;
            fixedPointDecimalDigits = isNegative ? TOTAL_DISPLAY_DIGITS - powerTen.length - 2 : TOTAL_DISPLAY_DIGITS - powerTen.length - 1;
            base = (parseFloat(base)/Math.pow(10, baseIntDigits-1)).toFixed(fixedPointDecimalDigits);
            return base.toString() + powerTen;
        } else {
            fixedPointDecimalDigits = TOTAL_DISPLAY_DIGITS - baseIntDigits;
            return parseFloat(value.toFixed(fixedPointDecimalDigits));
        }
    }
}

/* pseudocode for handling setDisplayValue

if the value has more than 9 digits, convert to 
scientific notation.

if the value has fewer than 9 digits, calculate
the remaining digits that can be used and allocate 
those to the decimal place digits. 

*/



// main logic

inputs.addEventListener('click', respondToInput);
resetCalculator();

/* pseudocode for calculator logic

There are two states that the calculator switches between:

1. Clear - firstOperand: null, secondOperand: null
2. Active - firstOperand: number, secondOperand: null

If an operator (+, -, *, /, =) button is pressed then this 
what happens in each of the two states:

1. firstOperand set to display text => state 2.
2. secondOperand set to display text, computation performed,
firstOperand and display text set to result of computation
=> state 1.*/