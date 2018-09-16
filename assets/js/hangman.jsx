import React from 'react';
import ReactDOM from 'react-dom';

export default function hangman_init(root) {
  ReactDOM.render(<Hangman />, root);
}

class Hangman extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div>
      <p>Hangman loaded.</p>
    </div>;
  }
}

