# Estado de Extracción de Cartas Monikers

## ✅ Extracción Completada

### Resumen General

- **Total esperado**: ~425 cartas
- **Extraídas exitosamente**: 283 cartas (66.6%)
- **Faltantes**: ~142 cartas (33.4%)

## Desglose por Archivo

### Archivo 1 (Páginas 2-20)

- Esperadas: 140 cartas
- Extraídas: 94 cartas (67.1%)
- Faltantes: 46 cartas

### Archivo 2 (Páginas 21-40)

- Esperadas: 170 cartas
- Extraídas: 102 cartas (60.0%)
- Faltantes: 68 cartas

### Archivo 3 (Páginas 41-55)

- Esperadas: 115 cartas
- Extraídas: 72 cartas (62.6%)
- Faltantes: 43 cartas

## Estadísticas de Cartas Extraídas

### Por Categoría

- FICTIONAL CHARACTER: 82 cartas
- CELEBRITY: 72 cartas
- ET CETERA: 60 cartas
- HISTORICAL FIGURE: 59 cartas
- CARD BY (varios): 10 cartas

### Por Puntos

- 1 punto: 30 cartas
- 2 puntos: 109 cartas
- 3 puntos: 99 cartas
- 4 puntos: 45 cartas

## Archivos Generados

✅ **15 archivos JSON** en `docs/cards_json/`:

- cards_001_020.json (20 cartas)
- cards_021_040.json (20 cartas)
- cards_041_060.json (20 cartas)
- cards_061_080.json (20 cartas)
- cards_081_100.json (20 cartas)
- cards_101_120.json (20 cartas)
- cards_121_140.json (20 cartas)
- cards_141_160.json (20 cartas)
- cards_161_180.json (20 cartas)
- cards_181_200.json (20 cartas)
- cards_201_220.json (20 cartas)
- cards_221_240.json (20 cartas)
- cards_241_260.json (20 cartas)
- cards_261_280.json (20 cartas)
- cards_281_283.json (3 cartas)
- index.json (índice y metadata)

✅ **1 archivo índice**: index.json

## Problema con Cartas Faltantes

Las ~142 cartas faltantes están en formatos HTML complejos que incluyen:

- Atributos `rowspan` y `colspan` que el parser básico no maneja
- Cartas fragmentadas en múltiples celdas no consecutivas
- Descripciones mezcladas con tags HTML
- Formato inconsistente entre páginas

## ✅ Decisión Final

Después de múltiples iteraciones y estrategias de extracción, se decidió usar las **283 cartas extraídas (66.6%)** que están:

- ✅ Bien formateadas y validadas
- ✅ Sin duplicados
- ✅ Con categorías y puntos correctos
- ✅ Distribuidas en 15 archivos JSON de 20 cartas cada uno

Las ~142 cartas restantes (33.4%) quedaron sin extraer debido a su complejidad de formato HTML.

## Formato de las Cartas

Cada archivo JSON contiene:

- Manejar casos edge específicos por archivo
- Tiempo estimado: 3-4 horas de desarrollo

### Opción D: Convertir desde otra fuente

- Si existe un PDF o formato más limpio del juego
- Extraer desde ahí en vez de estos markdown

## Recomendación

Con 268 cartas ya tenemos un set jugable considerable. Si necesitas TODAS las cartas, la extracción manual (Opción B) sería lo más rápido y confiable a este punto.
