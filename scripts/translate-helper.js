#!/usr/bin/env node

/**
 * Script para ayudar con la traducción de cartas de Monikers
 * 
 * Uso:
 *   node scripts/translate-helper.js <archivo_entrada> <archivo_salida>
 * 
 * Ejemplo:
 *   node scripts/translate-helper.js docs/cards_json/cards_021_040.json docs/cards_json/es/cards_021_040.json
 */

const fs = require('fs');
const path = require('path');

// Mapeo de categorías
const CATEGORY_MAP = {
  'CELEBRITY': 'CELEBRIDAD',
  'FICTIONAL CHARACTER': 'PERSONAJE DE FICCIÓN',
  'HISTORICAL FIGURE': 'FIGURA HISTÓRICA',
  'ET CETERA': 'ETCÉTERA',
};

function translateCategory(category) {
  // Si es "CARD BY AUTHOR", traducir
  if (category.startsWith('CARD BY')) {
    const author = category.replace('CARD BY ', '');
    return `CARTA DE ${author}`;
  }
  
  return CATEGORY_MAP[category] || category;
}

function createTranslationTemplate(inputFile, outputFile) {
  try {
    // Leer archivo de entrada
    const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
    
    // Crear template para traducción
    const template = {
      cards: data.cards.map(card => ({
        name: `[TRADUCIR] ${card.name}`,
        description: `[TRADUCIR] ${card.description}`,
        category: translateCategory(card.category),
        points: card.points,
        original: {
          name: card.name,
          description: card.description,
        }
      }))
    };
    
    // Crear directorio si no existe
    const dir = path.dirname(outputFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Escribir template
    fs.writeFileSync(outputFile, JSON.stringify(template, null, 2), 'utf8');
    
    console.log(`✅ Template creado: ${outputFile}`);
    console.log(`📝 Cartas a traducir: ${data.cards.length}`);
    console.log(`\n💡 Ahora edita el archivo y reemplaza los [TRADUCIR] con las traducciones.`);
    console.log(`   Puedes eliminar el campo 'original' cuando termines.`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

function validateTranslation(file) {
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    
    let errors = 0;
    let warnings = 0;
    
    data.cards.forEach((card, index) => {
      const cardNum = index + 1;
      
      // Verificar campos requeridos
      if (!card.name) {
        console.error(`❌ Carta ${cardNum}: Falta 'name'`);
        errors++;
      }
      if (!card.description) {
        console.error(`❌ Carta ${cardNum}: Falta 'description'`);
        errors++;
      }
      if (!card.category) {
        console.error(`❌ Carta ${cardNum}: Falta 'category'`);
        errors++;
      }
      if (!card.points) {
        console.error(`❌ Carta ${cardNum}: Falta 'points'`);
        errors++;
      }
      
      // Verificar si quedaron marcadores de traducción
      if (card.name?.includes('[TRADUCIR]')) {
        console.warn(`⚠️  Carta ${cardNum}: Nombre sin traducir`);
        warnings++;
      }
      if (card.description?.includes('[TRADUCIR]')) {
        console.warn(`⚠️  Carta ${cardNum}: Descripción sin traducir`);
        warnings++;
      }
      
      // Verificar longitud razonable
      if (card.description && card.description.length < 50) {
        console.warn(`⚠️  Carta ${cardNum}: Descripción muy corta (${card.description.length} chars)`);
        warnings++;
      }
    });
    
    console.log(`\n📊 Validación completa:`);
    console.log(`   ✅ Cartas válidas: ${data.cards.length - errors}`);
    console.log(`   ❌ Errores: ${errors}`);
    console.log(`   ⚠️  Advertencias: ${warnings}`);
    
    if (errors === 0 && warnings === 0) {
      console.log(`\n🎉 ¡Archivo perfecto!`);
    }
    
    return errors === 0;
    
  } catch (error) {
    console.error('❌ Error al validar:', error.message);
    return false;
  }
}

// Main
const args = process.argv.slice(2);
const command = args[0];

if (command === 'template' && args.length === 3) {
  createTranslationTemplate(args[1], args[2]);
} else if (command === 'validate' && args.length === 2) {
  validateTranslation(args[1]);
} else {
  console.log(`
🎭 Monikers Translation Helper

Uso:
  # Crear template para traducción
  node scripts/translate-helper.js template <archivo_entrada> <archivo_salida>
  
  # Validar archivo traducido
  node scripts/translate-helper.js validate <archivo_traducido>

Ejemplos:
  node scripts/translate-helper.js template docs/cards_json/cards_021_040.json docs/cards_json/es/cards_021_040.json
  node scripts/translate-helper.js validate docs/cards_json/es/cards_021_040.json
  `);
  process.exit(1);
}
