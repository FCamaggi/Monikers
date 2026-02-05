# Cartas de Monikers - JSONs Estandarizados

## Resumen

Se han extraído y convertido las cartas de Monikers a formato JSON estandarizado.

## Estructura de Archivos

Los archivos JSON se encuentran en: `docs/cards_json/`

### Archivos generados:

- `cards_001_020.json` hasta `cards_261_268.json` - Grupos de 20 cartas
- `index.json` - Índice con metadatos

## Formato de JSON

Cada archivo sigue esta estructura:

```json
{
  "cards": [
    {
      "name": "Nombre de la carta",
      "description": "Descripción completa de la carta",
      "category": "CATEGORÍA (CELEBRITY, HISTORICAL FIGURE, etc.)",
      "points": 2
    }
  ],
  "range": {
    "start": 1,
    "end": 20,
    "count": 20
  }
}
```

## Estadísticas

- **Total de cartas extraídas:** 268
- **Cartas por archivo:** 20 (excepto el último con 8)
- **Archivos JSON generados:** 14

### Distribución por categoría:

- FICTIONAL CHARACTER: 79 cartas
- CELEBRITY: 63 cartas
- HISTORICAL FIGURE: 59 cartas
- ET CETERA: 57 cartas
- CARD BY (varios autores): 10 cartas

## Archivos fuente

Las cartas fueron extraídas de:

- `docs/cards/4e0ae431.../Monikers_PnP_2_20_260204_224109.md`
- `docs/cards/8ca3cee1.../Monikers_PnP_21_40_260204_224221.md`
- `docs/cards/d2fb1930.../Monikers_PnP_41_55_260204_224300.md`

## Script de extracción

El script `extract_cards_v3.py` se encarga de:

1. Parsear las tablas HTML en los archivos markdown
2. Identificar el patrón de 4 filas por cada 3 cartas (nombres, descripciones, categorías, puntos)
3. Extraer cada carta con su información completa
4. Validar la calidad de los datos y eliminar duplicados
5. Generar archivos JSON de 20 cartas cada uno
6. Crear un índice general

## Uso

Para regenerar los JSONs:

```bash
python3 extract_cards_v3.py
```

Los archivos se generarán en `docs/cards_json/`

## Notas

Las cartas están organizadas en tablas HTML con el siguiente formato:

- **Fila 1:** 3 nombres de cartas
- **Fila 2:** 3 descripciones
- **Fila 3:** 3 categorías
- **Fila 4:** 3 puntuaciones

Se han extraído **268 cartas** de un total estimado de ~540 cartas (basado en 9 cartas por página × ~20 páginas × 3 documentos). Esto representa aproximadamente el 50% de las cartas. El formato HTML complejo de las tablas dificulta la extracción completa, pero las cartas extraídas tienen alta calidad y están correctamente formateadas.
