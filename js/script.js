// global constants and vars
let firstOperand;
let secondOperand;
let operator;
let displayText;
let display = document.querySelector('#display');
let inputs = document.querySelector('#inputs');
let waitingForNewOperand;
const NUM_DECIMAL_PLACES = 5;
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
    
    let result = a/b;
    return parseFloat(result.toFixed(NUM_DECIMAL_PLACES));
}

function operate(a, b, operator) {
    const validOperators = '+-*/';

    if (!validOperators.includes(operator)) {
        alert('Invalid operator. Must be +, -, * or /.')
        return;
    }

    switch(operator) {
        case '+':
            return add(a, b);
            break;
        case '-':
            return subtract(a, b);
            break;
        case '*':
            return multiply(a, b);
            break;
        case '/':
            return divide(a, b);
            break;
    }
}

function respondToInput(e) {
    const numericalInputs = '0123456789';
    const operatorInputs = '+-*/';
    let input = e.target.innerText;
    if (numericalInputs.includes(input)) {
        if (waitingForNewOperand) {
            display.innerText = input;
            waitingForNewOperand = false;
        } else {
            display.innerText += input;
        }
    } else if (input === 'AC') {
        resetCalculator();
    } else if (operatorInputs.includes(input)) {
        operator = input;
        if (firstOperand === null) {
            updateCalculatorState(getDisplayValue(), null, operator, getDisplayValue())
        } else {
            let result = operate(firstOperand, getDisplayValue(), operator);
            updateCalculatorState(result, null, operator, result);
        }
    } else if (input === '=') {
        if (firstOperand != null && operator != null) {
            let result = operate(firstOperand, getDisplayValue(), operator);
            updateCalculatorState(null, null, null, result);
        }
    }
}

function resetCalculator() {
    updateCalculatorState(null, null, null, '0');
} 

function updateCalculatorState(op1, op2, operatorValue, displayText) {
    firstOperand = op1;
    secondOperand = op2;
    operator = operatorValue;
    display.innerText = displayText;
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