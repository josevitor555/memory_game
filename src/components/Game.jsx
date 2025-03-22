import React, { useState, useEffect } from "react";
import { Trophy, RotateCw, Timer } from "lucide-react";

const FoodMemoryGame = ({ difficulty, resetGame }) => {
  // All possible food emojis
  const ALL_FOOD_EMOJIS = React.useMemo(() => ['🍕', '🍔', '🌮', '🍜', '🍣', '🥗', '🍎', '🍦', '🍩', '🍇', '🥑', '🍗', '🥐', '🥥', '🍒', '🍰', '🧁', '🍪'], []);

  // Dificulty settings
  const DIFFICULTY_LEVELS = React.useMemo(() => ({
    easy: { gridSize: 4, name: 'Fácil' },
    medium: { gridSize: 6, name: 'Médio' },
    hard: { gridSize: 8, name: 'Difícil' }
  }), []);

  const [gridSize, setGridSize] = useState(DIFFICULTY_LEVELS[difficulty].gridSize);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Time logic
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const initializeGame = React.useCallback(() => {
    const size = DIFFICULTY_LEVELS[difficulty].gridSize;
    setGridSize(size);

    const requiredPairs = (size * size) / 2;
    const foodItems = ALL_FOOD_EMOJIS.slice(0, requiredPairs);

    const shuffledCards = [...foodItems, ...foodItems]
      .sort(() => Math.random() - 0.5)
      .map((food, index) => ({
        id: index,
        content: food
      }));

    setCards(shuffledCards);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameOver(false);
    setTimer(0);
    setIsRunning(true);
  }, [ALL_FOOD_EMOJIS, DIFFICULTY_LEVELS, difficulty]);
  
  // Initialize game with difficulty level
  useEffect(() => {
    initializeGame();
  }, [difficulty, initializeGame]);

  const handleCardClick = (cardId) => {
    if (gameOver || flipped.includes(cardId) || flipped.length === 2) return;

    const newFlipped = [...flipped, cardId];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);

      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find((card) => card.id === firstId);
      const secondCard = cards.find((card) => card.id === secondId);

      if (firstCard.content === secondCard.content) {
        setMatched((prev) => [...prev, firstId, secondId]);
        setFlipped([]);
        if (matched.length + 2 === cards.length) {
          setGameOver(true);
          setIsRunning(false);
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate card size based on grid size
  const getCardSize = () => {
    switch (gridSize) {
      case 4: return 'w-20 h-20 text-3xl';
      case 6: return 'w-14 h-14 text-2xl';
      case 8: return 'w-10 h-10 text-xl';
      default: return 'w-20 h-20 text-3xl';
    }
  };

  // Generate grid template columns class
  const getGridColumns = () => {
    switch (gridSize) {
      case 4:
        return 'grid-cols-4'; // 4x4 grid
      case 6:
        return 'grid-cols-6'; // 6x6 grid
      case 8:
        return 'grid-cols-8'; // 8x8 grid
      default:
        return "grid-cols-4"; // Default to 4x4 grid
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
    <div className="flex justify-between w-full max-w-4xl">
      <button
        className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
        onClick={resetGame}
      >
        Voltar
      </button>
      <div className="text-gray-600">
        {DIFFICULTY_LEVELS[difficulty].name} ({gridSize}×{gridSize})
      </div>
      <div className="flex items-center gap-4">
        <Trophy className="text-yellow-500" />
        <span> Movimentos: {moves}</span>
        <Timer className="text-blue-500" />
        <span> Tempo: {formatTime(timer)}</span>
      </div>
    </div>

    <div className={`grid ${getGridColumns()} gap-2 p-4 bg-gray-100 rounded-lg`}>
      {cards.map((card) => (
        <button
          key={card.id}
          className={`${getCardSize()} flex items-center justify-center rounded-lg shadow transition-transform duration-300 ${
            flipped.includes(card.id) || matched.includes(card.id)
              ? "bg-white"
              : "bg-purple-500 cursor-pointer"
          }`}
          onClick={() => handleCardClick(card.id)}
          disabled={matched.includes(card.id) || gameOver}
        >
          {(flipped.includes(card.id) || matched.includes(card.id)) && card.content}
      </button>
      ))}
    </div>

    {gameOver && (
      <div className="text-center p-6 bg-white rounded-lg">
        <h2 className="text-2xl font-bold text-green-500"> Parabéns! </h2>
        <p className="text-lg mt-2">
          Você venceu no modo {DIFFICULTY_LEVELS[difficulty].name}!
        </p>
        <button className="flex items-center justify-between mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600" onClick={initializeGame}>
          <RotateCw size={16} /> Jogar Novamente
        </button>
      </div>
    )}
  </div>
  );
};

export default FoodMemoryGame;
