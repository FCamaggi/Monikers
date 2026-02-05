# 🎲 ANÁLISIS DE MECÁNICAS - Monikers vs Implementación

## ❌ PROBLEMAS CRÍTICOS ENCONTRADOS

### 1. **FALTA LA FASE DE SELECCIÓN DE CARTAS** 🔴

**Manual Oficial:**
> "Start off by dealing some cards to everyone playing. You'll all be picking the ones you like to add to the single deck that you're all going to play with."

**Tabla del manual:**
| JUGADORES | DEAL (Repartir) | PICK (Elegir) | Total Cartas |
|-----------|-----------------|---------------|--------------|
| 6 players | 14 cartas       | 7 cartas      | 42 cartas    |
| 7 players | 12 cartas       | 6 cartas      | 42 cartas    |
| 8 players | 10 cartas       | 5 cartas      | 40 cartas    |
| 9 players | 10 cartas       | 5 cartas      | 45 cartas    |
| 10+ players | 8 cartas      | 4 cartas      | 40+ cartas   |

**Nuestra implementación actual:**
```typescript
// ❌ INCORRECTO: Solo seleccionamos aleatoriamente X cartas
const startGame = (cardCount: number = 20) => {
  const deck = shuffle(ALL_CARDS).slice(0, cardCount);
  // ...
}
```

**Problema:** No hay fase de selección. Los jugadores deben ver opciones y elegir las cartas que les parezcan divertidas/interesantes.

---

### 2. **OPCIONES DE JUEGO INCORRECTAS** 🔴

**Nuestra implementación:**
- ❌ "Juego Rápido (20 Cartas)"
- ❌ "Juego Estándar (40 Cartas)"
- ❌ "Juego Largo (60 Cartas)"

**Manual oficial:**
- ✅ El número de cartas depende del **número de jugadores**
- ✅ Cada jugador elige cartas de un pool
- ✅ NO hay "modo rápido/estándar/largo"

**Debería ser:**
- "4 Jugadores" → Cada uno elige 6 de 12 → 24 cartas total
- "6 Jugadores" → Cada uno elige 7 de 14 → 42 cartas total
- "8 Jugadores" → Cada uno elige 5 de 10 → 40 cartas total

---

### 3. **MODO COOPERATIVO FALTANTE** 🟡

**Manual oficial:**
> "If you have 5 or fewer players, or want a less competitive game, play cooperatively without teams!"

**Tabla Co-op:**
| JUGADORES | DEAL | PICK | ADD RANDOM | Total |
|-----------|------|------|------------|-------|
| 3 players | 15   | 8    | 6 randoms  | 30    |
| 4 players | 12   | 6    | 6 randoms  | 30    |
| 5 players | 10   | 5    | 5 randoms  | 30    |

**Co-op objetivo:**
- Terminar el juego en el menor número de **turnos** (no rondas)
- Sin equipos, todos cooperan
- Scoring especial con mensajes divertidos

**Nuestra implementación:**
- ❌ No existe modo cooperativo
- ❌ Solo modo competitivo con 2 equipos

---

## ✅ MECÁNICAS CORRECTAMENTE IMPLEMENTADAS

### 1. **Estructura de 3 Rondas** ✅

**Manual:**
- Round 1: Say Anything
- Round 2: One Word
- Round 3: Charades

**Nuestra implementación:**
```typescript
export const ROUND_RULES = {
  1: { title: "Di lo que Sea", ... },
  2: { title: "Una Palabra", ... },
  3: { title: "Mímica", ... }
}
```
✅ **CORRECTO**

---

### 2. **Timer de 60 Segundos** ✅

**Manual:**
> "YOU HAVE 60 SECONDS TO GET YOUR TEAM TO GUESS AS MANY NAMES AS THEY CAN"

**Nuestra implementación:**
```typescript
export const TURN_DURATION_SECONDS = 60;
```
✅ **CORRECTO**

---

### 3. **Las Mismas Cartas en Cada Ronda** ✅

**Manual:**
> "After you finish the entire deck, you'll play a second round with the same cards."

**Nuestra implementación:**
```typescript
const nextRound = () => {
  // ...
  drawPile: shuffle([...prev.masterDeck]), // Restaura todas las cartas
  // ...
}
```
✅ **CORRECTO**

---

### 4. **Sistema de Skip** ✅

**Manual:**
> "When you skip a card, just put it on the bottom of the deck."

**Nuestra implementación:**
```typescript
const handleSkip = () => {
  const skippedCard = prev.currentCard;
  const remaining = prev.drawPile.slice(1);
  const newDrawPile = [...remaining, skippedCard]; // Va al fondo
}
```
✅ **CORRECTO**

---

### 5. **Fin de Ronda** ✅

**Manual:**
> "A round ends when ALL cards from the deck have been guessed correctly."

**Nuestra implementación:**
```typescript
const isRoundOver = prev.drawPile.length === 0 && !prev.currentCard;
```
✅ **CORRECTO**

---

### 6. **Equipo con Menor Score Empieza** ✅

**Manual:**
> "The team with the lowest score starts the next round"

**Nuestra implementación:**
```typescript
currentTeamIndex: prev.teams[0].score < prev.teams[1].score ? 0 : 1
```
✅ **CORRECTO**

---

## ⚠️ MECÁNICAS FALTANTES O INCOMPLETAS

### 1. **Regla "Pity Turn"** 🟡

**Manual:**
> "If someone ended the round with an extremely short turn, like if there were only one or two cards left in the deck, give them a full turn the next round."

**Nuestra implementación:**
- ❌ NO implementado

---

### 2. **Alternancia de Clue Givers** 🟡

**Manual:**
> "Each person should take a turn giving clues to their team before anyone repeats being the clue giver."

**Nuestra implementación:**
- ❌ NO hay tracking de quién dio pistas
- ❌ No hay rotación forzada de jugadores

---

### 3. **Regla "Close Enough"** 🟢

**Manual:**
> "If someone says part of the name, or gets part of the name wrong, that counts."
> Examples:
> - BLOWDART = BLOWGUN ✅
> - T-REX = TYRANNOSAURUS ✅
> - VAMPIRE ≠ DRACULA ❌

**Nuestra implementación:**
- ℹ️ No verificamos esto automáticamente (es responsabilidad de los jugadores)
- ℹ️ Esto es correcto para una implementación digital simple

---

### 4. **Cheating Rule** 🟢

**Manual:**
> "If you accidentally cheat while you're giving a clue, like by saying part of the name, just put that card aside and add it back in for the other team's next turn."

**Nuestra implementación:**
- ℹ️ No implementado (requeriría detección manual)
- ℹ️ Aceptable para versión digital

---

### 5. **Rondas Bonus (Tie-Breaker)** 🟡

**Manual ofrece 6 rondas locas opcionales:**
1. Charades bajo una sábana
2. Dos jugadores alternando palabras
3. Solo cabeza visible detrás de objeto
4. Solo brazos visibles
5. Otro jugador posa al que da pistas
6. Reverse charades

**Nuestra implementación:**
- ❌ NO implementado

---

## 📊 RESUMEN DE CONFORMIDAD

| Aspecto | Estado | Prioridad |
|---------|--------|-----------|
| ✅ 3 Rondas con reglas correctas | CORRECTO | - |
| ✅ Timer 60 segundos | CORRECTO | - |
| ✅ Mismas cartas cada ronda | CORRECTO | - |
| ✅ Sistema skip | CORRECTO | - |
| ✅ Fin de ronda correcto | CORRECTO | - |
| ✅ Menor score empieza | CORRECTO | - |
| ❌ Fase selección de cartas | FALTA | 🔴 CRÍTICA |
| ❌ Opciones según jugadores | INCORRECTA | 🔴 CRÍTICA |
| ❌ Modo cooperativo | FALTA | 🟡 MEDIA |
| ❌ Pity Turn | FALTA | 🟢 BAJA |
| ❌ Rotación clue givers | FALTA | 🟢 BAJA |
| ❌ Rondas bonus | FALTA | 🟢 BAJA |

---

## 🎯 PLAN DE CORRECCIÓN

### FASE 1: Crítico (Debe hacerse) 🔴

#### 1. Implementar Selección de Cartas

**Nueva fase del juego:**
```
LOBBY 
  ↓
SETUP (NUEVO) ← Aquí los "jugadores" eligen cartas
  ↓
ROUND_INTRO
  ↓
...
```

**Pasos:**
1. Preguntar número de jugadores (4-10+)
2. Según tabla, mostrar X cartas a cada "jugador"
3. Cada "jugador" elige Y cartas
4. Formar el mazo con las elegidas

**Alternativa simple (digital):**
- Preguntar número de jugadores
- Automáticamente seleccionar el número correcto de cartas aleatorias
- Mostrar las cartas seleccionadas antes de empezar

#### 2. Ajustar Opciones de Inicio

**Reemplazar:**
```typescript
// ❌ ANTES
<button onClick={() => startGame(20)}>
  Juego Rápido (20 Cartas)
</button>
```

**Por:**
```typescript
// ✅ DESPUÉS
<button onClick={() => startGame(6)}>
  6 Jugadores (42 Cartas)
</button>
<button onClick={() => startGame(8)}>
  8 Jugadores (40 Cartas)
</button>
```

---

### FASE 2: Importante (Recomendado) 🟡

#### 3. Implementar Modo Cooperativo

**Para 3-5 jugadores:**
- Un solo "equipo"
- Objetivo: Terminar en menos turnos posible
- Scoring especial con mensajes divertidos
- 25-30 cartas totales

---

### FASE 3: Deseable (Nice to have) 🟢

#### 4. Pity Turn
- Detectar cuando alguien terminó ronda con 1-2 cartas
- Dar turno completo en siguiente ronda

#### 5. Rotación de Clue Givers
- Tracking de quién dio pistas
- Sugerencia de quién debe dar pistas siguiente

#### 6. Rondas Bonus
- Implementar las 6 rondas locas opcionales

---

## 🚨 RECOMENDACIÓN INMEDIATA

**ANTES de continuar con traducción de cartas, deberíamos:**

1. ✅ **Arreglar el sistema de inicio del juego**
   - Eliminar "Rápido/Estándar/Largo"
   - Agregar selección por número de jugadores
   - Implementar lógica de Deal/Pick (o simulación)

2. ✅ **Agregar modo cooperativo**
   - Para 3-5 jugadores
   - Scoring diferente

3. ✅ **Actualizar documentación**
   - Reflejar las reglas correctas del manual

**Razón:** No tiene sentido traducir 283 cartas si las mecánicas del juego no siguen el manual oficial. Los jugadores esperarán las reglas correctas.

---

## 💡 PROPUESTA DE IMPLEMENTACIÓN SIMPLIFICADA

Para una versión digital, podemos simplificar sin perder la esencia:

### Opción A: Fiel al Manual (Complejo)
- Simular múltiples "jugadores" virtuales
- Cada uno elige de un pool
- Más auténtico pero más código

### Opción B: Simplificado (Recomendado)
- Preguntar: "¿Cuántos jugadores?" (4, 6, 8, 10)
- Automáticamente usar el número correcto de cartas según tabla
- Selección aleatoria pero respetando cantidades oficiales
- Agregar opción "Modo Cooperativo" para 3-5

### Opción C: Híbrido
- Modo estándar: Selección automática según jugadores
- Modo avanzado: Permitir elegir cartas manualmente
- Modo cooperativo: 3-5 jugadores, reglas especiales

---

## 🎮 FLUJO PROPUESTO (Opción B)

```
LOBBY
  ↓
Pregunta: "¿Cuántos jugadores?"
  → 3-5: "Modo Cooperativo disponible!"
  → 6-10: "Modo Competitivo (2 equipos)"
  ↓
Mostrar: "Se jugarán con X cartas" (según tabla)
  ↓
Botón: "Seleccionar Cartas y Empezar"
  ↓
(Opcional) Mostrar cartas seleccionadas
  ↓
ROUND_INTRO
  ↓
...
```

---

## ✅ DECISIÓN REQUERIDA

¿Qué opción prefieres?

**A)** Implementación fiel al manual (más complejo)  
**B)** Simplificada respetando cantidades (recomendado)  
**C)** Híbrida con opciones avanzadas  
**D)** Mantener actual y solo documentar diferencias  

**Mi recomendación:** Opción B + Modo Cooperativo

---

*Análisis realizado: 4 de febrero de 2026*
