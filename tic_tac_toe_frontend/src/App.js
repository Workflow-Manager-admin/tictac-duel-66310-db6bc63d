import React, { useState, useEffect } from 'react';
import './App.css';

/*
  Colors used:
  --primary:   #1976d2
  --secondary: #424242
  --accent:    #fbc02d
*/

// Utility for AI: Random empty square move
const getRandomAIMove = (board) => {
  const empty = [];
  board.forEach((cell, i) => {
    if (cell === null) empty.push(i);
  });
  if (empty.length === 0) return null;
  return empty[Math.floor(Math.random() * empty.length)];
};

// Checks win condition: returns 'X', 'O' or null. If draw, returns 'draw'.
const calculateWinner = (squares) => {
  const lines = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // cols
    [0,4,8], [2,4,6]           // diags
  ];
  for (let [a,b,c] of lines) {
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  if (squares.every(cell => cell)) return 'draw';
  return null;
};

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [gameMode, setGameMode] = useState('human'); // 'human' or 'ai'
  const [winner, setWinner] = useState(null);
  const [aiTurn, setAiTurn] = useState(false);

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Detect win/loss/draw after every move
  useEffect(() => {
    const result = calculateWinner(board);
    if (result) {
      setWinner(result);
    } else {
      setWinner(null);
    }
  }, [board]);

  // AI move effect (O is AI, X is always player 1)
  useEffect(() => {
    if (
      gameMode === 'ai' &&
      !winner &&
      !xIsNext // it's 'O' turn (AI)
    ) {
      setAiTurn(true);
      // AI "thinking" timeout for realism
      const id = setTimeout(() => {
        const move = getRandomAIMove(board);
        if (move !== null && !winner) {
          const newBoard = board.slice();
          newBoard[move] = 'O';
          setBoard(newBoard);
          setXIsNext(true);
        }
        setAiTurn(false);
      }, 400);
      return () => clearTimeout(id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xIsNext, gameMode, board, winner]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // PUBLIC_INTERFACE
  const handleModeChange = (mode) => {
    setGameMode(mode);
    handleRestart();
  };

  // PUBLIC_INTERFACE
  const handleRestart = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
    setAiTurn(false);
  };

  // PUBLIC_INTERFACE
  const handleClick = (i) => {
    if (board[i] || winner || (gameMode === 'ai' && !xIsNext)) return;
    const newBoard = board.slice();
    newBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  // --- Rendering components ---
  const renderSquare = (i) => (
    <button
      className="ttt-square"
      aria-label={`Cell ${i+1}`}
      key={i}
      style={{
        borderColor: 'var(--border-color)',
        color:
          board[i]==='X'
            ? 'var(--primary)'
            : board[i]==='O'
            ? 'var(--secondary)'
            : 'inherit',
        background:
          board[i]
            ? board[i]==='X'
              ? 'rgba(25, 118, 210, 0.06)'
              : 'rgba(66, 66, 66, 0.07)'
            : 'transparent',
        transition: 'background 0.18s, color 0.22s'
      }}
      onClick={() => handleClick(i)}
      disabled={!!board[i] || !!winner || (gameMode==='ai' && !xIsNext)}
    >
      {board[i]}
    </button>
  );

  const getStatusText = () => {
    if (winner) {
      if (winner === 'draw') return (
        <span style={{ color: 'var(--secondary)' }}>
          Draw! Nobody wins.
        </span>
      );
      return (
        <span style={{
          color: winner==='X' ? 'var(--primary)' : 'var(--secondary)'
        }}>
          {winner} wins!
        </span>
      );
    }
    if (gameMode === 'ai' && aiTurn) return (
      <span style={{ color: 'var(--secondary)' }}>AI is thinking...</span>
    );
    return (
      <span>
        {xIsNext ? "X" : "O"}'s turn
        <span style={{ marginLeft: 8, color: xIsNext ? 'var(--primary)' : 'var(--secondary)', fontWeight: 500 }}>
          ({xIsNext ? (gameMode === 'ai' ? 'You' : 'Player 1') : (gameMode === 'ai' ? 'AI' : 'Player 2')})
        </span>
      </span>
    );
  };

  return (
    <div className="App">
      <header className="App-header" style={{ background: "var(--bg-secondary)" }}>
        {/* Theme toggle */}
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <div style={{ maxWidth: 400, width: '100%', margin: '0 auto', marginTop: 32 }}>
          <h1 style={{
            margin: 0,
            color: 'var(--primary)',
            fontWeight: 800,
            letterSpacing: '1px',
            fontSize: '2.1rem',
            textAlign: 'center'
          }}>
            Tic Tac Toe
          </h1>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '22px 0 10px 0',
            gap: 10
          }}>
            <button
              className={`ttt-mode-btn${gameMode==='human'?' active':''}`}
              style={{
                background: gameMode==='human' ? 'var(--accent)' : 'var(--button-bg)',
                color: gameMode==='human' ? 'var(--text-primary)' : 'var(--button-text)'
              }}
              onClick={() => handleModeChange('human')}
            >
              2 Players
            </button>
            <button
              className={`ttt-mode-btn${gameMode==='ai'?' active':''}`}
              style={{
                background: gameMode==='ai' ? 'var(--accent)' : 'var(--button-bg)',
                color: gameMode==='ai' ? 'var(--text-primary)' : 'var(--button-text)'
              }}
              onClick={() => handleModeChange('ai')}
            >
              vs AI
            </button>
          </div>
          <div style={{
            margin: '14px 0 16px 0',
            minHeight: 38,
            textAlign: 'center',
            fontWeight: 500,
            fontSize: '1.1rem'
          }}>
            {getStatusText()}
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 0,
            margin: '0 auto'
          }}>
            <div className="ttt-board"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gridTemplateRows: 'repeat(3, 1fr)',
                gap: 0,
                width: 240,
                height: 240,
                background: 'var(--bg-primary)',
                border: `2px solid var(--border-color)`,
                borderRadius: 17,
                margin: '0 auto',
                boxShadow: '0 4px 12px rgba(20,25,43,0.06)'
              }}
            >
              {Array(9).fill(null).map((_, i) => renderSquare(i))}
            </div>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 12,
            marginTop: 20,
            marginBottom: 8
          }}>
            <button
              className="ttt-restart-btn"
              onClick={handleRestart}
              style={{
                background: 'var(--accent)',
                color: 'var(--text-primary)',
                fontWeight: 700
              }}
              aria-label="Restart game"
            >
              Restart
            </button>
          </div>
          <div style={{
            marginTop: 8,
            textAlign: 'center',
            fontSize: 13,
            color: 'var(--text-secondary)'
          }}>
            <span>
              {gameMode === "human"
                ? "X: Player 1 / O: Player 2"
                : "X: You / O: AI"}
            </span>
          </div>
        </div>
      </header>
      {/* Inline style for minimalistic theme-specific board/buttons */}
      <style>{`
        .ttt-board {
          user-select: none;
        }
        .ttt-mode-btn,
        .ttt-restart-btn,
        .ttt-square {
          border-radius: 10px;
          outline: none;
          border: none;
          font-family: inherit;
        }
        .ttt-mode-btn {
          padding: 0.5rem 1.2rem;
          border: none;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.18s, color 0.2s;
        }
        .ttt-restart-btn {
          font-size: 1rem;
          padding: 0.5rem 1.2rem;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          margin-left: 0;
          margin-right: 0;
          transition: background 0.18s;
        }
        .ttt-board {
          margin: 0 auto;
        }
        .ttt-square {
          width: 80px;
          height: 80px;
          font-size: 2.3rem;
          font-weight: 700;
          background: transparent;
          border: 1.5px solid var(--border-color);
          margin: 0;
          transition: background 0.2s, color 0.19s;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          user-select: none;
        }
        .ttt-square:active:not(:disabled) {
          background: var(--accent);
        }
        .ttt-square:disabled {
          opacity: 0.7;
          cursor: default;
        }
        .ttt-mode-btn.active {
          box-shadow: 0 1.5px 7px 0px rgba(251,192,45,0.09);
        }
        @media (max-width: 600px) {
          .ttt-board {
            width: 96vw !important;
            height: 96vw !important;
            min-width: 180px;
            min-height: 180px;
            max-width: 98vw;
            max-height: 98vw;
          }
          .ttt-square {
            width: 30vw !important;
            height: 30vw !important;
            font-size: 7vw !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
