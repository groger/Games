/*** imports ***/
import { useRef, useState } from "react";
import styled from "styled-components";

/*** constants ***/
import {
  boardStatusOptions,
  letterStatus,
  letterStatusBgColors,
  maxGuesses,
  wordToGuessLength,
} from "../constants/wordle";

//we could also have this as a prop
const wordToGuess = "fries";

/* Question 1:
 * Option 1: game state: nbGuess, boardStatus, isGameOver, isWinner, guessWords, wordToGuess
 * boardStatus is not necessary but could be used if we want to show some progress about the board status to the user
 *
 * Option 2: game state: isWinner, guessWords, wordToGuess:
 * nbGuess could be calculated by getting guessWords.length without being stored in the useState
 * boardStatus is not necessary so we could have a game state without it
 */

/**** styled component ****/
const GuessWordRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const LetterWrapper = styled.div`
  padding: 6px;
  background-color: ${({ status }) => letterStatusBgColors[status]};
`;

/**** End styled component ****/

export default function Wordle() {
  const inputRef = useRef(null);
  //it's voluntary that i chose to split state into multiple state variables
  //usually we would split state based on which values tend to change together
  //here isGameOver for example won't necessarely change everytime while guessWord will
  //but option2 could be to have only one big gameState
  const [nbGuess, setNbGuess] = useState(0);
  const [boardStatus, setBoardStatus] = useState(boardStatusOptions[0]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [guessWords, setGuessWords] = useState([]);

  const getLetterStatus = (letter, index) => {
    const wordToGuessArr = wordToGuess.toLowerCase().split("");
    if (wordToGuessArr[index] === letter) {
      return letterStatus[0];
    }
    if (wordToGuessArr.indexOf(letter) >= 0) {
      return letterStatus[1];
    }
    return letterStatus[2];
  };

  //Question 2 : we return the new state adding that new input as a guess
  const getGameState = (input) => {
    if (isGameOver) {
      //the state we return is the same nothing can change because we're game over
      return {
        nbGuess,
        boardStatus,
        isGameOver,
        isWinner,
        guessWords,
        wordToGuess,
      };
    }

    const newGuessWords = [...guessWords, input];
    setGuessWords(newGuessWords);

    const newNbGuess = nbGuess + 1;
    setNbGuess(newNbGuess);

    let isNewGameOver = isGameOver;
    let isNewWinner = input.toLowerCase() === wordToGuess.toLowerCase();
    if (newNbGuess >= maxGuesses || isNewWinner) {
      setIsGameOver(true);
      isNewGameOver = true;
    }
    setIsWinner(isNewWinner);

    let newBoardStatus = boardStatus;
    if (newGuessWords.length === 0) {
      newBoardStatus = boardStatusOptions[0];
    } else if(isNewWinner) {
      newBoardStatus = boardStatusOptions[2];
    } else if (newGuessWords.length < maxGuesses) {
      newBoardStatus = boardStatusOptions[1];
    } else {
      newBoardStatus =  boardStatusOptions[3];
    }
    setBoardStatus(newBoardStatus);

    return {
      nbGuess: newNbGuess,
      boardStatus: newBoardStatus,
      isGameover: isNewGameOver,
      isWinner: isNewWinner,
      guessWords: newGuessWords,
      wordToGuess,
    };
  };

  //Question 3
  const isGameComplete = (gameState) => {
    return gameState.isGameOver;
  };

  const onSubmit = () => {
    const newInput = inputRef.current.value;
    getGameState(newInput);
  };

  return (
    <div>
      <h1>Your Wordle board is : {boardStatus}</h1>
      {guessWords.map((guessWord) => {
        return (
          <GuessWordRow key={guessWord}>
            {guessWord.split("").map((guessLetter, index) => {
              return (
                <LetterWrapper
                  key={`${guessLetter}-${index}`}
                  status={getLetterStatus(guessLetter.toLowerCase(), index)}
                >
                  {guessLetter}
                </LetterWrapper>
              );
            })}
          </GuessWordRow>
        );
      })}
      {!isGameOver ? (
        <div>
          <input
            defaultValue=""
            ref={inputRef}
            type="text"
            maxLength={wordToGuessLength}
            key={`input-${guessWords.length}`}
            data-testid="wordle-input"
          />
          <button onClick={onSubmit}>Enter</button>
        </div>
      ) : null}
    </div>
  );
}
