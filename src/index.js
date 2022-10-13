import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';



  function Square(props) {
    return (
      <button className='square' onClick={props.onClick}>
        {props.value} 
      </button>
    );
  }
  
  class Board extends React.Component {
    renderSquare(i) {
        return (
          <Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}  
          />
        );
      }
  
    render() { 
      const row = [[0,1,2],[3,4,5],[6,7,8]] 
      return (
        <div>
        {row.map(
          item => <div className="board-row" key={row.toString()}>
            {item.map(
              (square => this.renderSquare(square))
            )}
          </div>
        )}
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
        }],
        stepNumber: 0,
        xIsNext: true,
      };
    }
  

    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? '💙' : '💛';
      this.setState({
        history: history.concat([{
          squares: squares,
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
      });
    }

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
      console.log('history: ', history)
      const moves = history.map((step, move) => {
        const desc = move ?
        'Перейти до ходу #' + move :
        'До початку гри';
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      });

      let status;
      if (winner) {
        status = 'Виграв ' + winner;
      } else if (this.state.stepNumber === 9) {
        status = 'Нічия 💙💛'
      } else {
        status = 'Наступний хід: ' + (this.state.xIsNext ? '💙' : '💛');
      };
  
      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares = {current.squares}
              onClick = {(i) => this.handleClick(i)}
            />
            <select className='MySelect'>
              <option disabled>за зростанням</option>
              <option>за спаданням</option>
            </select>
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
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
  