import { MonikersCard } from '../types';

// Importar todos los archivos de cartas JSON en ESPAÑOL
import cards001020 from '../docs/cards_json/es/cards_001_020.json';
import cards021040 from '../docs/cards_json/es/cards_021_040.json';
import cards041060 from '../docs/cards_json/es/cards_041_060.json';
import cards061080 from '../docs/cards_json/es/cards_061_080.json';
import cards081100 from '../docs/cards_json/es/cards_081_100.json';
import cards101120 from '../docs/cards_json/es/cards_101_120.json';
import cards121140 from '../docs/cards_json/es/cards_121_140.json';
import cards141160 from '../docs/cards_json/es/cards_141_160.json';
import cards161180 from '../docs/cards_json/es/cards_161_180.json';
import cards181200 from '../docs/cards_json/es/cards_181_200.json';
import cards201220 from '../docs/cards_json/es/cards_201_220.json';
import cards221240 from '../docs/cards_json/es/cards_221_240.json';
import cards241260 from '../docs/cards_json/es/cards_241_260.json';
import cards261280 from '../docs/cards_json/es/cards_261_280.json';
import cards281283 from '../docs/cards_json/es/cards_281_283.json';
// Cartas latinoamericanas adicionales
import cardsLatam from '../docs/cards_json/es/cards_284_303_latam.json';
// Cartas traducidas del alemán
import cardsGerman1 from '../docs/cards_json/es/cards_304_383_german.json';
import cardsGerman2 from '../docs/cards_json/es/cards_384_433_german2.json';

interface CardFile {
  cards: Array<{
    name: string;
    description: string;
    category: string;
    points: number;
  }>;
}

/**
 * Carga todas las cartas desde los archivos JSON y las convierte al formato de la app
 */
export function loadAllCards(): MonikersCard[] {
  const cardFiles: CardFile[] = [
    cards001020,
    cards021040,
    cards041060,
    cards061080,
    cards081100,
    cards101120,
    cards121140,
    cards141160,
    cards161180,
    cards181200,
    cards201220,
    cards221240,
    cards241260,
    cards261280,
    cards281283,
    cardsLatam, // 20 cartas latinoamericanas adicionales
    cardsGerman1, // 80 cartas traducidas del alemán (parte 1)
    cardsGerman2, // 50 cartas traducidas del alemán (parte 2)
  ];

  const allCards: MonikersCard[] = [];
  let cardIdCounter = 1;

  for (const file of cardFiles) {
    for (const card of file.cards) {
      allCards.push({
        id: `card-${cardIdCounter.toString().padStart(3, '0')}`,
        name: card.name,
        description: card.description,
        category: card.category,
        points: card.points,
      });
      cardIdCounter++;
    }
  }

  return allCards;
}

/**
 * Obtiene estadísticas del mazo de cartas
 */
export function getCardStats(cards: MonikersCard[]) {
  const stats = {
    total: cards.length,
    byCategory: {} as Record<string, number>,
    byPoints: {} as Record<number, number>,
  };

  cards.forEach(card => {
    // Por categoría
    stats.byCategory[card.category] = (stats.byCategory[card.category] || 0) + 1;
    
    // Por puntos
    stats.byPoints[card.points] = (stats.byPoints[card.points] || 0) + 1;
  });

  return stats;
}

/**
 * Filtra cartas por categoría
 */
export function filterByCategory(cards: MonikersCard[], category: string): MonikersCard[] {
  return cards.filter(card => card.category === category);
}

/**
 * Filtra cartas por puntos
 */
export function filterByPoints(cards: MonikersCard[], points: number): MonikersCard[] {
  return cards.filter(card => card.points === points);
}

/**
 * Obtiene una muestra aleatoria de cartas
 */
export function getRandomCards(cards: MonikersCard[], count: number): MonikersCard[] {
  const shuffled = [...cards].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, cards.length));
}
