
/*

- Should start with a row of buttons on top for the difficulties                DONE
- Once a difficulty is selected, a random word is chosen                        DONE     
- The player can input a letter                                                 DONE
- If the letter is in the word, reveal that letter                              DONE
- If it isn't, add to the representation of a hangman                           DONE
- If they lose, show a lose message                                             DONE
- If they win, same thing, say they won                                         DONE
- When the game is over, have a play again message and show the buttons again

- Should have the remaining and used letters visible in a grid                                              DONE
- If the letter has been guessed and is not in the word, grey it out                                        DONE
- If the letter has been guessed and is in the word, color it green, yellow, whatever, make it stand out    DONE

- The hangman should have an emoji for his head
- It should react to what happens in the game
- If you guess a correct letter: 👀😄
- If you guess a wrong letter: 😅😱
- If you win: 🥳
- If you lose: 💀
- If the hangman is still alive and the player hasn't made a move for 15 seconds, have him fall asleep or look at them funny: 😴🙄😤

*/

// I'm currently not using this, I wasn't sure how to have the function chooseDifficulty return
// Difficulties.Easy or Difficulties.Hard (for example).
// I could return it as a string which wouldn't have worked for when I used the return value
// as an argument for chooseWord

const IDLE_HEADS = ['😴', '🙄', '😤'];
const CORRECT_HEADS = ['😄', '👀'];
const WRONG_HEADS = ['😱', '😟']


const Difficulties = {
    Easy: 'easy',
    Normal: 'normal',
    Hard: 'hard'
}

const state = {
    target : '',
    correctGuessCount : 0,
    wrongGuessCount: 0,
    // I don't think I need to use this anymore because I'm just disabling the letter buttons on the DOM to keep track of my remaining letters
    remainingLetters : ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'], // A list of available letters to guess
    difficulty : 0, // Effects the length of words to guess
    idleTimer: '',
};


const wordBank = JSON.parse(data.toLowerCase());

// Takes the difficulty to find the correct sub-bank of words within wordBank
// A random index is calculated and wordList at that index is returned
function chooseWord(difficulty, wordBank) {
    let wordList = wordBank[difficulty];
    let index = Math.floor(Math.random() * wordList.length);
    return wordList[index];
}

// This function is passed an HTML div element that was clicked by the user
// This element stores a difficulty option that is extracted and then returned
function chooseDifficulty(div) {
    let myDifficulty = div.getAttribute('data-dif'); 
    return myDifficulty;  
}

function clearGuessBox(guessBox) {
    // This clears the previous word from the guessBox element, child by child
    while (guessBox.firstChild) {
        guessBox.removeChild(guessBox.firstChild);
    }
}

// This function takes our random word and splits it into individual letters
// Each letter is used as an argument in a function that creates a new div, adds the correct class,
// adds the letter as an attribute to the new div, then appends the div to the DOM
function startHangman(myWord) {
        const guessBox = document.querySelector('.guess-box');
        if (guessBox === undefined) { return; }

        // Clears the previous word
        clearGuessBox(guessBox);

        myWord.split('').forEach(letter => {
            const newDOMNode = document.createElement('div');
            newDOMNode.classList.add('letter-box');
            newDOMNode.dataset.letter = letter;
            guessBox.appendChild(newDOMNode);
        })

}

// This function finds and assigns both letter-selector--row elements to variables
// It then runs clearLetters() on both rows to clear them of their contents
// Then both rows are populated with the contents of state.remainingLetters
// Each new element is assigned to the class "letter" and "hidden"
// The elements need to be loaded in before they can be seen which is why they are given "hidden"
function loadLetters() {
    const letterSelector = document.querySelector('.letter-selector');
    
    clearLetters(letterSelector);
    state.remainingLetters.slice(0, 26).forEach(letter => {
        const newDOMNode = document.createElement('button');
        newDOMNode.classList.add('letter', 'hidden', 'js-target');
        newDOMNode.dataset.value = letter;
        newDOMNode.textContent = letter.toUpperCase();
        letterSelector.appendChild(newDOMNode);
    })

}

// Once the user selects a difficulty, the "hidden" class is removed
// This makes the letters visible
function displayLetters() {
    const letters = document.querySelectorAll('.letter');
    letters.forEach(button => {
        button.classList.remove('hidden');
    })
}

// Used for clearing out guessed letters when restarting or starting hangman
function clearLetters(letterSelector) {
    while(letterSelector.firstChild) {
        letterSelector.removeChild(letterSelector.firstChild);
    }

}

// Called after the user selects a difficulty
function hideDifficulty() {
    const difficultySelector = document.querySelector('.difficulty-selector');
    difficultySelector.classList.add('hidden');
    const difficulties = document.querySelectorAll('.difficulty');
    difficulties.forEach(div => {
        div.classList.add('hidden');
    })
}

// Called after the user selects a difficulty
function gameStartText() {
    const startMessage = document.querySelector('.text-message');
    startMessage.textContent = "Guess the word!";
}

// Called after the user clicks on a letter
// Checks if a guessed letter is contained in state.target
function checkLetter(myLetter) {
    return state.target.includes(myLetter);
}

// Defines indexArr which holds the indexes of all matches between myLetter and state.target
// Loops through state.target, appending all matching indexes to indexArr
// We pop the correct indexes from indexArr, using them as a means of navigating through the children of guessBox
// Each child will have its text content changed to myLetter
function updateGuessBoard(myLetter) {
    let indexArr = [];
    const guessBox = document.querySelector('.guess-box');

    for (i in state.target) {
        if (state.target[i] === myLetter) {
            indexArr.push(i);
        }
    }

    state.correctGuessCount += indexArr.length;

    while (indexArr.length !== 0) {
        guessBox.children[indexArr.pop()].textContent = myLetter.toUpperCase();
    }
}

// If you are out of guesses, then run gameOver
// Else, draw the next part of the hangman
function drawHangman() {
    let hangman = document.querySelectorAll('.hangman__part');
    hangman[state.wrongGuessCount - 1].classList.remove('hidden');
}

// Disable all letter buttons
// Change the top message to "GAME OVER"
// Change the hangman's head to a skull
// run gameOverFillBoard
// calls playAgain
function gameOver() {
    const letterButtons = document.querySelectorAll('.letter');
    letterButtons.forEach(button => {
        button.disabled = true;
    })

    clearTimeout(state.idleTimer);
    setMessage("GAME OVER");
    gameOverFillBoard();
    playAgain();
    setHead("💀");
}

function setMessage(message) {
    const topMessage = document.querySelector('.text-message');
    topMessage.textContent = message;
}

function setHead(newHead) {
    const hangmanHead = document.querySelector('.hangman__head');
    hangmanHead.textContent = newHead;
}

// Fills in all unguessed spaces with the correct letter and highlights them red
function gameOverFillBoard() {
    const guessBox = document.querySelector('.guess-box');

    for (i in state.target) {
        if (state.target[i].toUpperCase() !== guessBox.children[i].textContent) {
            guessBox.children[i].textContent = state.target[i].toUpperCase();
            guessBox.children[i].classList.add('red-background');
        }
    }
}

function winCheck() {
    return (state.target.length === state.correctGuessCount);
}

 // Disables all letter buttons
 // Changes top text to "VICTORY!"
 // Changes hangman head to a party emoji
 // Calls playAgain
function victory() {
    const letterButtons = document.querySelectorAll('.letter');
    letterButtons.forEach(button => {
        button.disabled = true;
    })
    clearTimeout(state.idleTimer);
    setMessage("VICTORY");
    setHead("🥳");
    playAgain()
}

function playAgain() {
    // Have a button here that calls init when pressed.
    const playAgainButton = document.querySelector('.play-again__button');
    playAgainButton.classList.remove('hidden');

        playAgainButton.addEventListener('click', () => {
            playAgainButton.classList.add('hidden');
            gameReset();
            init();
        })


}

function gameReset() {
    showDifficulty();
    const guessBox = document.querySelector('.guess-box');
    clearGuessBox(guessBox);

    state.correctGuessCount = 0;
    state.wrongGuessCount = 0;

    resetHangman();

    setMessage("Choose a difficulty");
}

function showDifficulty() {
    const difficultySelector = document.querySelector('.difficulty-selector');
    difficultySelector.classList.remove('hidden');
    const difficulties = document.querySelectorAll('.difficulty');
    difficulties.forEach(button => {
        button.classList.remove('hidden');
    })
}

function resetHangman () {
    const hangman = document.querySelectorAll('.hangman__part');
    hangman.forEach(part => {
        part.classList.add('hidden');
    })
    setHead("😟");

    
}

function chooseHead(heads) {
    let index = Math.floor(Math.random() * heads.length);
    return heads[index];
}

function resetIdleHeadTimer(clear=true) {

    if (clear) {
        clearTimeout(state.idleTimer);
    }
    state.idleTimer = setTimeout(() => {
        const head = chooseHead(IDLE_HEADS);
        setHead(head);
    }, 15000);
}




// This is my main function it links everything together, so hopefully it doesn't get too large
// Two variables hold two categories of HTML elements "difficulty" and "letter"
// There are two click event listeners
// The first one prepares hangman with the selected difficulty with a random word
// The second one gets the value of a letter button pressed and checks if it is a correct letter
function init() {
    const difficulties = document.querySelectorAll('.difficulty');
    loadLetters();
    const letterButtons = document.querySelectorAll('.letter');
    let activeTimeouts = [];




    difficulties.forEach(div => {
        div.addEventListener('click', () => {         
            state.difficulty = chooseDifficulty(div);
            state.target = chooseWord(state.difficulty, wordBank);
            startHangman(state.target);
            displayLetters();
            hideDifficulty();
            gameStartText();

            resetIdleHeadTimer(false);
        })
    })   

    letterButtons.forEach(button => {
        button.addEventListener('click', () =>{
            button.disabled = true;
            let myLetter = button.getAttribute('data-value');
            if(checkLetter(myLetter)) {
                button.classList.add('letter-box__correct');
                updateGuessBoard(myLetter);
                const head = chooseHead(CORRECT_HEADS);
                setHead(head);
                resetIdleHeadTimer();

            } else {
                state.wrongGuessCount++;
                drawHangman();
                if (state.wrongGuessCount > 5) {
                    gameOver();
                } else {
                    const head = chooseHead(WRONG_HEADS);
                    setHead(head);
                    resetIdleHeadTimer();
                }

            }



            if (winCheck()) {
                victory();
            }
        })
    })
}







//let myWord = chooseWord(myDifficulty, wordBank);

// setTimeout creates a timer object
let timeout = setTimeout(() => {

}, 5000);
clearTimeout(timeout);



// An example of adding a dom node
document.addEventListener("DOMContentLoaded", () => {
    const guessBox = document.querySelector('.guess-box');
    if (guessBox === undefined) { return; }

    //const myWord = "HELLO";
    // myWord.split('').forEach(letter => {
    //     const newDOMNode = document.createElement('div');
    //     newDOMNode.classList.add('letter-box');
    //     newDOMNode.dataset.letter = letter;
    //     guessBox.appendChild(newDOMNode);
    // })


});

//hangman : [], // A representation of the hangman

document.addEventListener("DOMContentLoaded", init);        //Checks if the DOM is fully loaded before executing init