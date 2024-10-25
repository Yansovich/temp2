const inputValue = document.getElementById('inputValue');
const fieldGame = document.getElementById('fieldGame');
const enterBtn = document.getElementById('enterBtn');
const clearBtn = document.getElementById('clearBtn');
const backspaceBtn = document.getElementById('backspaceBtn');
const buttons = document.querySelectorAll('.buttons button[data-value]');
const score = document.querySelector('.score-value')
const wave = document.getElementById('wave');
let drops = [];
let correctAnswers = 0;
let wrongAnswers = 0;
let interval = 4500; // начальное время в миллисекундах
let animationDuration = 50000; // начальная продолжительность анимации в миллисекундах
let currentScore = 0;
let bonusInterval = 4000; // 10 секунд
let bonusProbability = 0.1; // вероятность добавить класс bonus

buttons.forEach(button => {
    button.addEventListener('click', () => {
        inputValue.value += button.dataset.value;
    });
});

function checkResult() {
    const answer = parseInt(inputValue.value);
    inputValue.value = '';

    const dropIndex = drops.findIndex(drop => drop.answer === answer);

    const hasBonusDrop = drops.some(drop => drop.answer === answer && drop.element.classList.contains('bonus'));

    if (hasBonusDrop) {
        correctAnswers = correctAnswers + 1;
        increaseSpeed()
        increaseScore()
        console.log('BONUS!', correctAnswers);

        drops.forEach(drop => {
            drop.element.remove();
        });
        drops = [];
        console.log('Все элементы drop удалены из-за бонуса');
    }

    else if (dropIndex !== -1) {
        drops[dropIndex].element.remove();
        drops.splice(dropIndex, 1);
        correctAnswers = correctAnswers + 1;
        // console.log('Правильный ответ:', answer);
        console.log(correctAnswers);
        increaseSpeed()
        console.log(interval);
        increaseScore()
    } else {
        wrongAnswers = wrongAnswers + 1;
        wave.style.height = `${wave.clientHeight + 20}px`;
        // console.log('Неправильный ответ:', answer);
        console.log("WA", wrongAnswers);
        if (wrongAnswers === 3) {
            alert('game over')
        }
        reduceScore()
    }
}

function clearInputValue() {
    inputValue.value = ''
}

function deleteLastSymbol() {
    inputValue.value = inputValue.value.slice(0, -1);
}

clearBtn.addEventListener('click', clearInputValue)
backspaceBtn.addEventListener('click', deleteLastSymbol)
enterBtn.addEventListener('click', checkResult)

// клавиатура
document.addEventListener('keydown', (event) => {
    if (event.key.length === 1) {
        inputValue.value += event.key
    } else if (event.key === 'Backspace') {
        deleteLastSymbol()
    } else if (event.key === 'Enter') {
        checkResult()
    } else if (event.key === 'Escape') {
        clearInputValue()
    }
});

// счет 
function increaseScore() {

    // let previousScore = 0

    if (correctAnswers === 1) {
        let previousScore = 10;
        score.textContent = previousScore;
    } else {
        currentScore = previousScore + 1 + 10;
    }
    score.textContent = currentScore;
    console.log(currentScore);
}

function reduceScore() {
    if (wrongAnswers > 0) { // Обработка неправильного ответа
        if (wrongAnswers === 1) {
            currentScore = currentScore - 5; // Первое неправильное
        } else {
            currentScore = currentScore - 6; // Последующие
        }
    }
    if (currentScore < 0) {
        currentScore = 0;
    }
    score.textContent = currentScore;
    console.log(currentScore);
}


function createDrop() {
    const drop = document.createElement('div');
    drop.className = 'drop';

    if (Math.random() < bonusProbability) {
        drop.classList.add('bonus');
    }
    setInterval(() => { }, bonusInterval);

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
        duration: animationDuration,
        fill: 'forwards'
    });

    const checkInterval = setInterval(() => {
        if (isDropInWave(drop)) {
            drop.remove();
            correctAnswers++;
            wave.style.height = `${wave.clientHeight + 20}px`;
            clearInterval(checkInterval);
        }
        if (wave.style.height === '650px') {
            alert('game over')
        }
    }, 500)
}

function isDropInWave(drop) {
    const dropRect = drop.getBoundingClientRect();
    const waveRect = wave.getBoundingClientRect();
    return dropRect.bottom >= waveRect.top;
}

// увеличить скорость 
function increaseSpeed() {
    console.log(correctAnswers, 1000000000000);
    const settings = {
        10: { interval: 4000, animationDuration: 45000 },
        20: { interval: 3500, animationDuration: 40000 },
        30: { interval: 3000, animationDuration: 35000 },
        40: { interval: 2500, animationDuration: 30000 },
        50: { interval: 2000, animationDuration: 25000 },
        60: { interval: 1500, animationDuration: 20000 },
        70: { interval: 1000, animationDuration: 15000 },
    };

    if (settings[correctAnswers]) {
        interval = settings[correctAnswers].interval;
        animationDuration = settings[correctAnswers].animationDuration;
    }
}

setInterval(createDrop, interval);