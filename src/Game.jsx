import React, { useState, useEffect, useCallback } from "react";
import { Trophy, RotateCw, Timer } from "lucide-react";

const FoodMemoryGame = () => {
  const GRID_SIZE = 4; // 4x4 grid for 8 pairs
  const FOOD_PAIRS = React.useMemo(
    () => ["🍕", "🍔", "🌮", "🍜", "🍣", "🥗", "🍎", "🍦"],
    []
  );

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
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const initializeGame = useCallback(() => {
    const foodItems = FOOD_PAIRS.slice(0, (GRID_SIZE * GRID_SIZE) / 2);
    const shuffledCards = [...foodItems, ...foodItems]
      .sort(() => Math.random() - 0.5)
      .map((food, index) => ({
        id: index,
        content: food,
        isFlipped: false,
        isMatched: false,
      }));

    setCards(shuffledCards);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameOver(false);
    setTimer(0);
    setIsRunning(true);
  }, [FOOD_PAIRS]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleCardClick = (cardId) => {
    if (gameOver) return;

    // Start timer on first move
    if (moves === 0) {
      setIsRunning(true);
    }

    // Prevent clicking same card or when two cards are already flipped
    if (flipped.includes(cardId) || flipped.length === 2) return;

    // Add card to flipped array
    const newFlipped = [...flipped, cardId];
    setFlipped(newFlipped);

    // If two cards are flipped, check for match
    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);

      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find((card) => card.id === firstId);
      const secondCard = cards.find((card) => card.id === secondId);

      if (firstCard.content === secondCard.content) {
        // Match found
        setMatched((prev) => [...prev, firstId, secondId]);
        setFlipped([]);

        // Check if game is complete
        if (matched.length + 2 === cards.length) {
          setGameOver(true);
          setIsRunning(false);
        }
      } else {
        // No match - flip cards back after delay
        setTimeout(() => {
          setFlipped([]);
        }, 1000);
      }
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const getGridTemplateColumns = () => {
    return GRID_SIZE === 4 ? "grid-cols-4" : "grid-cols-2";
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="flex items-center gap-8 text-lg">
        <div className="flex items-center gap-2">
          <Trophy className="text-yellow-500" />
          <span> Movimentos: {moves}</span>
        </div>
        <div className="flex items-center gap-2">
          <Timer className="text-blue-500" />
          <span> Tempo: {formatTime(timer)}</span>
        </div>
      </div>

      <div
        className={`grid ${getGridTemplateColumns()} gap-3 p-4 bg-gray-100 rounded-lg`}
      >
        {cards.map((card) => (
          <button
            key={card.id}
            className={`w-20 h-20 flex items-center justify-center text-3xl 
                  ${
                    flipped.includes(card.id) || matched.includes(card.id)
                      ? "bg-white rotate-0"
                      : "bg-purple-500 rotate-180 cursor-pointer"
                  } 
                  rounded-lg shadow transition-all duration-300 transform
                  ${
                    !matched.includes(card.id) && !gameOver
                      ? "hover:scale-105"
                      : ""
                  }`}
            onClick={() => handleCardClick(card.id)}
            disabled={matched.includes(card.id) || gameOver}
          >
            {flipped.includes(card.id) || matched.includes(card.id)
              ? card.content
              : ""}
          </button>
        ))}
      </div>

      {gameOver && (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-500"> Parabéns !</h2>
          <p className="text-gray-600">
            Você completou o jogo em {moves} movimentos e {formatTime(timer)}!
          </p>
          <button
            className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg flex items-center gap-2 hover:bg-purple-600"
            onClick={initializeGame}
          >
            <RotateCw size={16} />
            Jogar Novamente
          </button>
        </div>
      )}
    </div>
  );
};

export default FoodMemoryGame;
