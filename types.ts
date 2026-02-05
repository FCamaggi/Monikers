export enum CardCategory {
  CELEBRITY = 'CELEBRITY',
  FICTIONAL_CHARACTER = 'FICTIONAL CHARACTER',
  HISTORICAL_FIGURE = 'HISTORICAL FIGURE',
  ET_CETERA = 'ET CETERA',
  CARD_BY = 'CARD BY AUTHOR'
}

export interface MonikersCard {
  id: string;
  name: string;
  description: string;
  category: string; // Using string to allow for custom "Card By..." categories
  points: number;
}

export interface Team {
  id: number;
  name: string;
  score: number;
  color: string;
}

export enum GamePhase {
  LOBBY = 'LOBBY',
  SETUP = 'SETUP', // Configuración de jugadores
  PLAYER_NAMES = 'PLAYER_NAMES', // Ingresar nombres de jugadores
  CARD_SELECTION = 'CARD_SELECTION', // Selección de cartas
  ROUND_INTRO = 'ROUND_INTRO',
  TURN_READY = 'TURN_READY',
  TURN_ACTIVE = 'TURN_ACTIVE',
  TURN_SUMMARY = 'TURN_SUMMARY',
  ROUND_SUMMARY = 'ROUND_SUMMARY',
  GAME_OVER = 'GAME_OVER'
}

export enum GameMode {
  COMPETITIVE = 'COMPETITIVE', // 2 equipos
  COOPERATIVE = 'COOPERATIVE' // 1 equipo (3-5 jugadores)
}

export interface GameState {
  phase: GamePhase;
  round: number; // 1, 2, or 3
  teams: Team[];
  currentTeamIndex: number; // 0 or 1
  
  // Configuración del juego
  mode?: GameMode;
  playerCount?: number;
  playerNames?: string[]; // Nombres de los jugadores
  
  // Deck Management
  masterDeck: MonikersCard[]; // All cards in play
  drawPile: MonikersCard[]; // Cards left to guess in this round
  roundGuessedCards: MonikersCard[]; // Cards guessed across the whole round (for reshuffling)
  teamRoundCards?: MonikersCard[][]; // Cards won by each team THIS ROUND [team0Cards, team1Cards]
  
  // Card Selection
  availableCards?: MonikersCard[]; // Cards to choose from
  selectedCards?: MonikersCard[]; // Cards selected by players
  cardsToSelect?: number; // How many cards to select
  currentPlayerSelecting?: number; // Current player selecting cards (1 to playerCount)
  allSelectedCards?: MonikersCard[]; // All cards selected by all players so far
  dealtCards?: MonikersCard[]; // Cards that have been dealt (to avoid showing them again)
  
  // Turn State
  currentCard: MonikersCard | null;
  turnGuessedCards: MonikersCard[]; // Cards guessed in just this turn (for reporting)
  timeRemaining: number;
  
  // Cooperative Mode Stats
  totalTurns?: number; // Total turns taken (for cooperative scoring)
  currentPlayerIndex?: number; // Which player is currently giving clues (0 to playerCount-1)
}