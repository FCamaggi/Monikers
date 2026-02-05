import { MonikersCard, CardCategory } from './types';
import { loadAllCards } from './utils/loadCards';

export const ROUND_RULES = {
  1: {
    title: "Say Anything",
    description: "You can use any words, sounds, or gestures except the name itself. Reading the clue text is allowed."
  },
  2: {
    title: "One Word",
    description: "Use only one word. It can be anything except the name itself. You can repeat the word, but no sounds or gestures."
  },
  3: {
    title: "Charades",
    description: "Just charades. No words. Sound effects are OK—within reason."
  }
};

export const TURN_DURATION_SECONDS = 60;

// Configuración según el manual oficial (DEAL duplicado para más opciones)
export const PLAYER_CONFIG = {
  3: { deal: 30, pick: 8, addRandom: 6, mode: 'COOPERATIVE' },
  4: { deal: 24, pick: 6, addRandom: 6, mode: 'COOPERATIVE' },
  5: { deal: 20, pick: 5, addRandom: 5, mode: 'COOPERATIVE' },
  6: { deal: 28, pick: 7, addRandom: 0, mode: 'COMPETITIVE' },
  7: { deal: 24, pick: 6, addRandom: 0, mode: 'COMPETITIVE' },
  8: { deal: 20, pick: 5, addRandom: 0, mode: 'COMPETITIVE' },
  9: { deal: 20, pick: 5, addRandom: 0, mode: 'COMPETITIVE' },
  10: { deal: 16, pick: 4, addRandom: 0, mode: 'COMPETITIVE' },
} as const;

export type PlayerCount = keyof typeof PLAYER_CONFIG;

// Cargar todas las 283 cartas desde los archivos JSON
export const ALL_CARDS = loadAllCards();

// DEPRECATED: Solo para referencia, ahora usamos ALL_CARDS
// Transcribed from the provided screenshots
export const PRESET_DECK_OLD: MonikersCard[] = [
  {
    id: 'doge',
    name: 'Doge',
    description: 'An Internet meme that shows a Shiba Inu surrounded by colorful Comic Sans text that describes its inner monologue, such as "Wow," "Concern," and "so scare."',
    category: CardCategory.CELEBRITY,
    points: 3
  },
  {
    id: 'russian-nesting-doll',
    name: 'A Russian Nesting Doll',
    description: 'A set of colorful wooden figurines that decrease in size and are placed inside of one another. Associated with a former Communist nation.',
    category: CardCategory.ET_CETERA,
    points: 2
  },
  {
    id: 'rick-santorum',
    name: 'Rick Santorum',
    description: 'The former Republican Senator whose name, in retribution for comparing homosexuality to bestiality, was redefined by Dan Savage as "the frothy mixture of lube and fecal matter".',
    category: CardCategory.CELEBRITY,
    points: 2
  },
  {
    id: 'blacula',
    name: 'Blacula',
    description: 'The title character from a horror film about an 18th century African prince turned vampire. Locked in a coffin for two centuries by Count Dracula, the box was purchased by decorators in 70s LA.',
    category: CardCategory.FICTIONAL_CHARACTER,
    points: 4
  },
  {
    id: 'georgia-okeeffe',
    name: 'Georgia O\'Keeffe',
    description: 'An American modernist painter whose work was inspired by the New Mexico landscape. Famous for the uncanny resemblance of many of her painted flowers to female genitalia.',
    category: CardCategory.HISTORICAL_FIGURE,
    points: 2
  },
  {
    id: 'ebola',
    name: 'Ebola',
    description: 'A virus that causes hemorrhagic fever, typically acquired by contact with an infected monkey, fruit bat, or person. Its most severe symptoms can include bleeding from the eyes.',
    category: CardCategory.ET_CETERA,
    points: 2
  },
  {
    id: 'furry',
    name: 'A Furry',
    description: 'A person who wears a full body animal suit, often for conventions, roleplaying, or personal recreation. Their use in sexual activity is a controversial topic in the community.',
    category: CardCategory.ET_CETERA,
    points: 3
  },
  {
    id: 'gallagher',
    name: 'Gallagher',
    description: 'A prop comic famous for smashing watermelons with his trademark Sledge-O-Matic. He once sued his brother for touring under the comedian\'s name.',
    category: CardCategory.CELEBRITY,
    points: 1
  },
  {
    id: 'kobayashi',
    name: 'Kobayashi',
    description: 'A Japanese competitive eater who shocked the world in 2001 by eating 50 hot dogs and buns in 12 minutes. He once lost a hot dog eating contest to a 1089 lb. Kodiak bear.',
    category: CardCategory.CELEBRITY,
    points: 2
  },
  {
    id: 'flying-spaghetti-monster',
    name: 'Flying Spaghetti Monster',
    description: 'The deity of Pastafarianism, a parody religion opposing intelligent design. A contemporary version of Russell\'s teapot, it is portrayed as a clump of pasta and meatballs.',
    category: CardCategory.FICTIONAL_CHARACTER,
    points: 3
  },
  {
    id: 'sylvia-plath',
    name: 'Sylvia Plath',
    description: 'Poet, author, and wife of Ted Hughes, who was known for her confessional style of poetry as well as her novel The Bell Jar. She stuck her head into an unlit oven.',
    category: CardCategory.HISTORICAL_FIGURE,
    points: 2
  },
  {
    id: 'unabomber',
    name: 'The Unabomber (Ted Kaczynski)',
    description: 'A terrorist math professor, who sent explosive packages through the mail. When Penthouse offered to publish his manifesto, he asked to reserve the right to plant one more bomb.',
    category: CardCategory.CELEBRITY,
    points: 2
  },
  {
    id: 'pablo-escobar',
    name: 'Pablo Escobar',
    description: 'A Colombian drug lord and "King of Cocaine," who at his peak trafficked 15 tons of the drug into the US per year. He was killed by authorities in a firefight in Medellin.',
    category: CardCategory.HISTORICAL_FIGURE,
    points: 3
  },
  {
    id: 'chupacabra',
    name: 'El Chupacabra',
    description: 'Literally "goat sucker," this legendary American cryptid is often described as a reptile-like creature that attacks and drinks the blood of sheep and other livestock.',
    category: CardCategory.ET_CETERA,
    points: 4
  },
  {
    id: 'bill-cosby',
    name: 'Bill Cosby',
    description: 'One of most famous comedians of all time. Created Fat Albert and played Cliff Huxtable. Known for wearing sweaters, eating "Puddin\' Pops," and blaming rap for poor parenting.',
    category: CardCategory.CELEBRITY,
    points: 1
  },
  {
    id: 'narwhal',
    name: 'A Narwhal',
    description: 'An Arctic whale with a large protruding tusk, which is actually an elongated canine tooth. Its name translates to "corpse whale" from the Old Norse.',
    category: CardCategory.ET_CETERA,
    points: 4
  },
  {
    id: 'hitlers-brain',
    name: 'Hitler\'s Brain',
    description: 'A trope first featured in a 60s sci-fi film, where Nazi scientists remove this organ from the Führer\'s head and hide it in the fictional South American country of Mandoras.',
    category: CardCategory.HISTORICAL_FIGURE,
    points: 2
  },
  {
    id: 'velociraptor',
    name: 'A Velociraptor',
    description: 'A bipedal, feathered carnivore from the Cretaceous Period. It is one of the most well-known dinosaurs due to its prominent role in the 1993 film Jurassic Park.',
    category: 'CARD BY PATRICK KLEPEK',
    points: 2
  },
  {
    id: 'shirtless-putin',
    name: 'Shirtless Vladimir Putin',
    description: 'Former KGB officer and current President of Russia. Under his rule, Russia has grown increasingly undemocratic. He cultivates a rugged image by being shown riding horses half-dressed.',
    category: CardCategory.CELEBRITY,
    points: 3
  },
  {
    id: 'pied-piper',
    name: 'The Pied Piper',
    description: 'A character in medieval folklore that led a group of children away from the town of Hamelin with a magic flute because the town refused to pay him for rat removal.',
    category: CardCategory.FICTIONAL_CHARACTER,
    points: 2
  }
];