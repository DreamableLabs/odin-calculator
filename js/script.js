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
        let valueParts = value.toString().split('.');
        const isNegative = valueParts[0].startsWith('-');
        let intPart = isNegative ? valueParts[0].slice(1) : valueParts[0];
        let intDigits = intPart.length;

        if (intDigits > TOTAL_DISPLAY_DIGITS) {
            // need to display in scientific notation
            let powerTen = `e${intDigits-1}`;
            let remainingDisplayDigits = TOTAL_DISPLAY_DIGITS - powerTen.length;
            // subtract 1 from remainingDisplayDigits since the base has 1 digit before the fixed point decimals
            let base = (parseFloat(intPart)/Math.pow(10, intDigits-1)).toFixed(remainingDisplayDigits-1);
            display.innerText = isNegative ? `-${base}${powerTen}` : `${base}${powerTen}`;
        } else {
            if (valueParts.length === 1) {
                // value is an integer
                display.innerText = value;
            } else {
                // need to convert to fixed point
                let fixedPointDecimalDigits = TOTAL_DISPLAY_DIGITS - intDigits;
                display.innerText = parseFloat(value).toFixed(fixedPointDecimalDigits);
            }
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