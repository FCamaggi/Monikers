# 🎭 Monikers Digital - Próximos Pasos

## ✅ Completado (Sesión 1)

### 1. Auditoría Completa
- ✅ Código y mecánicas analizadas
- ✅ Contenido de cartas revisado
- ✅ Plan de localización definido
- 📄 Ver [AUDITORIA.md](AUDITORIA.md) para detalles

### 2. Carga de Cartas
- ✅ 283 cartas JSON ahora se cargan en la app
- ✅ Sistema de carga dinámico implementado
- ✅ Opciones de juego actualizadas (20/40/60 cartas)

### 3. Internacionalización (i18n)
- ✅ Sistema i18n instalado y configurado
- ✅ UI completamente traducida al español
- ✅ Soporte para español e inglés (español por defecto)

### 4. Deploy
- ✅ Configuración Netlify lista (`netlify.toml`)
- ✅ Build funcional (`npm run build`)

---

## 🚧 En Progreso

### Traducción de Cartas
**Estado:** 20/283 cartas traducidas (7%)

**Cartas traducidas:**
- ✅ cards_001_020.json → `docs/cards_json/es/cards_001_020.json`

**Pendiente:**
- ⏳ cards_021_040.json a cards_281_283.json (263 cartas)

---

## 📋 Tareas Pendientes

### Prioridad Alta 🔴

#### 1. Completar Traducción de Cartas
**Objetivo:** Traducir las 263 cartas restantes

**Opciones:**
- **Opción A:** Traducción manual (laborioso pero preciso)
- **Opción B:** Traducción asistida con IA (rápido, requiere revisión)
- **Opción C:** Traducción colaborativa (involucrar a otros)

**Pasos sugeridos:**
1. Crear script de traducción asistida
2. Traducir por lotes de 20 cartas
3. Revisar cada lote manualmente
4. Ajustar contexto cultural

**Archivos a traducir:**
```
docs/cards_json/cards_021_040.json → es/cards_021_040.json
docs/cards_json/cards_041_060.json → es/cards_041_060.json
... (12 archivos más)
docs/cards_json/cards_281_283.json → es/cards_281_283.json
```

#### 2. Localización Cultural
**Objetivo:** Reemplazar ~40 cartas muy americanas

**Cartas a reemplazar:**
- Gallagher → Chespirito / El Chavo del 8
- Honey Boo Boo → Belinda / Gloria Trevi
- Rick Santorum → Hugo Chávez / Maduro
- Tonya Harding → Maradona
- The Unabomber → El Chapo Guzmán
- Evander Holyfield's ear → La Mano de Dios
- Bob Fosse → Shakira
- Deep Blue → AlphaGo
- The TSA → La Fila del Banco
- A Civil War Reenactor → Un Cosplayer

Ver [AUDITORIA.md](AUDITORIA.md) sección 3 para lista completa.

#### 3. Añadir Cartas Latinoamericanas
**Objetivo:** Crear 30-50 cartas nuevas relevantes

**Sugerencias de cartas:**
- **Figuras:** Frida Kahlo, García Márquez, Simón Bolívar, Evita Perón
- **Ficción:** Don Quijote, Sancho Panza, El Chapulín Colorado, Mafalda
- **Conceptos:** La Chancla, La Llorona, Una Telenovela, Una Piñata
- **Cultura Pop:** Bad Bunny, Shakira, Cantinflas, Mario Castañeda

Ver [AUDITORIA.md](AUDITORIA.md) sección 3 para lista completa con descripciones.

### Prioridad Media 🟡

#### 4. Integrar Cartas Españolas
**Objetivo:** Cargar cartas traducidas en la app

**Pasos:**
1. Modificar `utils/loadCards.ts` para soportar idiomas
2. Detectar idioma del navegador o configuración
3. Cargar cartas ES o EN según idioma
4. Implementar selector de idioma en UI

#### 5. Mejoras de Jugabilidad
- Configuración personalizable (nombres de equipos, duración)
- Persistencia con LocalStorage
- Estadísticas de partida
- Instrucciones del juego en español

### Prioridad Baja 🟢

#### 6. Pulido Final
- Animaciones mejoradas
- Efectos de sonido (opcional)
- Modo oscuro
- Responsive mejorado para móviles
- PWA (Progressive Web App)

---

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm run dev

# Compilar
npm run build

# Vista previa del build
npm run preview

# Limpiar y reinstalar
rm -rf node_modules package-lock.json
npm install
```

---

## 🚀 Deployment en Netlify

### Opción 1: Desde GitHub (Recomendado)

1. Sube el código a GitHub
2. Conecta el repo en Netlify
3. Netlify detectará automáticamente `netlify.toml`
4. Deploy automático con cada push

### Opción 2: Manual desde CLI

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Inicializar
netlify init

# Deploy
netlify deploy --prod
```

### Opción 3: Drag & Drop

1. Ejecuta `npm run build`
2. Ve a https://app.netlify.com/drop
3. Arrastra la carpeta `dist/`

---

## 📊 Progreso General

| Tarea | Estado | Progreso |
|-------|--------|----------|
| Auditoría | ✅ Completo | 100% |
| Carga de cartas | ✅ Completo | 100% |
| i18n UI | ✅ Completo | 100% |
| Traducción cartas | 🚧 En progreso | 7% (20/283) |
| Localización cultural | ⏳ Pendiente | 0% (0/40) |
| Cartas nuevas | ⏳ Pendiente | 0% (0/50) |
| Deploy config | ✅ Completo | 100% |
| **TOTAL** | **🚧** | **~30%** |

---

## 💡 Estrategia Recomendada

### Fase 1: Traducción Rápida (1-2 días)
1. Usar IA para traducción inicial de las 263 cartas
2. Revisar y ajustar culturalmente lote por lote
3. Probar en la app

### Fase 2: Localización (2-3 días)
1. Identificar y reemplazar cartas americanas
2. Crear cartas latinoamericanas nuevas
3. Balancear dificultad (1-4 puntos)

### Fase 3: Integración (1 día)
1. Integrar cartas españolas en el sistema
2. Probar jugabilidad completa
3. Ajustar según feedback

### Fase 4: Deploy y Testing (1 día)
1. Deploy a Netlify
2. Testing en dispositivos móviles
3. Compartir con grupo de prueba
4. Iterar según feedback

**Tiempo total estimado:** 5-7 días

---

## 🤝 Cómo Contribuir

### Traducir Cartas

1. Copia un archivo de `docs/cards_json/cards_XXX_YYY.json`
2. Traduce al español en `docs/cards_json/es/cards_XXX_YYY.json`
3. Mantén la estructura JSON
4. Adapta contexto cultural cuando sea necesario

**Formato:**
```json
{
  "cards": [
    {
      "name": "Nombre en Español",
      "description": "Descripción traducida y adaptada culturalmente",
      "category": "CATEGORÍA EN ESPAÑOL",
      "points": 2
    }
  ]
}
```

### Crear Cartas Nuevas

Usa el mismo formato JSON. Asegúrate de:
- Nombre claro y reconocible
- Descripción divertida e informativa
- Categoría apropiada
- Puntos según dificultad (1=muy fácil, 4=muy difícil)

---

## 📞 Contacto y Soporte

Para preguntas o ayuda:
- Abre un issue en el repositorio
- Consulta [AUDITORIA.md](AUDITORIA.md) para contexto

---

**¡Vamos con todo! 🚀**
