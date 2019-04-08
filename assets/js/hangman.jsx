import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

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


export default function hangman_init(root, channel) {
    ReactDOM.render(<Hangman channel={channel} />, root);
}

class Hangman extends React.Component {
  constructor(props) {
    super(props);

    this.channel = props.channel;
    this.state = { skel: [], goods: [], bads: [], max: 10, cooldown: 0, players: [] };

    this.channel.join()
        .receive("ok", this.gotView.bind(this))
        .receive("error", resp => { console.log("Unable to join", resp) });

    this.channel.on("update", this.gotView.bind(this))
  }

  gotView(view) {
    console.log("new view", view);
    this.setState(view.game);
  }

  sendGuess(ev) {
    this.channel.push("guess", { letter: ev.key })
        .receive("ok", this.gotView.bind(this));
  }

  render() {
    return <div>
      <div className="row">
        <div className="column">
          <Word skel={this.state.skel} />
        </div>
        <div className="column">
          <p>Lives Left: {this.state.max - this.state.bads.length}</p>
        </div>
      </div>
      <div className="row">
        <div className="column">
          <Guesses bads={this.state.bads} />
        </div>
        <div className="column">
          <InputBox guess={this.sendGuess.bind(this)} />
        </div>
      </div>
    </div>;
  }
}

function Word(props) {
  let text = props.skel.join(" ");
  return <p>{ text }</p>;
}

function Guesses(props) {
  let text = props.bads.join(" ");
  return <p>{ text }</p>;
}

function InputBox(props) {
  return <div>
    <p>Type Your Guesses</p>
    <p><input type="text" onKeyPress={props.guess} /></p>
  </div>;
}
