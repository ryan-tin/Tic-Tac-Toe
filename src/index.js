import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Square is a functional component
function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
  renderSquare(i) {
    return (<Square 
                value={this.props.squares[i]} 
                onClick={() => this.props.onClick(i)}
            />);
  }

  render() {
      let boardSquares = [];
      for (let row = 0; row < 3; row++) {
          let boardRow = [];
          for (let col = 0; col < 3; col++) {
              boardRow.push(<span key={(row*3)+col}>{this.renderSquare((row * 3) + col)}</span>);
          }
          boardSquares.push(<div className="board-row" key={row}> { boardRow } </div>)
      }
    return (
       <div>
        {boardSquares}
       </div>
    );
  }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                moveCol: null,
                moveRow: null,
            }],
            xIsNext: true,
            stepNumber: 0,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        // return early if there is a winner
        // or a square has already been filled
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        let moveCoordinate = moveCoord(i);
        let moveRow = "" + moveCoordinate[0];
        let moveCol = "" + moveCoordinate[1];
        this.setState({
            history: history.concat([{
                squares: squares,
                moveRow: moveRow,
                moveCol: moveCol,
                turn: squares[i],
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2 === 0),
        });
    }

  render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      const moves = history.map((step, move) => {
          const desc = move ?
              'Go to move #' + move + ", " + history[move]["turn"] + " @ (" + history[move]['moveRow'] + ", " + history[move]['moveCol'] + ")":
              'Go to game start';
          return (
              <li key={move}>
              <button onClick={() => this.jumpTo(move)}>
                {desc}
              </button>
              </li>
          );
      });

      let status;
      if (winner) {
          status = 'Winner: ' + winner;
      } else if ( calculateDraw(current.squares) ) {
          status = 'Draw'
      } else {
          status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
    const lines = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

/*
 * if all cells are full and there is no winner, then its a draw
 */
function calculateDraw(squares) {
    for (let i = 0; i < squares.length; i++) {
        if (squares[i] === null) {
            return null
        };
    }
    return true;
}

function moveCoord(square) {
    let coordinates = [[1,1], [1,2], [1,3], [2,1], [2,2], [2,3], [3,1], [3,2], [3,3]];
    return coordinates[square];
}
