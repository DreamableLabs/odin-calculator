// global constants and vars
const display = document.querySelector('#display');
const inputs = document.querySelector('#inputs');
const buttons = document.querySelectorAll('button');
const operators = document.querySelectorAll('button.operator');
const TOTAL_DISPLAY_DIGITS = 9;
const DIV_BY_ZERO_MESSAGE = 'LOL';

let firstOperand;
let secondOperand;
let operator;
let displayText;
let waitingForNewOperand;

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
            setDisplayText(input);
            waitingForNewOperand = false;
        } else {
            if (display.innerText.length < TOTAL_DISPLAY_DIGITS) {
                setDisplayText(display.innerHTML + input);
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
    } else if (input === '.') {
        if (waitingForNewOperand) {
            setDisplayText('0.');
            waitingForNewOperand = false;
        } else {
            if (display.innerText.length < TOTAL_DISPLAY_DIGITS && !display.innerText.includes('.')) {
                setDisplayText(getDisplayValue() + input);
            }
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
    setActiveOperator(operator);
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

function setDisplayText(text) {
    display.innerText = text;
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

function setActiveOperator(activeOperator) {
    for (op of operators) {
        if (op.innerText === activeOperator) {
            op.classList.add('active');
        } else {
            op.classList.remove('active');
        }
    }
}

function highlightButton(e) {
    e.target.classList.add('brightened');
}

function resetButtonHighlight(e) {
    e.target.classList.remove('brightened');
}

// main logic

inputs.addEventListener('click', respondToInput);
buttons.forEach(button => {
    button.addEventListener('mousedown', highlightButton);
    button.addEventListener('mouseup', resetButtonHighlight);
    button.addEventListener('mouseleave', resetButtonHighlight);
});
resetCalculator();