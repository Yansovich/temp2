const inputValue = document.getElementById('inputValue');
const fieldGame = document.getElementById('fieldGame');
const enterBtn = document.getElementById('enterBtn');
const clearBtn = document.getElementById('clearBtn');
const backspaceBtn = document.getElementById('backspaceBtn');
const wave = document.getElementById('wave');
let drops = [];
let correctAnswers = 0;
let wrongAnswers = 0;

document.querySelectorAll('.buttons button[data-value]').forEach(button => {
    button.addEventListener('click', () => {
        inputValue.value += button.dataset.value;
    });
});

enterBtn.addEventListener('click', () => {
    const answer = parseInt(inputValue.value);
    inputValue.value = '';

    const dropIndex = drops.findIndex(drop => drop.answer === answer);
    if (dropIndex !== -1) {
        drops[dropIndex].element.remove();
        drops.splice(dropIndex, 1);
        correctAnswers++;
        console.log('Правильный ответ:', answer);
    } else {
        wrongAnswers++;
        console.log('Неправильный ответ:', answer);
    }
});

clearBtn.addEventListener('click', () => {
    inputValue.value = '';
});

backspaceBtn.addEventListener('click', () => {
    inputValue.value = inputValue.value.slice(0, -1);
});

function createDrop() {
    const drop = document.createElement('div');
    drop.className = 'drop';
    const firstNumber = Math.floor(Math.random() * 10) + 1;
    let secondNumber;
    
    do {
        secondNumber = Math.floor(Math.random() * firstNumber) + 1;
    } while (firstNumber % secondNumber !== 0);

    const operator = ['+', '-', '*', '/'][Math.floor(Math.random() * 4)];
    drop.innerHTML = `${firstNumber} ${operator} ${secondNumber}`;
    
    drop.answer = eval(`${firstNumber} ${operator} ${secondNumber}`);
    drop.style.left = `${Math.floor(Math.random() * (fieldGame.clientWidth - 55)) + 5}px`;
    drop.style.top = '0px';

    drops.push({ element: drop, answer: drop.answer });
    fieldGame.appendChild(drop);
    
    animateDrop(drop);
}

function animateDrop(drop) {
    drop.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(calc(100vh - 150px))' }], {
        duration: 50000,
        fill: 'forwards'
    });

    const checkInterval = setInterval(() => {
        if (isDropInWave(drop)) {
            drop.remove();
            correctAnswers++;
            wave.style.height = `${wave.clientHeight + 20}px`;
            clearInterval(checkInterval);
        }
    }, 500);
}

function isDropInWave(drop) {
    const dropRect = drop.getBoundingClientRect();
    const waveRect = wave.getBoundingClientRect();
    return dropRect.bottom >= waveRect.top;
}

setInterval(createDrop, 5000);
