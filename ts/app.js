"use strict";
let selected = [0, 0, 1];
function prevOption(options) {
    let className = options === 0 ? 'timer'
        : options === 1 ? 'step'
            : options === 2 ? 'difficulty'
                : '';
}
function nextOption(options) {
}
function play() {
    var _a;
    const pie = document.querySelector('.pie');
    pie === null || pie === void 0 ? void 0 : pie.setAttribute('--slice-border', 'var(--slice-border-def)');
    pie === null || pie === void 0 ? void 0 : pie.setAttribute('--score-diameter', 'var(--score-diameter-def)');
    document.getElementsByClassName('content')[0].classList.remove('fade-in');
    document.getElementsByClassName('content')[1].classList.add('fade-in');
    (_a = document.querySelector('.bubbles')) === null || _a === void 0 ? void 0 : _a.setAttribute('--secondary-clr', '#77dd77');
    setTimeout(() => {
        var _a;
        (_a = document.querySelector('.bubbles')) === null || _a === void 0 ? void 0 : _a.setAttribute('--secondary-clr', '#444');
    }, 500);
}
function foo() {
    const pie = document.querySelector('.pie');
    pie === null || pie === void 0 ? void 0 : pie.setAttribute('--slice-border', '.2');
    pie === null || pie === void 0 ? void 0 : pie.setAttribute('--score-diameter', 'calc(var(--diameter) * (1 - var(--slice-border)))');
    document.getElementsByClassName('content')[0].classList.add('fade-in');
    document.getElementsByClassName('content')[1].classList.remove('fade-in');
}
