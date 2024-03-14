
/*

- Should start with a row of buttons on top for the difficulties
- Once a difficulty is selected, a random word is chosen
- The player can input letter
- If the letter is in the word, reveal that letter
- If it isn't, add to the representation of a hangman
- If they lose, show a lose message
- If they win, same thing, say they won
- When the game is over, have a play again message and show the buttons again

- Should have the remaining and used letters visible in a grid
- If the letter has been guessed and is not in the word, grey it out
- If the letter has been guessed and is in the word, color it green, yellow, whatever, make it stand out

- The hangman should have an emoji for his head
- It should react to what happens in the game
- If you guess a correct letter: 👀😄
- If you guess a wrong letter: 😅😱
- If you win: 🥳
- If you lose: 💀
- If the hangman is still alive and the player hasn't made a move for 15 seconds, have him fall asleep or look at them funny: 😴🙄😤



*/

const Difficulties = {
    Easy: 'easy',
    Normal: 'normal',
    Hard: 'hard'
}

const wordBank = JSON.parse(data);
console.log(wordBank);

function chooseWord(difficulty, wordBank) {
    let wordList = wordBank[difficulty];
    let index = Math.floor(Math.random() * wordList.length);
    return wordList[index];
}

chooseWord(Difficulties.Easy, wordBank);

// setTimeout creates a timer object
let timeout = setTimeout(() => {
    console.log('im finally here!')
}, 5000);
clearTimeout(timeout);

const state = {
    target : '',
    guessCount : 0,

    remainingLetters : '', // A list of available letters to guess
    wordBank : [],
    difficulty : 0, // Effects the length of words to guess
    
    
};

// An example of adding a dom node
document.addEventListener("DOMContentLoaded", () => {
    const guessBox = document.querySelector('.guess-box');
    if (guessBox === undefined) { return; }

    // const myWord = "HELLO";
    // myWord.split('').forEach(letter => {
    //     const newDOMNode = document.createElement('div');
    //     newDOMNode.classList.add('letter-box');
    //     newDOMNode.dataset.letter = letter;
    //     guessBox.appendChild(newDOMNode);
    // })


});

//hangman : [], // A representation of the hangman


