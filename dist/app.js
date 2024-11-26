"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let selected = [0, 0, 1];
let simonMoves = [];
let score = 0;
let streak = [];
let timer = undefined;
let pauseTimer = true;
let timerContent = document.getElementById('timer-content');
let bestScore = 0;
function getTimeToMove() {
    return selected[0] == 0 ? undefined :
        selected[0] == 1 ? 40 :
            selected[0] == 2 ? 20 :
                selected[0] == 3 ? 10 : 5;
}
function getTimeBetweenMoves() {
    return selected[2] == 0 ? 2000 :
        selected[2] == 1 ? 1250 :
            selected[2] == 2 ? 750 :
                selected[2] == 3 ? 500 : 250;
}
function getSteps() {
    return selected[1] + 1;
}
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
(() => {
    let timerId = setInterval(() => {
        if (pauseTimer || !timer || timer < 0) {
            return;
        }
        timer -= 1;
        timerContent.textContent = `Timer: ${timer}s`;
        if (timer === 0) {
            timerContent.style.color = '#fc554d';
            delay(1250).then(() => timerContent.style.color = 'white');
            pauseTimer = true;
            lose().catch(console.error);
        }
    }, 1000);
})();
function animateBubbleContainer(bubbleContainer, fail) {
    return __awaiter(this, void 0, void 0, function* () {
        let color = fail ? '#ff6961' : '#77dd77';
        for (let i = 0; i < 1; i++) {
            bubbleContainer.style.setProperty('--secondary-clr', color);
            yield delay(1250);
            bubbleContainer.style.setProperty('--secondary-clr', '#444');
        }
    });
}
function addRandomMove() {
    simonMoves.push(Math.floor(Math.random() * 4));
}
function addMoves() {
    for (let i = 0; i < getSteps(); i++) {
        addRandomMove();
    }
}
function animateBackground(fail = false) {
    const bubbleContainers = document.getElementsByClassName('bubbles');
    for (const bubbleContainer of bubbleContainers) {
        animateBubbleContainer(bubbleContainer, fail).catch(console.error);
    }
}
function simonSays() {
    return __awaiter(this, void 0, void 0, function* () {
        let scoreContent = document.getElementById('score-content');
        let slices = document.getElementsByClassName('fill');
        let pie = document.querySelector('.pie');
        scoreContent.textContent = 'Wait...';
        pie.classList.add('disabled');
        timer = getTimeToMove();
        timerContent.textContent = `Timer: ${timer}s`;
        pauseTimer = true;
        yield delay(500);
        for (let move of simonMoves) {
            slices[move].classList.add('hover');
            yield delay(getTimeBetweenMoves());
            slices[move].classList.remove('hover');
            yield delay(250);
        }
        pauseTimer = false;
        pie.classList.remove('disabled');
        scoreContent.textContent = score.toString();
    });
}
function nextOption(options) {
    const menu = document.getElementsByClassName('options')[options];
    if (selected[options] + 1 === menu.childElementCount)
        return;
    if (selected[options] + 2 === menu.childElementCount) {
        document.getElementsByClassName('next-button')[options].classList.add('disabled');
    }
    document.getElementsByClassName('prev-button')[options].classList.remove('disabled');
    const currentElement = menu.children[selected[options]];
    selected[options] += 1;
    const nextElement = menu.children[selected[options]];
    timerContent.style.opacity = '1';
    timer = getTimeToMove();
    if (timer) {
        timerContent.textContent = `Timer: ${timer}s`;
    }
    currentElement.classList.add('left');
    nextElement.classList.add('shown');
}
function prevOption(options) {
    const menu = document.getElementsByClassName('options')[options];
    if (selected[options] === 0)
        return;
    if (selected[options] === 1) {
        if (options === 0) {
            timerContent.style.opacity = '0';
        }
        document.getElementsByClassName('prev-button')[options].classList.add('disabled');
    }
    document.getElementsByClassName('next-button')[options].classList.remove('disabled');
    const currentElement = menu.children[selected[options]];
    selected[options] -= 1;
    const nextElement = menu.children[selected[options]];
    timer = getTimeToMove();
    timerContent.textContent = `Timer: ${getTimeToMove()}s`;
    currentElement.classList.remove('shown');
    nextElement.classList.remove('left');
}
function play() {
    return __awaiter(this, void 0, void 0, function* () {
        const pie = document.querySelector('.pie');
        pie.style.setProperty('--slice-border', 'var(--slice-border-def)');
        // ('--slice-border', 'var(--slice-border-def)')
        pie.style.setProperty('--score-diameter', 'var(--score-diameter-def)');
        document.getElementsByClassName('content')[0].classList.remove('fade-in');
        document.getElementsByClassName('content')[1].classList.add('fade-in');
        yield delay(500);
        simonMoves = [];
        addMoves();
        streak = JSON.parse(JSON.stringify(simonMoves));
        simonSays().catch(console.error);
    });
}
function returnToMenu() {
    return __awaiter(this, void 0, void 0, function* () {
        const pie = document.querySelector('.pie');
        pie.style.setProperty('--slice-border', '.2');
        pie.style.setProperty('--score-diameter', 'calc(var(--diameter) * (1 - var(--slice-border)))');
        document.getElementsByClassName('content')[0].classList.add('fade-in');
        document.getElementsByClassName('content')[1].classList.remove('fade-in');
        yield delay(500);
    });
}
function lose() {
    return __awaiter(this, void 0, void 0, function* () {
        pauseTimer = true;
        timer = getTimeToMove();
        if (timer) {
            timerContent.textContent = `Timer: ${timer}s`;
        }
        let scoreContent = document.getElementById('score-content');
        let scoreElement = document.querySelector('.score');
        scoreContent.style.color = '#ff6961';
        scoreContent.innerHTML = `You lost! <br>Score: ${score}`;
        animateBackground(true);
        // scoreElement.style.backgroundColor = '#fec2bf';
        // scoreElement.style.opacity = '.85';
        // delay(500).then(() => {
        //   scoreElement.style.opacity = '1';
        //   scoreElement.style.backgroundColor = 'var(--background-color)';
        // });
        yield delay(3000);
        yield returnToMenu();
        scoreContent.innerHTML = 'Wait...';
        scoreContent.style.color = 'white';
    });
}
function checkMove(move) {
    if (timer) {
        timer++;
        timerContent.textContent = `Timer: ${timer}s`;
    }
    if (move !== streak[0]) {
        if (score > bestScore) {
            bestScore = score;
            let bestScoreContent = document.getElementById('best-score-content');
            delay(1250).then(() => {
                bestScoreContent.textContent = `Best Score: ${bestScore}`;
                bestScoreContent.style.color = '#77dd77';
                delay(1250).then(() => bestScoreContent.style.color = 'white');
            });
        }
        score = 0;
        lose().catch(console.error);
        return;
    }
    streak.shift();
    if (streak.length === 0) {
        score += getSteps();
        addMoves();
        animateBackground();
        streak = JSON.parse(JSON.stringify(simonMoves));
        simonSays().catch(console.error);
    }
    else {
        document.getElementsByClassName('fill')[move].classList.add('hover');
        delay(250).then(() => document.getElementsByClassName('fill')[move].classList.remove('hover'));
    }
}
