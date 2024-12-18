let selected = [0, 0, 1]
let simonMoves: number[] = [];
let score = 0;
let streak: number[] = [];
let timer: number | undefined = undefined;
let pauseTimer = true;
let timerContent = document.getElementById('timer-content') as HTMLElement;
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

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function updateTimerContent() {
    timer = getTimeToMove();
    if (timer) {
        timerContent.style.opacity = '1';
        timerContent.textContent = `Timer: ${timer}s`;
    } else {
        timerContent.style.opacity = '0';
    }
}

(() => {
    setInterval(() => {
        if (pauseTimer || !timer || timer < 0) {
            return;
        }

        timer -= 1;
        updateTimerContent();

        if (timer === 0) {
            timerContent.style.color = '#fc554d';
            delay(1250).then(() => timerContent.style.color = 'white');
            pauseTimer = true;
            lose().catch(console.error);
        }
    }, 1000);
})();

async function animateBubbleContainer(bubbleContainer: HTMLElement, fail: boolean) {
    let color = fail ? '#ff6961' : '#77dd77';
    for (let i = 0; i < 1; i++) {
        bubbleContainer.style.setProperty('--secondary-clr', color);
        await delay(1250);
        bubbleContainer.style.setProperty('--secondary-clr', '#444');
    }
}

function addRandomMove() {
    simonMoves.push(Math.floor(Math.random() * 4));
}

function addMoves() {
    for (let i = 0; i < getSteps(); i++) {
        addRandomMove();
    }
}

function animateBackground(fail: boolean = false) {
    const bubbleContainers = document.getElementsByClassName('bubbles') as HTMLCollectionOf<HTMLElement>;
    for (const bubbleContainer of bubbleContainers) {
        animateBubbleContainer(bubbleContainer, fail).catch(console.error);
    }
}

async function simonSays() {
    let scoreContent = document.getElementById('score-content') as HTMLElement;
    let slices = document.getElementsByClassName('fill') as HTMLCollectionOf<HTMLElement>;
    let pie = document.querySelector('.pie') as HTMLElement;

    scoreContent.textContent = 'Wait...';
    pie.classList.add('disabled');
    updateTimerContent();
    pauseTimer = true;
    await delay(500);

    for (let move of simonMoves) {
        slices[move].classList.add('hover');
        await delay(getTimeBetweenMoves());
        slices[move].classList.remove('hover');
        await delay(250);
    }

    pauseTimer = false;
    pie.classList.remove('disabled');
    scoreContent.textContent = score.toString();
}

function nextOption(options: number) {
    const menu = document.getElementsByClassName('options')[options] as HTMLElement;
    if (selected[options] + 1 === menu.childElementCount)
        return;

    if (selected[options] + 2 === menu.childElementCount) {
        document.getElementsByClassName('next-button')[options].classList.add('disabled');
    }
    document.getElementsByClassName('prev-button')[options].classList.remove('disabled');


    const currentElement = menu.children[selected[options]] as HTMLElement;
    selected[options] += 1;
    const nextElement = menu.children[selected[options]] as HTMLElement;

    updateTimerContent();

    currentElement.classList.add('left');
    nextElement.classList.add('shown');
}

function prevOption(options: number) {
    const menu = document.getElementsByClassName('options')[options] as HTMLElement;
    if (selected[options] === 0)
        return;

    if (selected[options] === 1) {
        document.getElementsByClassName('prev-button')[options].classList.add('disabled');
    }
    document.getElementsByClassName('next-button')[options].classList.remove('disabled');

    const currentElement = menu.children[selected[options]] as HTMLElement;
    selected[options] -= 1;
    const nextElement = menu.children[selected[options]] as HTMLElement;

    updateTimerContent();

    currentElement.classList.remove('shown');
    nextElement.classList.remove('left');
}

async function play() {
    const pie = document.querySelector('.pie') as HTMLElement;
    pie.style.setProperty('--slice-border', 'var(--slice-border-def)');
    // ('--slice-border', 'var(--slice-border-def)')
    pie.style.setProperty('--score-diameter', 'var(--score-diameter-def)');

    document.getElementsByClassName('content')[0].classList.remove('fade-in');
    document.getElementsByClassName('content')[1].classList.add('fade-in');

    await delay(500);
    simonMoves = [];
    addMoves();
    streak = JSON.parse(JSON.stringify(simonMoves));
    simonSays().catch(console.error);
}

async function returnToMenu() {
    const pie = document.querySelector('.pie') as HTMLElement;
    pie.style.setProperty('--slice-border', '.2')
    pie.style.setProperty('--score-diameter', 'calc(var(--diameter) * (1 - var(--slice-border)))')

    document.getElementsByClassName('content')[0].classList.add('fade-in');
    document.getElementsByClassName('content')[1].classList.remove('fade-in');
    delay(500).then(() => document.querySelector('.pie')?.classList.remove('disabled'));
}

async function lose() {
    pauseTimer = true;
    updateTimerContent();
    let scoreContent = document.getElementById('score-content') as HTMLElement;
    // let scoreElement = document.querySelector('.score') as HTMLElement;
    scoreContent.style.color = '#ff6961';
    scoreContent.innerHTML = `You lost! <br>Score: ${score}`;
    score = 0;
    animateBackground(true)
    // scoreElement.style.backgroundColor = '#fec2bf';
    // scoreElement.style.opacity = '.85';
    // delay(500).then(() => {
    //   scoreElement.style.opacity = '1';
    //   scoreElement.style.backgroundColor = 'var(--background-color)';
    // });
    await delay(3000);
    await returnToMenu();
    scoreContent.innerHTML = 'Wait...';
    scoreContent.style.color = 'white';
}

function checkMove(move: number) {
    updateTimerContent();

    if (move !== streak[0]) {
        document.querySelector('.pie')?.classList.add('disabled');
        if (score > bestScore) {
            bestScore = score;
            let bestScoreContent = document.getElementById('best-score-content') as HTMLElement;
            delay(1250).then(() => {
                bestScoreContent.textContent = `Best Score: ${bestScore}`;
                bestScoreContent.style.color = '#77dd77';
                delay(1250).then(() => bestScoreContent.style.color = 'white');
            })
        }
        lose().catch(console.error);
        return;
    }

    streak.shift();
    if (streak.length === 0) {
        score += getSteps();
        addMoves();
        animateBackground()
        streak = JSON.parse(JSON.stringify(simonMoves));
        simonSays().catch(console.error);
    } else {
        document.getElementsByClassName('fill')[move].classList.add('hover');
        delay(250).then(() => document.getElementsByClassName('fill')[move].classList.remove('hover'));
    }
}

(window as any).addMoves = addMoves;
(window as any).addRandomMove = addRandomMove;
(window as any).animateBackground = animateBackground;
(window as any).animateBubbleContainer = animateBubbleContainer;
(window as any).bestScore = bestScore;
(window as any).checkMove = checkMove;
(window as any).delay = delay;
(window as any).getSteps = getSteps;
(window as any).getTimeBetweenMoves = getTimeBetweenMoves;
(window as any).getTimeToMove = getTimeToMove;
(window as any).lose = lose;
(window as any).nextOption = nextOption;
(window as any).pauseTimer = pauseTimer;
(window as any).play = play;
(window as any).prevOption = prevOption;
(window as any).returnToMenu = returnToMenu;
(window as any).score = score;
(window as any).selected = selected;
(window as any).simonMoves = simonMoves;
(window as any).simonSays = simonSays;
(window as any).streak = streak;
(window as any).timer = timer;
(window as any).timerContent = timerContent;
(window as any).updateTimerContent = updateTimerContent;