# Cambios: Implementación de Selección de Cartas

**Fecha**: 2025-01-29
**Estado**: ✅ Completado y funcionando

## Resumen

Se implementaron las fases de configuración y selección de cartas siguiendo las reglas oficiales del manual de Monikers. Esto permite que los jugadores:

1. Seleccionen el número de jugadores (3-10)
2. Vean qué modo de juego corresponde (Cooperativo 3-5, Competitivo 6-10)
3. Elijan las cartas que quieren jugar de un pool más grande
4. Filtren cartas que no conocen o no quieren usar

## Motivación

Como mencionó el usuario: **"hay cartas que realmente puede que no se entiendan o no se quieran hacer"**. 

La selección de cartas es esencial para:
- Personalizar la experiencia según el grupo
- Filtrar contenido muy específico de una región
- Evitar personajes/referencias desconocidos
- Hacer el juego más accesible y divertido

## Cambios Técnicos

### 1. Tipos Actualizados (`types.ts`)

#### Nuevos GamePhases:
```typescript
enum GamePhase {
  SETUP,           // ← NUEVO: Selección de número de jugadores
  CARD_SELECTION,  // ← NUEVO: Elección de cartas
  LOBBY,
  ROUND_INTRO,
  TURN_READY,
  TURN_ACTIVE,
  TURN_SUMMARY,
  ROUND_SUMMARY,
  GAME_OVER
}
```

#### Nuevo GameMode enum:
```typescript
enum GameMode {
  COOPERATIVE = 'COOPERATIVE',  // 3-5 jugadores
  COMPETITIVE = 'COMPETITIVE'   // 6-10 jugadores
}
```

#### GameState extendido:
```typescript
interface GameState {
  // ... campos existentes
  mode?: GameMode;              // ← NUEVO
  playerCount?: PlayerCount;     // ← NUEVO
  availableCards?: MonikersCard[]; // ← NUEVO: Pool de cartas para elegir
  selectedCards?: MonikersCard[];  // ← NUEVO: Cartas seleccionadas
  cardsToSelect?: number;          // ← NUEVO: Cuántas cartas deben elegirse
}
```

### 2. Configuración Oficial (`constants.ts`)

Se agregó `PLAYER_CONFIG` con las reglas exactas del manual:

```typescript
export const PLAYER_CONFIG = {
  3: { mode: GameMode.COOPERATIVE, deal: 14, pick: 7, addRandom: 21 },
  4: { mode: GameMode.COOPERATIVE, deal: 14, pick: 7, addRandom: 14 },
  5: { mode: GameMode.COOPERATIVE, deal: 10, pick: 5, addRandom: 15 },
  6: { mode: GameMode.COMPETITIVE, deal: 14, pick: 7, addRandom: 0 },
  7: { mode: GameMode.COMPETITIVE, deal: 12, pick: 6, addRandom: 0 },
  8: { mode: GameMode.COMPETITIVE, deal: 10, pick: 5, addRandom: 0 },
  9: { mode: GameMode.COMPETITIVE, deal: 10, pick: 5, addRandom: 5 },
  10: { mode: GameMode.COMPETITIVE, deal: 8, pick: 4, addRandom: 0 }
}
```

**Interpretación**:
- `deal`: Cartas que se muestran a cada jugador
- `pick`: Cartas que cada jugador debe elegir
- `addRandom`: Cartas aleatorias adicionales (para balanceo)
- `mode`: Cooperativo (todos contra reloj) o Competitivo (2 equipos)

**Total de cartas en juego** = (pick × playerCount) + addRandom

Ejemplos:
- 6 jugadores: (7 × 6) + 0 = **42 cartas**
- 8 jugadores: (5 × 8) + 0 = **40 cartas**
- 4 jugadores coop: (7 × 4) + 14 = **42 cartas**

### 3. Nuevas Funciones de Juego (`App.tsx`)

#### `selectPlayerCount(count: PlayerCount)`
- Obtiene configuración del manual según número de jugadores
- Baraja y "reparte" cartas disponibles para selección
- Calcula cuántas cartas totales se necesitan
- Cambia a fase CARD_SELECTION

#### `toggleCardSelection(card: MonikersCard)`
- Selecciona/deselecciona una carta
- Respeta el límite de cartas totales
- Actualiza el estado visual inmediatamente

#### `startGameWithSelectedCards()`
- Usa las cartas seleccionadas como mazo maestro
- Inicia el juego normal (ROUND_INTRO)
- Resetea puntajes y prepara primera ronda

### 4. Nuevas Pantallas UI

#### Pantalla SETUP:
- Grid de botones para 3-10 jugadores
- Código de color: Azul (Cooperativo) / Blanco (Competitivo)
- Muestra modo de juego según cantidad
- Información sobre configuración de cartas

#### Pantalla CARD_SELECTION:
- Grid responsive de cartas (1-4 columnas según tamaño pantalla)
- Cada carta muestra: nombre, descripción, categoría, puntos
- Barra de progreso visual: cartas seleccionadas / requeridas
- Estado visual claro: Azul = seleccionada, Transparente = disponible
- Check icon en cartas seleccionadas
- Botón "Empezar Juego" habilitado solo cuando se alcanza el número correcto
- Contador: "Faltan X cartas" hasta completar

### 5. Traducciones (`i18n/translations.ts`)

Se agregaron ~15 nuevas claves de traducción en español e inglés:

**Español**:
```typescript
"setup.title": "Configuración del Juego"
"setup.selectPlayers": "¿Cuántos jugadores?"
"setup.players": "Jugadores"
"setup.mode": "Modo"
"game.cooperative": "Cooperativo"
"game.competitive": "Competitivo"
"selection.title": "Selecciona tus Cartas"
"selection.subtitle": "Elige las cartas que te parezcan divertidas o que conozcas"
"selection.selected": "Seleccionadas"
"selection.needMore": "Faltan {{count}} cartas"
"selection.start": "Empezar Juego"
```

**Inglés**: Equivalentes en inglés para todas las claves.

## Flujo del Usuario

### Antes (Versión Original):
```
LOBBY → [Elegir 20/40/60 cartas] → ROUND_INTRO → ...
```
❌ **Problemas**: 
- Números arbitrarios de cartas
- No se considera número de jugadores
- No se pueden filtrar cartas problemáticas

### Ahora (Con Selección):
```
SETUP → [Elegir jugadores 3-10] 
  ↓
CARD_SELECTION → [Ver y elegir cartas específicas]
  ↓
ROUND_INTRO → [Juego normal con cartas elegidas]
```
✅ **Ventajas**:
- Configuración oficial según manual
- Modo cooperativo/competitivo automático
- Jugadores filtran cartas desconocidas
- Experiencia personalizada por grupo

## Ejemplo de Uso

### Escenario: 6 jugadores en Buenos Aires

1. **SETUP**: Seleccionan "6 jugadores"
   - Sistema detecta: Modo Competitivo
   - Configuración: deal 14, pick 7
   - Se muestran 84 cartas (14 por jugador)

2. **CARD_SELECTION**: 
   - Los jugadores ven las 84 cartas
   - Deben seleccionar 42 cartas en total
   - Filtran:
     - ❌ "LeBron James" (poco conocido en Argentina)
     - ❌ "Ted Cruz" (política específica de EE.UU.)
     - ✅ "Lionel Messi" (muy conocido)
     - ✅ "Maradona" (muy conocido)
   - Barra de progreso: 42/42 ✅

3. **ROUND_INTRO**: 
   - Comienza el juego con las 42 cartas seleccionadas
   - 3 rondas usando siempre esas mismas cartas

## Testing y Validación

### Build Status:
```bash
$ npm run build
✓ 1758 modules transformed.
dist/index.html                  1.34 kB
dist/assets/index-Dcvn34YK.js  372.39 kB │ gzip: 123.56 kB
✓ built in 3.09s
```
✅ **Build exitoso sin errores**

### Dev Server:
```bash
$ npm run dev
VITE v6.4.1  ready in 168 ms
➜  Local:   http://localhost:3000/
```
✅ **Servidor corriendo correctamente**

### TypeScript:
- ✅ Sin errores de tipos
- ✅ Todas las interfaces actualizadas
- ✅ Enums extendidos correctamente

### Traducciones:
- ✅ Español completo
- ✅ Inglés completo
- ✅ i18next configurado

## Próximos Pasos

### Implementación Inmediata Pendiente:
1. **Modo Cooperativo**: Lógica especial para 3-5 jugadores
   - Sin equipos, todos juegan juntos
   - Puntuación por tiempo/cartas completadas
   - Mensajes específicos de victoria cooperativa

### Contenido a Largo Plazo:
2. **Traducción de Cartas**: 263 cartas pendientes (actualmente 20/283)
3. **Localización Cultural**: Adaptar ~40 cartas muy americanas
4. **Cartas Latinoamericanas**: Crear 30-50 cartas específicas de LATAM

## Conclusión

✅ **La selección de cartas está completamente implementada y funcional.**

El juego ahora permite personalizar la experiencia según:
- Número de jugadores (3-10)
- Modo cooperativo o competitivo (automático)
- Cartas conocidas y preferidas por el grupo

Esto resuelve el problema principal identificado por el usuario: permitir que los jugadores filtren cartas que no conocen o no quieren usar.

---

**Nota**: El antiguo flujo LOBBY con opciones "Rápido/Estándar/Largo" se mantiene como fallback, pero el flujo principal ahora es SETUP → CARD_SELECTION.
