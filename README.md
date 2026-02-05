<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Monikers - AI Studio App

This contains everything you need to run your Monikers game app locally.

View your app in AI Studio: https://ai.studio/apps/drive/16u8HLr2QdZJsxCCNm-5-qNQSbOifsU3_

## 🎴 Cartas del Juego

El juego incluye **283 cartas** extraídas del juego Monikers, organizadas en formato JSON:

- **Ubicación**: `docs/cards_json/`
- **Archivos**: 15 JSONs con 20 cartas cada uno
- **Formato**: `{name, description, category, points}`
- **Categorías**: FICTIONAL CHARACTER (82), CELEBRITY (72), ET CETERA (60), HISTORICAL FIGURE (59), CARD BY (10)

Ver [EXTRACTION_STATUS.md](EXTRACTION_STATUS.md) para más detalles sobre las cartas.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
