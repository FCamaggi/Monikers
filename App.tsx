import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CardCategory, GamePhase, GameState, MonikersCard, Team, GameMode } from './types';
import { ALL_CARDS, ROUND_RULES, TURN_DURATION_SECONDS, PLAYER_CONFIG, PlayerCount } from './constants';
import { 
  Play, 
  SkipForward, 
  Check, 
  RotateCcw, 
  Users, 
  Clock, 
  HelpCircle,
  Trophy,
  ArrowRight,
  Shuffle,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// --- Helper Components ---

const CardView: React.FC<{ card: MonikersCard; isActive: boolean; t: any }> = ({ card, isActive, t }) => {
  // Determine color based on points/category aesthetic from screenshots
  // Default purple, but teal points circle
  
  return (
    <div className={`w-full max-w-sm aspect-[2.5/3.5] bg-white rounded-xl shadow-2xl border-4 border-white flex flex-col relative overflow-hidden transition-all duration-300 ${isActive ? 'scale-100 opacity-100' : 'scale-95 opacity-50 blur-sm'}`}>
      {/* Content */}
      <div className="flex-1 p-6 flex flex-col items-center justify-center text-center z-10">
        <h2 className="text-3xl font-black text-gray-900 mb-6 brand-font leading-tight">{card.name}</h2>
        <p className="text-gray-600 text-sm leading-relaxed font-medium">{card.description}</p>
      </div>

      {/* Footer Design */}
      <div className="pt-4 pb-6 px-4 flex flex-col items-center justify-end z-10">
        <div className="w-16 h-1 border-t-4 border-dotted border-gray-300 mb-4"></div>
        <span className="text-xs font-bold tracking-widest text-blue-400 uppercase mb-4">{card.category}</span>
        
        {/* Points Circle */}
        <div className="w-16 h-16 rounded-full bg-[#00AEEF] flex items-center justify-center text-white shadow-lg">
          <div className="text-center leading-none">
            <span className="block text-2xl font-black">{card.points}</span>
            <span className="block text-[0.5rem] font-bold uppercase tracking-wider">{t('card.points')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Manual Modal Component ---
const ManualModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void;
  currentPage: number;
  setPage: (page: number) => void;
}> = ({ isOpen, onClose, currentPage, setPage }) => {
  if (!isOpen) return null;

  const pages = [
    {
      title: "¿Qué es Monikers?",
      content: (
        <>
          <p className="mb-4">
            <strong>Monikers</strong> es un juego de adivinanzas en equipo. Tienes que hacer que tu equipo adivine el nombre en la carta.
          </p>
          <div className="bg-purple-100 rounded-lg p-4 mb-4">
            <p className="font-bold mb-2">Ejemplo de carta:</p>
            <p className="font-black text-lg mb-1">DRÁCULA</p>
            <p className="text-sm italic">Muerde personas y duerme en un ataúd. Es el vampiro principal.</p>
          </div>
          <p className="mb-2">Tienes <strong>60 segundos</strong> por turno para adivinar tantas cartas como sea posible.</p>
          <p className="text-sm text-purple-600">¡Puedes decir o hacer lo que quieras, excepto decir el nombre mismo!</p>
        </>
      )
    },
    {
      title: "Estructura del Juego",
      content: (
        <>
          <p className="mb-4">El juego se divide en <strong>3 rondas</strong> con las mismas cartas:</p>
          
          <div className="space-y-3">
            <div className="bg-blue-50 rounded-lg p-3">
              <h4 className="font-bold text-blue-900 mb-1">🗣️ RONDA 1: Di lo que quieras</h4>
              <p className="text-sm">Puedes usar palabras, sonidos o gestos. Puedes leer la descripción de la carta.</p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-3">
              <h4 className="font-bold text-green-900 mb-1">☝️ RONDA 2: Una palabra</h4>
              <p className="text-sm">Solo puedes decir UNA palabra. Puedes repetirla con diferentes entonaciones, pero sin sonidos ni gestos.</p>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-3">
              <h4 className="font-bold text-orange-900 mb-1">🤐 RONDA 3: Charadas</h4>
              <p className="text-sm">Solo mímica. Sin palabras. Los efectos de sonido están OK dentro de lo razonable.</p>
            </div>
          </div>
        </>
      )
    },
    {
      title: "Cómo Empezar",
      content: (
        <>
          <ol className="space-y-3 text-sm">
            <li className="flex gap-2">
              <span className="font-bold text-purple-600 flex-shrink-0">1.</span>
              <div>
                <strong>Elige jugadores (3-10):</strong> 3-5 jugadores = modo cooperativo (todos juntos). 6-10 jugadores = modo competitivo (2 equipos).
              </div>
            </li>
            
            <li className="flex gap-2">
              <span className="font-bold text-purple-600 flex-shrink-0">2.</span>
              <div>
                <strong>Ingresa nombres:</strong> Escribe el nombre de cada jugador. Usa el botón "Auto" para llenar rápido.
              </div>
            </li>
            
            <li className="flex gap-2">
              <span className="font-bold text-purple-600 flex-shrink-0">3.</span>
              <div>
                <strong>Selección de cartas:</strong> Cada jugador ve cartas y elige las que le parecen divertidas, interesantes o raras. Puedes usar "Seleccionar al azar" para ir más rápido.
              </div>
            </li>
            
            <li className="flex gap-2">
              <span className="font-bold text-purple-600 flex-shrink-0">4.</span>
              <div>
                <strong>¡A jugar!</strong> Las cartas seleccionadas se mezclan en un solo mazo que ambos equipos usarán.
              </div>
            </li>
          </ol>
        </>
      )
    },
    {
      title: "Cómo Jugar",
      content: (
        <>
          <div className="space-y-3 text-sm">
            <div className="bg-purple-50 rounded-lg p-3">
              <h4 className="font-bold mb-2">Durante tu turno (60 segundos):</h4>
              <ul className="space-y-1 ml-4">
                <li>• Da pistas para que tu equipo adivine</li>
                <li>• Si adivinan: presiona <strong className="text-green-600">ENTENDIDO ✓</strong></li>
                <li>• Si es difícil: presiona <strong className="text-yellow-600">SALTAR →</strong></li>
                <li>• Las cartas saltadas van al fondo del mazo</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-3">
              <h4 className="font-bold mb-2">📝 Regla importante:</h4>
              <p className="text-sm">"Casi correcto" cuenta como correcto. Si dicen parte del nombre o lo dicen mal, cuenta.</p>
              <p className="text-sm mt-1 italic">Ejemplo: "PISTOLA" = "PISTOLA DE DARDOS" ✓</p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-3">
              <h4 className="font-bold mb-2">🔄 Entre turnos:</h4>
              <p>Los equipos se alternan. En modo cooperativo, todos los jugadores rotan por orden.</p>
            </div>
          </div>
        </>
      )
    },
    {
      title: "Puntuación y Victoria",
      content: (
        <>
          <div className="space-y-3 text-sm">
            <div className="bg-green-50 rounded-lg p-3">
              <h4 className="font-bold text-green-900 mb-2">Al final de cada ronda:</h4>
              <ul className="space-y-1 ml-4">
                <li>• Los equipos cuentan las cartas que adivinaron</li>
                <li>• Cada carta vale 1-4 puntos según dificultad</li>
                <li>• Se suman los puntos al marcador</li>
                <li>• Todas las cartas se mezclan de nuevo</li>
                <li>• Siguiente ronda con nuevas reglas</li>
              </ul>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-3">
              <h4 className="font-bold text-purple-900 mb-2">🏆 Ganador:</h4>
              <p>El equipo con más puntos después de 3 rondas gana.</p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-3">
              <h4 className="font-bold text-blue-900 mb-2">👥 Modo Cooperativo:</h4>
              <p>Intentan terminar en el menor número de turnos posible. El juego les da una puntuación basada en cuántos turnos necesitaron.</p>
            </div>
          </div>
        </>
      )
    },
    {
      title: "Consejos y Trucos",
      content: (
        <>
          <div className="space-y-3 text-sm">
            <div className="bg-yellow-50 rounded-lg p-3">
              <h4 className="font-bold mb-2">💡 Para dar pistas:</h4>
              <ul className="space-y-1 ml-4">
                <li>• No pienses demasiado, ve rápido</li>
                <li>• Si una carta es muy difícil, sáltala</li>
                <li>• En Ronda 1, lee la descripción si no conoces la carta</li>
                <li>• En Ronda 2, recuerda qué palabra usaste antes</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-3">
              <h4 className="font-bold mb-2">🎯 Para adivinar:</h4>
              <ul className="space-y-1 ml-4">
                <li>• Grita todas las ideas que tengas</li>
                <li>• No te preocupes por equivocarte</li>
                <li>• Recuerda las cartas de rondas anteriores</li>
                <li>• En Ronda 3, todas las cartas las has visto antes</li>
              </ul>
            </div>
            
            <div className="bg-green-50 rounded-lg p-3">
              <h4 className="font-bold mb-2">✨ Pro tips:</h4>
              <ul className="space-y-1 ml-4">
                <li>• Cada carta se juega 3 veces (una por ronda)</li>
                <li>• En Ronda 3 es más fácil porque ya las conoces</li>
                <li>• Elige cartas que tu grupo conozca</li>
              </ul>
            </div>
          </div>
        </>
      )
    }
  ];

  const totalPages = pages.length;
  const page = pages[currentPage];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200">
          <h2 className="text-xl md:text-2xl font-black text-purple-600">
            Manual de Monikers
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
            {page.title}
          </h3>
          <div className="text-gray-700 leading-relaxed">
            {page.content}
          </div>
        </div>

        {/* Footer with navigation */}
        <div className="border-t border-gray-200 p-4 flex items-center justify-between">
          <button
            onClick={() => setPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-100 text-purple-600 font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-purple-200 transition-colors"
          >
            <ChevronLeft size={20} />
            Anterior
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setPage(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentPage 
                    ? 'bg-purple-600 w-6' 
                    : 'bg-purple-200 hover:bg-purple-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setPage(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage === totalPages - 1}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
          >
            Siguiente
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const { t, i18n } = useTranslation();
  
  // -- State --
  const [gameState, setGameState] = useState<GameState>({
    phase: GamePhase.SETUP,
    round: 1,
    teams: [
      { id: 1, name: t('team.a'), score: 0, color: 'bg-purple-600' },
      { id: 2, name: t('team.b'), score: 0, color: 'bg-orange-500' }
    ],
    currentTeamIndex: 0,
    masterDeck: [],
    drawPile: [],
    roundGuessedCards: [],
    teamRoundCards: [[], []],
    currentCard: null,
    turnGuessedCards: [],
    timeRemaining: TURN_DURATION_SECONDS,
    mode: undefined,
    playerCount: undefined,
    playerNames: [],
    availableCards: [],
    selectedCards: [],
    cardsToSelect: 0,
    currentPlayerSelecting: 0,
    allSelectedCards: [],
    dealtCards: [],
    totalTurns: 0,
    currentPlayerIndex: 0
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [buttonCooldown, setButtonCooldown] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [manualPage, setManualPage] = useState(0);

  // -- Helpers --

  const shuffle = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const playSound = (type: 'success' | 'skip' | 'tick' | 'end') => {
    // Simple placeholder for sound effects logic
    // In a real browser context, Audio API would be used here
  };

  // -- Game Actions --

  const selectPlayerCount = (count: PlayerCount) => {
    const config = PLAYER_CONFIG[count];
    
    // Ir a la fase de ingreso de nombres
    setGameState(prev => ({
      ...prev,
      phase: GamePhase.PLAYER_NAMES,
      playerCount: count,
      mode: config.mode,
      playerNames: Array(count).fill('')
    }));
  };

  const startCardSelection = () => {
    const config = gameState.playerCount ? PLAYER_CONFIG[gameState.playerCount] : null;
    if (!config) return;
    
    // Iniciar el proceso de selección por turnos
    const shuffledDeck = shuffle(ALL_CARDS);
    const firstPlayerCards = shuffledDeck.slice(0, config.deal);
    
    setGameState(prev => ({
      ...prev,
      phase: GamePhase.CARD_SELECTION,
      availableCards: firstPlayerCards,
      selectedCards: [],
      cardsToSelect: config.pick,
      currentPlayerSelecting: 1,
      allSelectedCards: [],
      dealtCards: firstPlayerCards
    }));
  };

  const finishPlayerSelection = () => {
    const config = gameState.playerCount ? PLAYER_CONFIG[gameState.playerCount] : null;
    if (!config) return;

    const currentPlayer = gameState.currentPlayerSelecting || 1;
    const totalPlayers = gameState.playerCount || 0;

    // Agregar las cartas seleccionadas por este jugador al pool total
    const allSelected = [...(gameState.allSelectedCards || []), ...(gameState.selectedCards || [])];

    if (currentPlayer < totalPlayers) {
      // Hay más jugadores: repartir cartas al siguiente
      const nextPlayer = currentPlayer + 1;
      const dealtSoFar = gameState.dealtCards || [];
      const remainingCards = ALL_CARDS.filter(card => 
        !dealtSoFar.some(dealt => dealt.id === card.id)
      );
      const nextPlayerCards = remainingCards.slice(0, config.deal);

      // Scroll al inicio cuando cambia el jugador
      window.scrollTo({ top: 0, behavior: 'smooth' });

      setGameState(prev => ({
        ...prev,
        currentPlayerSelecting: nextPlayer,
        availableCards: nextPlayerCards,
        selectedCards: [],
        cardsToSelect: config.pick,
        allSelectedCards: allSelected,
        dealtCards: [...dealtSoFar, ...nextPlayerCards]
      }));
    } else {
      // Todos los jugadores terminaron: proceder al juego
      startGameWithAllSelectedCards(allSelected, config);
    }
  };

  const startGameWithAllSelectedCards = (selectedCards: MonikersCard[], config: any) => {
    let finalDeck = [...selectedCards];

    // En modo cooperativo, agregar cartas aleatorias no vistas
    const isCooperative = config.mode === 'COOPERATIVE';
    const randomCardsCount = config.addRandom || 0;

    if (isCooperative && randomCardsCount > 0) {
      const dealtCards = gameState.dealtCards || [];
      const unseenCards = ALL_CARDS.filter(card => 
        !dealtCards.some(dealt => dealt.id === card.id)
      );
      const randomCards = shuffle(unseenCards).slice(0, randomCardsCount);
      finalDeck = [...finalDeck, ...randomCards];
    }

    const shuffledDeck = shuffle(finalDeck);

    // Configurar equipos según el modo
    const teams = isCooperative 
      ? [{ id: 1, name: t('team.all'), score: 0, color: 'bg-blue-500' }]
      : [
          { id: 1, name: t('team.a'), score: 0, color: 'bg-red-500' },
          { id: 2, name: t('team.b'), score: 0, color: 'bg-blue-500' }
        ];

    setGameState(prev => ({
      ...prev,
      phase: GamePhase.ROUND_INTRO,
      round: 1,
      teams: teams,
      currentTeamIndex: 0,
      masterDeck: shuffledDeck,
      drawPile: [...shuffledDeck],
      roundGuessedCards: [],
      teamRoundCards: isCooperative ? [[]] : [[], []],
      currentCard: null,
      turnGuessedCards: [],
      availableCards: [],
      selectedCards: [],
      allSelectedCards: [],
      dealtCards: [],
      currentPlayerSelecting: 0,
      totalTurns: isCooperative ? 0 : undefined,
      currentPlayerIndex: isCooperative ? 0 : undefined
    }));
  };

  const toggleCardSelection = (card: MonikersCard) => {
    setGameState(prev => {
      const isSelected = prev.selectedCards?.some(c => c.id === card.id);
      
      if (isSelected) {
        // Deselect
        return {
          ...prev,
          selectedCards: prev.selectedCards?.filter(c => c.id !== card.id) || []
        };
      } else {
        // Select (if not at limit)
        const currentCount = prev.selectedCards?.length || 0;
        if (currentCount < (prev.cardsToSelect || 0)) {
          return {
            ...prev,
            selectedCards: [...(prev.selectedCards || []), card]
          };
        }
        return prev;
      }
    });
  };

  const startGame = (cardCount: number = 20) => {
    // Use a subset of ALL_CARDS for the game
    const deck = shuffle(ALL_CARDS).slice(0, Math.min(cardCount, ALL_CARDS.length));
    
    setGameState(prev => ({
      ...prev,
      phase: GamePhase.ROUND_INTRO,
      masterDeck: deck,
      drawPile: shuffle([...deck]), // Initial draw pile is the master deck
      round: 1,
      teams: [
        { ...prev.teams[0], score: 0 },
        { ...prev.teams[1], score: 0 }
      ],
      currentTeamIndex: 0,
      roundGuessedCards: []
    }));
  };

  const startTurn = () => {
    setGameState(prev => ({
      ...prev,
      phase: GamePhase.TURN_ACTIVE,
      timeRemaining: TURN_DURATION_SECONDS,
      turnGuessedCards: [],
      currentCard: prev.drawPile[0] // Set initial card
    }));
  };

  const endTurn = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    setGameState(prev => {
      const isCooperative = prev.mode === GameMode.COOPERATIVE;
      
      // Según el manual: las cartas adivinadas se quedan con el equipo
      // pero los puntos NO se suman hasta el final de la ronda
      
      return {
        ...prev,
        phase: GamePhase.TURN_SUMMARY,
        currentCard: null,
        totalTurns: isCooperative ? (prev.totalTurns || 0) + 1 : prev.totalTurns
      };
    });
  };

  const nextTurn = () => {
    setGameState(prev => {
      const isCooperative = prev.mode === GameMode.COOPERATIVE;
      
      // Check if round is over (draw pile empty and no current card)
      const isRoundOver = prev.drawPile.length === 0 && !prev.currentCard;

      if (isRoundOver) {
        return {
          ...prev,
          phase: GamePhase.ROUND_SUMMARY,
          turnGuessedCards: [] // Limpiar para la siguiente ronda
        };
      }

      // Switch Team or Player
      if (isCooperative) {
        // Cooperative: rotate to next player
        const nextPlayerIndex = ((prev.currentPlayerIndex || 0) + 1) % (prev.playerCount || 1);
        return {
          ...prev,
          phase: GamePhase.TURN_READY,
          currentPlayerIndex: nextPlayerIndex,
          turnGuessedCards: [] // Limpiar para el siguiente turno
        };
      } else {
        // Competitive: switch team
        return {
          ...prev,
          phase: GamePhase.TURN_READY,
          currentTeamIndex: prev.currentTeamIndex === 0 ? 1 : 0,
          turnGuessedCards: [] // Limpiar para el siguiente turno
        };
      }
    });
  };

  const nextRound = () => {
    setGameState(prev => {
      // Calcular puntos de la ronda que acaba de terminar
      const teamCards = prev.teamRoundCards || [[], []];
      const team0Points = teamCards[0].reduce((sum, card) => sum + card.points, 0);
      const team1Points = teamCards[1].reduce((sum, card) => sum + card.points, 0);
      
      const updatedTeams = prev.teams.map((team, idx) => ({
        ...team,
        score: team.score + (idx === 0 ? team0Points : team1Points)
      }));

      if (prev.round >= 3) {
        return {
          ...prev,
          teams: updatedTeams,
          phase: GamePhase.GAME_OVER
        };
      }

      // Prepare next round: Restore all cards from master deck (shuffled)
      // Per rules: "Shuffle all the cards back together into one deck"
      const isCooperative = prev.mode === GameMode.COOPERATIVE;
      return {
        ...prev,
        teams: updatedTeams,
        round: prev.round + 1,
        phase: GamePhase.ROUND_INTRO,
        drawPile: shuffle([...prev.masterDeck]),
        roundGuessedCards: [],
        teamRoundCards: isCooperative ? [[]] : [[], []], // Reset cartas de la ronda
        // Team with lowest score starts (Per rules)
        currentTeamIndex: isCooperative ? 0 : (updatedTeams[0].score < updatedTeams[1].score ? 0 : 1)
      };
    });
  };

  const handleCorrect = () => {
    if (buttonCooldown) return; // Prevenir doble click
    
    setButtonCooldown(true);
    setTimeout(() => setButtonCooldown(false), 200);
    
    playSound('success');
    setGameState(prev => {
      const justGuessed = prev.currentCard;
      if (!justGuessed) return prev;

      // Remove current from draw pile
      const remainingDrawPile = prev.drawPile.slice(1);
      
      // Según el manual: la carta se guarda para el equipo, puntos se cuentan al final de la ronda
      const teamIdx = prev.currentTeamIndex;
      const updatedTeamCards = [...(prev.teamRoundCards || [[], []])];
      updatedTeamCards[teamIdx] = [...(updatedTeamCards[teamIdx] || []), justGuessed];
      
      // Check if that was the last card
      if (remainingDrawPile.length === 0) {
        // Última carta de la ronda - terminar turno y ronda
        if (timerRef.current) clearInterval(timerRef.current);
        
        return {
          ...prev,
          phase: GamePhase.TURN_SUMMARY,
          roundGuessedCards: [...prev.roundGuessedCards, justGuessed],
          turnGuessedCards: [...prev.turnGuessedCards, justGuessed],
          teamRoundCards: updatedTeamCards,
          currentCard: null,
          drawPile: [],
          timeRemaining: 0
        };
      }

      return {
        ...prev,
        roundGuessedCards: [...prev.roundGuessedCards, justGuessed],
        turnGuessedCards: [...prev.turnGuessedCards, justGuessed],
        teamRoundCards: updatedTeamCards,
        drawPile: remainingDrawPile,
        currentCard: remainingDrawPile[0]
      };
    });
  };

  const handleSkip = () => {
    if (buttonCooldown) return; // Prevenir doble click
    
    setButtonCooldown(true);
    setTimeout(() => setButtonCooldown(false), 200);
    
    playSound('skip');
    setGameState(prev => {
      const skippedCard = prev.currentCard;
      if (!skippedCard) return prev;

      // Logic: skipped card goes to bottom of deck
      const remaining = prev.drawPile.slice(1);
      const newDrawPile = [...remaining, skippedCard];

      return {
        ...prev,
        drawPile: newDrawPile,
        currentCard: newDrawPile[0]
      };
    });
  };

  // -- Effects --

  // Timer Logic
  useEffect(() => {
    if (gameState.phase === GamePhase.TURN_ACTIVE) {
      timerRef.current = setInterval(() => {
        setGameState(prev => {
          if (prev.timeRemaining <= 1) {
            // Time is up
            if (timerRef.current) clearInterval(timerRef.current);
            // Must calculate score here because we can't call endTurn directly inside setState
            // Actually, we can trigger the phase change which renders the Summary component
            
            // Note: If time runs out, the current card goes BACK to the pile (or remains in draw pile effectively)
            // Ideally, we push it back to the top or mix it? 
            // Rules say: "When you skip a card, just put it on the bottom". 
            // If time runs out, let's treat the current card as "not guessed" and keep it in the pile (at start for next person)
            
            // Logic tweak: currentCard is technically mostly 'head' of drawPile. 
            // If we just switch phases, we need to ensure drawPile includes currentCard if not guessed.
            // My handleCorrect logic slices drawPile. So if we finish, we just need to make sure currentCard isn't lost.
            // In my implementation, I only sliced drawPile on correct. So drawPile still has currentCard at index 0.
            
            return {
              ...prev,
              phase: GamePhase.TURN_SUMMARY,
              timeRemaining: 0,
              currentCard: null
            };
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState.phase]);


  // -- Render Helpers --
  const currentTeam = gameState.teams[gameState.currentTeamIndex];

  // --- Render Content ---
  const renderContent = () => {
    // --- Views ---

    if (gameState.phase === GamePhase.SETUP) {
    return (
      <div className="min-h-screen bg-[#8A2BE2] flex flex-col items-center justify-center p-6 text-white text-center">
        <h1 className="text-6xl font-black mb-4 tracking-tighter uppercase">{t('game.title')}</h1>
        <p className="text-xl mb-12 max-w-md font-medium text-purple-200">
          {t('setup.title')}
        </p>
        
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-2xl w-full shadow-xl border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{t('setup.selectPlayers')}</h2>
            <button
              onClick={() => setShowManual(true)}
              className="text-sm bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <HelpCircle size={18} />
              Manual
            </button>
          </div>
          
          <div className="grid grid-cols-4 gap-3 mb-8">
            {[3, 4, 5, 6, 7, 8, 9, 10].map((count) => {
              const config = PLAYER_CONFIG[count as PlayerCount];
              const isCooperative = config.mode === GameMode.COOPERATIVE;
              
              return (
                <button
                  key={count}
                  onClick={() => selectPlayerCount(count as PlayerCount)}
                  className={`${
                    isCooperative ? 'bg-[#00AEEF]' : 'bg-white'
                  } ${
                    isCooperative ? 'text-white' : 'text-[#8A2BE2]'
                  } font-black py-4 px-2 rounded-xl text-xl hover:scale-105 transition-all shadow-lg transform active:scale-95`}
                >
                  {count}
                </button>
              );
            })}
          </div>
          
          <div className="text-sm text-purple-200 space-y-2">
            <p>{t('setup.mode')}: 3-5 = {t('game.cooperative')} | 6-10 = {t('game.competitive')}</p>
            <p className="text-xs opacity-75">{t('setup.cardsInfo')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (gameState.phase === GamePhase.PLAYER_NAMES) {
    const canContinue = gameState.playerNames?.every(name => name.trim().length > 0) || false;
    
    const randomizeNames = () => {
      const names = Array.from({ length: gameState.playerCount || 0 }, (_, i) => `Jugador ${i + 1}`);
      setGameState(prev => ({ ...prev, playerNames: names }));
    };
    
    return (
      <div className="min-h-screen bg-[#8A2BE2] flex flex-col items-center justify-center p-4 text-white">
        <h1 className="text-3xl md:text-4xl font-black mb-2 text-center">{t('game.title')}</h1>
        <p className="text-base md:text-lg mb-8 text-purple-200 text-center">
          Ingresa los nombres de los {gameState.playerCount} jugadores
        </p>
        
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 max-w-md w-full shadow-xl border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold">Jugadores</h2>
            <button
              onClick={randomizeNames}
              className="text-xs md:text-sm bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
              title="Aleatorizar nombres"
            >
              <Shuffle size={14} />
              Auto
            </button>
          </div>
          
          <div className="space-y-3 mb-8">
            {gameState.playerNames?.map((name, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="bg-[#00AEEF] rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                  {index + 1}
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    const newNames = [...(gameState.playerNames || [])];
                    newNames[index] = e.target.value;
                    setGameState(prev => ({ ...prev, playerNames: newNames }));
                  }}
                  placeholder={`Jugador ${index + 1}`}
                  className="flex-1 bg-white/20 border-2 border-white/30 rounded-lg px-4 py-2 text-white placeholder-purple-300 focus:border-white focus:outline-none"
                  autoFocus={index === 0}
                />
              </div>
            ))}
          </div>
          
          <button
            onClick={startCardSelection}
            disabled={!canContinue}
            className={`${
              canContinue 
                ? 'bg-white text-[#8A2BE2] hover:bg-purple-50' 
                : 'bg-white/20 text-white/40 cursor-not-allowed'
            } w-full font-black py-3 rounded-full text-lg shadow-xl transition-all`}
          >
            Continuar →
          </button>
        </div>
      </div>
    );
  }

  if (gameState.phase === GamePhase.CARD_SELECTION) {
    const selectedCount = gameState.selectedCards?.length || 0;
    const targetCount = gameState.cardsToSelect || 0;
    const canContinue = selectedCount === targetCount;
    const config = gameState.playerCount ? PLAYER_CONFIG[gameState.playerCount] : null;
    const currentPlayer = gameState.currentPlayerSelecting || 1;
    const totalPlayers = gameState.playerCount || 0;
    const allSelectedCount = (gameState.allSelectedCards?.length || 0) + selectedCount;
    const totalCardsNeeded = config ? config.pick * totalPlayers : 0;
    const playerName = gameState.playerNames?.[currentPlayer - 1] || `Jugador ${currentPlayer}`;
    
    return (
      <div className="min-h-screen bg-[#8A2BE2] flex flex-col p-3 md:p-6 text-white">
        {/* Header */}
        <div className="text-center mb-3">
          <h1 className="text-2xl md:text-4xl font-black mb-1">{t('selection.title')}</h1>
          <p className="text-sm md:text-lg text-purple-200">{t('selection.subtitle')}</p>
        </div>

        {/* Instructions Box - Optimizado para móvil */}
        <div className="max-w-4xl mx-auto mb-4 bg-white/10 backdrop-blur-md rounded-xl p-3 md:p-4 border border-white/20">
          <div className="flex items-start gap-2 md:gap-3">
            <div className="bg-[#00AEEF] rounded-full w-7 h-7 md:w-8 md:h-8 flex items-center justify-center flex-shrink-0 font-black text-sm md:text-lg">
              {currentPlayer}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-base md:text-lg mb-1 truncate">
                {playerName}
              </h2>
              <p className="text-xs md:text-sm text-purple-200 leading-relaxed">
                Elige <span className="font-bold text-[#00AEEF]">{targetCount} cartas</span> de {config?.deal}. 
                {currentPlayer < totalPlayers && <> Luego el siguiente.</>}
                {config?.mode === 'COOPERATIVE' && config.addRandom > 0 && currentPlayer === totalPlayers && (
                  <span className="block mt-1 text-xs opacity-90">
                    (Se agregan {config.addRandom} aleatorias al final)
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Progress: Current Player */}
        <div className="max-w-4xl mx-auto mb-2 px-1">
          <div className="flex justify-between text-xs md:text-sm mb-1">
            <span>Tu selección</span>
            <span className="font-bold">{selectedCount}/{targetCount}</span>
          </div>
          <div className="bg-white/20 h-2 md:h-3 rounded-full overflow-hidden">
            <div 
              className="bg-[#00AEEF] h-full transition-all duration-300"
              style={{ width: `${(selectedCount / targetCount) * 100}%` }}
            />
          </div>
        </div>

        {/* Progress: Overall */}
        <div className="max-w-4xl mx-auto mb-4 px-1">
          <div className="flex justify-between text-xs text-purple-300 mb-1">
            <span>Progreso total</span>
            <span>Jugador {currentPlayer}/{totalPlayers} • {allSelectedCount}/{totalCardsNeeded}</span>
          </div>
          <div className="bg-white/30 h-1.5 md:h-2 rounded-full overflow-hidden">
            <div 
              className="bg-white/70 h-full transition-all duration-300"
              style={{ width: `${(allSelectedCount / totalCardsNeeded) * 100}%` }}
            />
          </div>
        </div>

        {/* Quick Select Button */}
        <div className="max-w-4xl mx-auto mb-3 px-1 text-center">
          <button
            onClick={() => {
              const available = gameState.availableCards || [];
              const needed = targetCount - selectedCount;
              const unselected = available.filter(card => !gameState.selectedCards?.some(c => c.id === card.id));
              const randomPicks = shuffle(unselected).slice(0, needed);
              setGameState(prev => ({
                ...prev,
                selectedCards: [...(prev.selectedCards || []), ...randomPicks]
              }));
            }}
            disabled={selectedCount >= targetCount}
            className="text-xs md:text-sm bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <Shuffle size={14} />
            Seleccionar {targetCount - selectedCount} al azar
          </button>
        </div>

        {/* Cards Grid - Optimizado para móviles */}
        <div className="flex-1 overflow-auto mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 max-w-7xl mx-auto">
            {gameState.availableCards?.map((card) => {
              const isSelected = gameState.selectedCards?.some(c => c.id === card.id);
              
              return (
                <button
                  key={card.id}
                  onClick={() => toggleCardSelection(card)}
                  className={`${
                    isSelected 
                      ? 'bg-[#00AEEF] border-[#00AEEF]' 
                      : 'bg-white/10 border-white/20'
                  } border-2 rounded-lg p-3 text-left transition-colors duration-200`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-black text-base md:text-lg flex-1 pr-2 leading-tight">{card.name}</h3>
                    <span className={`${
                      isSelected ? 'bg-white text-[#00AEEF]' : 'bg-purple-500'
                    } text-xs font-bold px-2 py-1 rounded-full flex-shrink-0`}>
                      {card.points}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-purple-100 mb-2 leading-relaxed line-clamp-3">
                    {card.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-purple-300 truncate">{card.category}</div>
                    {isSelected && (
                      <Check size={16} className="text-white flex-shrink-0 ml-2" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Start Button - Optimizado para móvil */}
        <div className="text-center px-1">
          {!canContinue && (
            <p className="mb-3 text-purple-200 text-xs md:text-sm">
              Te faltan {targetCount - selectedCount} cartas por elegir
            </p>
          )}
          <button
            onClick={finishPlayerSelection}
            disabled={!canContinue}
            className={`${
              canContinue 
                ? 'bg-white text-[#8A2BE2] active:bg-purple-50' 
                : 'bg-white/20 text-white/40 cursor-not-allowed'
            } font-black py-3 md:py-4 px-8 md:px-12 rounded-full text-base md:text-xl shadow-xl transition-colors w-full sm:w-auto flex items-center justify-center gap-2 md:gap-3 mx-auto`}
          >
            {currentPlayer < totalPlayers ? (
              <>Siguiente Jugador <ArrowRight size={20} className="md:w-6 md:h-6" /></>
            ) : (
              <>¡Empezar Juego! <ArrowRight size={20} className="md:w-6 md:h-6" /></>
            )}
          </button>
        </div>
      </div>
    );
  }

  if (gameState.phase === GamePhase.LOBBY) {
    return (
      <div className="min-h-screen bg-[#8A2BE2] flex flex-col items-center justify-center p-6 text-white text-center">
        <h1 className="text-6xl font-black mb-4 tracking-tighter uppercase">{t('game.title')}</h1>
        <p className="text-xl mb-12 max-w-md font-medium text-purple-200">
          {t('game.subtitle')}
        </p>
        
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-sm w-full shadow-xl border border-white/20">
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => startGame(20)}
              className="w-full bg-white text-[#8A2BE2] font-black py-4 px-6 rounded-xl text-lg hover:bg-purple-50 transition-colors shadow-lg transform active:scale-95"
            >
              {t('game.quickGame', { count: 20 })}
            </button>
            <button 
              onClick={() => startGame(40)}
              className="w-full bg-[#00AEEF] text-white font-black py-4 px-6 rounded-xl text-lg hover:bg-[#009fdb] transition-colors shadow-lg transform active:scale-95"
            >
              {t('game.standardGame', { count: 40 })}
            </button>
            <button 
              onClick={() => startGame(60)}
              className="w-full bg-[#FF6B6B] text-white font-black py-4 px-6 rounded-xl text-lg hover:bg-[#ff5252] transition-colors shadow-lg transform active:scale-95"
            >
              {t('game.longGame', { count: 60 })}
            </button>
          </div>
          <div className="mt-6 text-sm text-purple-200">
            {t('game.playersInfo', { count: ALL_CARDS.length })}
          </div>
        </div>
      </div>
    );
  }

  if (gameState.phase === GamePhase.ROUND_INTRO) {
    return (
      <div className="min-h-screen bg-[#8A2BE2] flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="bg-white text-[#8A2BE2] font-bold px-4 py-1 rounded-full mb-4 uppercase tracking-wider text-sm">
          {t('round.number', { number: gameState.round })}
        </div>
        <h2 className="text-5xl font-black mb-6 uppercase">{t(`round.${gameState.round}.title`)}</h2>
        <p className="text-2xl font-medium max-w-md mb-12 leading-relaxed">
          {t(`round.${gameState.round}.description`)}
        </p>
        <button 
          onClick={() => setGameState(prev => ({ ...prev, phase: GamePhase.TURN_READY }))}
          className="bg-[#00AEEF] text-white font-black py-4 px-12 rounded-full text-xl hover:bg-[#009fdb] shadow-xl transition-transform transform hover:scale-105 active:scale-95 flex items-center gap-3"
        >
          {t('round.start')} <ArrowRight size={24} />
        </button>
      </div>
    );
  }

  if (gameState.phase === GamePhase.TURN_READY) {
    const isCooperative = gameState.mode === GameMode.COOPERATIVE;
    const currentPlayerIdx = gameState.currentPlayerIndex || 0;
    const playerName = isCooperative && gameState.playerNames?.[currentPlayerIdx] 
      ? gameState.playerNames[currentPlayerIdx]
      : null;
    const displayName = playerName || (isCooperative 
      ? t('coop.player', { number: currentPlayerIdx + 1 })
      : currentTeam.name);
    const bgColor = isCooperative ? 'bg-blue-500' : currentTeam.color;
    
    return (
      <div className={`min-h-screen ${bgColor} flex flex-col items-center justify-center p-6 text-white text-center transition-colors duration-500`}>
        <div className="bg-black/20 p-8 rounded-3xl backdrop-blur-sm max-w-sm w-full">
          <div className="uppercase text-sm font-bold tracking-widest opacity-80 mb-2">{t('turn.upNext')}</div>
          <h2 className="text-5xl font-black mb-8">{displayName}</h2>
          
          <div className="flex justify-between items-center mb-12 bg-black/10 rounded-xl p-4">
            <div className="text-center">
              <span className="block text-xs font-bold uppercase opacity-60">{t('turn.cardsLeft')}</span>
              <span className="block text-2xl font-bold">{gameState.drawPile.length}</span>
            </div>
            <div className="text-center border-l border-white/20 pl-4">
               <span className="block text-xs font-bold uppercase opacity-60">{t('turn.round')}</span>
               <span className="block text-2xl font-bold">{gameState.round}/3</span>
            </div>
            {isCooperative && (
              <div className="text-center border-l border-white/20 pl-4">
                <span className="block text-xs font-bold uppercase opacity-60">{t('coop.turns')}</span>
                <span className="block text-2xl font-bold">{gameState.totalTurns || 0}</span>
              </div>
            )}
          </div>

          <p className="mb-8 font-medium">
            {isCooperative 
              ? t('coop.passDevice', { player: displayName })
              : t('turn.passDevice', { team: currentTeam.name })
            }
          </p>

          <button 
            onClick={startTurn}
            className="w-full bg-white text-gray-900 font-black py-4 px-6 rounded-xl text-xl shadow-xl hover:bg-gray-50 transition-transform transform active:scale-95 flex items-center justify-center gap-2"
          >
            <Play fill="currentColor" /> {t('turn.go')}
          </button>
        </div>
      </div>
    );
  }

  if (gameState.phase === GamePhase.TURN_ACTIVE) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white px-4 py-3 shadow-sm flex items-center justify-between z-20">
            <div className={`font-black text-lg ${currentTeam.id === 1 ? 'text-purple-600' : 'text-orange-500'}`}>
                {currentTeam.name}
            </div>
            <div className={`flex items-center gap-2 font-mono text-xl font-bold ${gameState.timeRemaining < 10 ? 'text-red-500 animate-pulse' : 'text-gray-700'}`}>
                <Clock size={20} />
                {gameState.timeRemaining}s
            </div>
        </div>

        {/* Card Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
             {gameState.currentCard && (
                 <div className="slide-in w-full flex justify-center">
                     <CardView card={gameState.currentCard} isActive={true} t={t} />
                 </div>
             )}
             {!gameState.currentCard && gameState.drawPile.length === 0 && (
                 <div className="text-gray-400 font-bold text-xl">Deck Empty!</div>
             )}
        </div>

        {/* Controls */}
        <div className="bg-white p-4 pb-8 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-20">
            <div className="max-w-md mx-auto flex gap-4">
                <button 
                    onClick={handleSkip}
                    disabled={buttonCooldown}
                    className="flex-1 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-yellow-900 font-black py-4 rounded-xl shadow-lg flex flex-col items-center justify-center active:scale-95 transition-all"
                >
                    <SkipForward size={24} className="mb-1" />
                    {t('turn.skip').toUpperCase()}
                </button>
                <button 
                    onClick={handleCorrect}
                    disabled={buttonCooldown}
                    className="flex-[2] bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl shadow-lg flex flex-col items-center justify-center active:scale-95 transition-all"
                >
                    <Check size={32} className="mb-1" />
                    {t('turn.gotIt').toUpperCase()}
                </button>
            </div>
            <div className="text-center mt-4 text-xs text-gray-400 font-medium uppercase tracking-widest">
                {t('round.number', { number: gameState.round })}: {t(`round.${gameState.round}.title`)}
            </div>
        </div>
      </div>
    );
  }

  if (gameState.phase === GamePhase.TURN_SUMMARY) {
    const cardsThisTurn = gameState.turnGuessedCards.length;
    const pointsThisTurn = gameState.turnGuessedCards.reduce((acc, c) => acc + c.points, 0);
    const teamIdx = gameState.currentTeamIndex;
    const teamRoundCards = (gameState.teamRoundCards || [[], []])[teamIdx] || [];
    const totalCardsThisRound = teamRoundCards.length;
    
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-3xl font-bold mb-2">{t('turn.timeUp')}</h2>
        <div className="text-6xl font-black text-green-400 mb-2">{cardsThisTurn}</div>
        <p className="text-gray-400 uppercase tracking-widest text-sm mb-2">
          {cardsThisTurn === 1 ? 'Carta adivinada' : 'Cartas adivinadas'}
        </p>
        <p className="text-sm text-green-400 mb-8">+{pointsThisTurn} puntos</p>

        <div className="bg-gray-800 rounded-xl p-6 w-full max-w-sm mb-8">
           <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-700">
               <span className="font-bold text-gray-400">Cartas esta ronda</span>
           </div>
           {gameState.teams.map((team, idx) => {
               const teamCards = (gameState.teamRoundCards || [[], []])[idx] || [];
               return (
                 <div key={team.id} className="flex justify-between items-center mb-2">
                     <span className={`${idx === teamIdx ? 'text-white font-bold' : 'text-gray-500'}`}>
                       {team.name}
                     </span>
                     <span className="font-mono text-xl">{teamCards.length}</span>
                 </div>
               );
           })}
        </div>

        <button 
            onClick={nextTurn}
            className="w-full max-w-sm bg-white text-gray-900 font-black py-4 rounded-xl text-lg hover:bg-gray-100 transition-transform active:scale-95"
        >
            {t('turn.nextTurn')}
        </button>
      </div>
    );
  }

  if (gameState.phase === GamePhase.ROUND_SUMMARY) {
    const leader = gameState.teams.reduce((prev, current) => (prev.score > current.score) ? prev : current);
    
    return (
      <div className="min-h-screen bg-[#8A2BE2] text-white flex flex-col items-center justify-center p-6 text-center">
        <Trophy size={64} className="text-yellow-300 mb-4" />
        <h2 className="text-4xl font-black mb-2 uppercase">{t('roundEnd.title', { number: gameState.round })}</h2>
        <p className="text-purple-200 mb-8 max-w-xs mx-auto">
          {t('roundEnd.description')}
        </p>

        <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-12">
            {gameState.teams.map(team => (
                <div key={team.id} className={`bg-white/10 p-6 rounded-2xl border ${leader.id === team.id ? 'border-yellow-400 bg-white/20' : 'border-transparent'}`}>
                    <div className="text-3xl font-black mb-1">{team.score}</div>
                    <div className="text-xs uppercase font-bold tracking-widest opacity-80">{team.name}</div>
                </div>
            ))}
        </div>

        <button 
            onClick={nextRound}
            className="w-full max-w-sm bg-[#00AEEF] text-white font-black py-4 rounded-xl text-lg hover:bg-[#009fdb] shadow-xl transition-transform active:scale-95 flex items-center justify-center gap-2"
        >
            <RotateCcw size={20} />
            {gameState.round < 3 ? t('roundEnd.startNext') : t('roundEnd.finishGame')}
        </button>
      </div>
    );
  }

  if (gameState.phase === GamePhase.GAME_OVER) {
    const isCooperative = gameState.mode === GameMode.COOPERATIVE;
    const winner = gameState.teams.reduce((prev, current) => (prev.score > current.score) ? prev : current);
    const isTie = !isCooperative && gameState.teams[0].score === gameState.teams[1].score;

    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-5xl font-black mb-8 text-[#00AEEF] uppercase">{t('gameOver.title')}</h1>
        
        {isCooperative ? (
          <div className="mb-12">
            <Trophy size={80} className="text-yellow-400 mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-4">{t('coop.complete')}</h2>
            <div className="bg-blue-500/20 rounded-2xl p-8 max-w-md">
              <div className="text-6xl font-black text-blue-400 mb-2">{gameState.totalTurns}</div>
              <div className="text-xl text-blue-200">{t('coop.totalTurns')}</div>
              <div className="mt-4 text-sm text-gray-400">
                {t('coop.cardsCompleted', { count: gameState.masterDeck.length })}
              </div>
            </div>
          </div>
        ) : isTie ? (
             <div className="mb-12">
                <h2 className="text-3xl font-bold">{t('gameOver.tie')}</h2>
             </div>
        ) : (
            <div className="mb-12 animate-bounce">
                <div className="text-yellow-400 text-sm font-bold uppercase tracking-widest mb-2">{t('gameOver.winner')}</div>
                <h2 className="text-6xl font-black">{winner.name}</h2>
                <div className="text-2xl mt-2 font-mono text-gray-400">{winner.score} {t('card.points').toLowerCase()}</div>
            </div>
        )}

        {!isCooperative && (
          <div className="w-full max-w-sm bg-gray-800 rounded-xl p-6 mb-8">
              <h3 className="text-gray-400 uppercase text-xs font-bold tracking-widest mb-4 border-b border-gray-700 pb-2">{t('gameOver.finalScores')}</h3>
              {gameState.teams.map(team => (
                 <div key={team.id} className="flex justify-between items-center mb-3 last:mb-0">
                     <span className="font-bold">{team.name}</span>
                     <span className="font-mono text-xl text-[#00AEEF]">{team.score}</span>
                 </div>
             ))}
          </div>
        )}

        <button 
            onClick={() => setGameState({
                phase: GamePhase.SETUP,
                round: 1,
                teams: [
                  { id: 1, name: t('team.a'), score: 0, color: 'bg-purple-600' },
                  { id: 2, name: t('team.b'), score: 0, color: 'bg-orange-500' }
                ],
                currentTeamIndex: 0,
                masterDeck: [],
                drawPile: [],
                roundGuessedCards: [],
                currentCard: null,
                turnGuessedCards: [],
                timeRemaining: TURN_DURATION_SECONDS,
                mode: undefined,
                playerCount: undefined,
                availableCards: [],
                selectedCards: [],
                cardsToSelect: 0,
                totalTurns: 0,
                currentPlayerIndex: 0
            })}
            className="text-gray-400 font-bold hover:text-white transition-colors"
        >
            {t('gameOver.playAgain')}
        </button>
      </div>
    );
  }

    return null;
  };

  return (
    <>
      <ManualModal 
        isOpen={showManual} 
        onClose={() => {
          setShowManual(false);
          setManualPage(0);
        }}
        currentPage={manualPage}
        setPage={setManualPage}
      />
      {renderContent()}
    </>
  );
}