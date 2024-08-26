// global constants and vars
let firstOperand;
let secondOperand;
let operator;
let displayText;
let display = document.querySelector('#display');
let inputs = document.querySelector('#inputs');

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
    
    return a/b;
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
    console.log(e.target.innerText);
    const numericalInputs = '0123456789';
    let input = e.target.innerText;
    if (numericalInputs.includes(input)) {
        if (display.innerText === '0') {
            display.innerText = input;
        } else {
            display.innerText += input;
        }
    } 
}

// main logic

inputs.addEventListener('click', respondToInput);