import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import randomWords from 'random-words';

/*
   * There is a secret word.
   * The player(s) guess the letters in the word.
   * The letters in the word are shown, initially
     as blanks, then as letters when guessed.
   * You get L lives, bad guesses lose lives,
     no lives you lose.

Hangman App State:

Core app logic state:

   - Secret word (a string)
   - Guesses (array of letters)
   - Max # of lives

Incidental state:

   - text box to input a guess

 */


export default function hangman_init(root) {
    ReactDOM.render(<Hangman />, root);
}

class Hangman extends React.Component {
  constructor(params) {
    super(params);

    this.state = {
      word: randomWords(),
      guesses: ["a", "z"],
      max_lives: 10,
    };
  }

  livesLeft() {
    let good_letters = this.state.word.split("");
    let bad_guesses = _.filter(
      this.state.guesses,
      (guess) => {
        return !_.includes(good_letters, guess);
      }
    ).length;

    return this.state.max_lives - bad_guesses;
  }

  gameIsOver() {
    return !(this.livesLeft() > 0);
  }

  winnerIsYou() {
    let word_letters = this.state.word.split("");
    let missing = _.difference(
      word_letters, this.state.guesses);
    return missing.length == 0;
  }

  setGuesses(guesses) {
    this.setState(_.assign(
      {},
      this.state,
      { guesses: guesses }
    ));
  }

  guessesText() {
    this.state.guesses.join("");
  }

  render() {
    if (this.gameIsOver()) {
      return <p>You lose.</p>;
    }

    if (this.winnerIsYou()) {
      return <p>You win.</p>;
    }

    return <div>
      <div className="row">
        <div className="column">
          <Word word={this.state.word}
                guesses={this.state.guesses} />
        </div>
        <div className="column">
          <p>Lives Left:
            {this.livesLeft()}
          </p>
        </div>
      </div>
      <div className="row">
        <div className="column">
          <Guesses guesses={this.state.guesses} />
        </div>
        <div className="column">
          <InputBox root={this} />
        </div>
      </div>
    </div>;
  }
}

function Word(params) {
  let { word, guesses } = params;
  let letters = _.map(word.split(""), (letter) => {
    if (_.includes(guesses, letter)) {
      return letter;
    }
    else {
      return "_";
    }
  });

  let text = letters.join(" ");
  return <p>{ text }</p>;
}

function Guesses(params) {
  let text = params.guesses.join(" ");
  return <p>{ text }</p>;
}

function InputBox(params) {
  let { root } = params;

  function set_guesses(ev) {
    let guesses = ev.target.value.split("");
    root.setGuesses(guesses);
  }

  return <input type="text"
                value={root.guessesText()}
                onChange={set_guesses}
  />;
}
