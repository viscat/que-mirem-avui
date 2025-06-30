# ¿Qué Vemos Hoy?

**¿Qué Vemos Hoy?** es un juego de mesa para dos personas que intenta resolver el dilema de decidir qué ver. Con cartas de propuestas, objetivos, acciones especiales, likes, dislikes y palomitas, los jugadores tendrán que negociar, competir y utilizar estrategias para conseguir que su propuesta preferida sea la ganadora.

## 📦 Elementos del juego

El juego incluye los siguientes componentes:

- **Propuestas**: 40 cartas con películas o series para votar.
- **Objetivos**: 24 cartas que definen los objetivos a cumplir para hacer puntos.
- **Cartas especiales**: 8 acciones únicas que se pueden ejecutar gastando palomitas (2 de ellas son fijas).
- **Likes/Dislikes**: Marcadores para votar las propuestas (valores de -3 a +3).
- **Palomitas**: La moneda del juego para ejecutar acciones especiales.

## ✨ Objetivo del juego

Hacer que la propuesta escogida sea la que mejor encaja con tus **objetivos**, acumulando la máxima puntuación posible.

## 🎮 Cómo jugar

Mira el archivo [`regles.html`](www/regles.html) para una explicación detallada de las reglas y variantes del juego.

## 📂 Estructura del proyecto

- **`proposals.json`**: Contiene las cartas de propuestas con información como título, tipo, género, duración, estrellas e idioma original (nombres de campos en inglés, contenido en español).
- **`objectives.json`**: Define los objetivos que los jugadores pueden cumplir para ganar puntos (nombres de campos en inglés, contenido en español).
- **`specials.json`**: Incluye las cartas especiales con acciones únicas y sus costos (nombres de campos en inglés, contenido en español).
- **`en.json`**: Traducciones al inglés para nombres de campos y variables.
- **`es.json`**: Traducciones al español para nombres de campos y variables.
- **`ca.json`**: Traducciones al catalán para nombres de campos y variables (archivo original).
- **`regles.html`**: Guía del juego con las reglas y variantes.
- **`cartes.html`**: Genera las cartas del juego en formato imprimible.
- **`crispetes.html`**: Genera las palomitas (moneda del juego) en formato imprimible.
- **`likes.html`**: Genera los tokens de votación (likes/dislikes) en formato imprimible.

## 🚀 Cómo utilizar el proyecto

1. Levanta un servidor local para poder abrir los archivos HTML en el navegador, ya que estos importan otros documentos como los JSON o imágenes. Puedes hacerlo con el comando siguiente:

    ```bash
    python -m http.server
    ```

2. Abre los archivos HTML en el navegador accediendo a la dirección proporcionada por el servidor local (normalmente `http://localhost:8000`).

3. Imprime los componentes necesarios para jugar.

4. Sigue las reglas descritas en el archivo `regles.html`.

## 🌐 Idiomas

El juego soporta internacionalización. Actualmente, está disponible en:
- **Español** (`es.json`) - Texto mostrado al usuario
- **Inglés** (`en.json`) - Nombres de campos y variables
- **Catalán** (`ca.json`) - Archivo original

Los archivos JSON principales (`proposals.json`, `objectives.json`, `specials.json`) usan nombres de campos en inglés para facilitar el desarrollo, pero el contenido mostrado al usuario está en español.

## 🛠️ Contribución

Si quieres contribuir al proyecto, puedes:
- Añadir nuevas cartas de propuestas, objetivos o acciones especiales.
- Mejorar las reglas o añadir variantes.
- Traducir el juego a otros idiomas.

## 📜 Licencia

Este proyecto está bajo una licencia [MIT](https://opensource.org/licenses/MIT). Puedes utilizarlo, modificarlo y compartirlo libremente.

---

**Hecho para decidir sin discutir... ¡o discutiendo con estilo!**
