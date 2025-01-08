let currentInput = "";
let expression = "";
let hasResult = false;

const screen = document.getElementById("display");

const updateScreen = value => {
    screen.value = value;
};

const add = (a, b) => a + b;
const sub = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => b !== 0 ? a / b : 'Error: Div by 0';

const evaluateExpression = expr => {
    const tokens = expr.split(/([+\-*/()])/).filter(Boolean);
    let outputQueue = [];
    let operatorStack = [];

    const precedence = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2
    };

    const applyOperator = () => {
        const operator = operatorStack.pop();
        const b = parseFloat(outputQueue.pop());
        const a = parseFloat(outputQueue.pop());
        let result = 0;

        if (operator === '+') result = add(a, b);
        else if (operator === '-') result = subtract(a, b);
        else if (operator === '*') result = multiply(a, b);
        else if (operator === '/') result = divide(a, b);

        outputQueue.push(result.toString());
    };

    for (let token of tokens) {
        if (/\d/.test(token)) {
            outputQueue.push(token);
        } else if (token === '(') {
            operatorStack.push(token);
        } else if (token === ')') {
            while (operatorStack.length && operatorStack[operatorStack.length - 1] !== '(') {
                applyOperator();
            }
            operatorStack.pop();
        } else if (precedence[token]) {
            while (operatorStack.length && precedence[token] <= precedence[operatorStack[operatorStack.length - 1]]) {
                applyOperator();
            }
            operatorStack.push(token);
        }
    }

    while (operatorStack.length) {
        applyOperator();
    }

    return outputQueue.pop();
};

const handleDigitClick = value => {
    if (hasResult) {
        expression = value;
        hasResult = false;
    } else {
        expression += value;
    }
    updateScreen(expression);
}

const handleOperatorClick = op => {
    if (hasResult) {
        hasResult = false;
    }
    expression += op;
    updateScreen(expression);
}

const handleDecimalClick = () => {
    const lastNumber = expression.split(/[+\-*/]/).pop();
    if (!lastNumber.includes('.')) {
        expression += '.';
        updateScreen(expression);
    }
};

const handleEqualClick = () => {
    if (expression === '') return;

    const result = evaluateExpression(expression);
    updateScreen(result);
    expression = result.toString();
    hasResult = true;
};

const handleClearClick = () => {
    expression = '';
    updateScreen('');
}

const handleBackspaceClick = () => {
    expression = expression.slice(0, -1);
    updateScreen(expression);
};

const handleKeyPress = e => {
    const key = e.key;
    e.preventDefault();

    if ('0123456789'.includes(key)) {
        handleDigitClick(key);
    } else if ('+-*/'.includes(key)) {
        handleOperatorClick(key);
    } else if (key === 'Enter') {
        handleEqualClick();
    } else if (key === 'Backspace') {
        handleBackspaceClick();
    } else if (key === '.') {
        handleDecimalClick();
    }
}

document.querySelectorAll('.digit').forEach(button => {
    button.addEventListener('click', () => handleDigitClick(button.dataset.value));
});

document.querySelectorAll('.operator').forEach(button => {
    button.addEventListener('click', () => handleOperatorClick(button.dataset.value));
});

document.querySelector('.equal').addEventListener('click', handleEqualClick);
document.querySelector('.clear').addEventListener('click', handleClearClick);
document.querySelector('.backspace').addEventListener('click', handleBackspaceClick);
document.querySelector('.digit[data-value="."]').addEventListener('click', handleDecimalClick);

document.addEventListener('keydown', handleKeyPress);