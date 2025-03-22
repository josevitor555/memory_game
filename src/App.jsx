
import './App.css'
import './input.css'

import FoodMemoryGame from './components/Game'
import StartScreen from './components/StartScreen'
import { useState } from 'react'

function App() {

  const [difficulty, setDifficulty] = useState('easy');
  const [showStartScreen, setShowStartScreen] = useState(true);

  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
  }

  const startGame = () => {
    setShowStartScreen(false);
  }

  return (
    <div>
      {showStartScreen ? (
        <StartScreen
          difficulty={difficulty}
          handleDifficultyChange={handleDifficultyChange}
          startGame={startGame}
        />
      ) : (
        <FoodMemoryGame difficulty={difficulty} />
      )}
    </div>
  );
}

export default App
