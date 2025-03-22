import { BarChart2 } from "lucide-react";

// Start screen component
const StartScreen = ({ difficulty, handleDifficultyChange, startGame }) => {

  const DIFFICULTY_LEVELS = {
    easy: { name: "Fácil", gridSize: 4 },
    medium: { name: "Médio", gridSize: 6 },
    hard: { name: "Difícil", gridSize: 8 },
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4 bg-gray-100 rounded-lg text-center">
      <h1 className="text-3xl font-bold text-purple-600"> Food Memory Game </h1>
      <p className="text-lg"> Combine pares de comidas deliciosas! </p>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <BarChart2 className="text-blue-500" />
          Selecione a Dificuldade
        </h2>

        <div className="grid grid-cols-3 gap-3">
          {Object.entries(DIFFICULTY_LEVELS).map(([key, value]) => (
            <button
              key={key}
              className={`p-3 rounded-lg ${
                difficulty === key
                  ? "bg-purple-500 text-white"
                  : "bg-white text-gray-700 hover:bg-purple-100 cursor-pointer"
              }`}
              onClick={() => handleDifficultyChange(key)}
            >
              {value.name}
              <div className="text-xs mt-1">
                {value.gridSize}×{value.gridSize}
              </div>
            </button>
          ))}
        </div>

        <button
          className="mt-6 px-6 py-3 bg-green-500 text-white rounded-lg text-xl font-bold hover:bg-green-600 transition-colors cursor-pointer"
          onClick={startGame}
        >
          Iniciar Jogo
        </button>
      </div>
    </div>
  );
};

export default StartScreen;
