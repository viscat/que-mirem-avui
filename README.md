# Què Mirem Avui?

**Què Mirem Avui?** és un joc de taula per a dues persones que intenta resoldre el dilema de decidir què veure. Amb cartes de propostes, objectius, accions especials, likes, dislikes i crispetes, els jugadors hauran de negociar, competir i utilitzar estratègies per aconseguir que la seva proposta preferida sigui la guanyadora.

## 📦 Elements del joc

El joc inclou els següents components:

- **Propostes**: 20 cartes amb pel·lícules o sèries per votar.
- **Objectius**: 24 cartes que defineixen els objectius a complir per fer punts.
- **Cartes especials**: 8 accions úniques que es poden executar gastant crispetes (2 d'elles són fixes).
- **Likes/Dislikes**: Marcadors per votar les propostes (valors de -3 a +3).
- **Crispetes**: La moneda del joc per executar accions especials.

## ✨ Objectiu del joc

Fer que la proposta escollida sigui la que millor encaixa amb els teus **objectius**, acumulant la màxima puntuació possible.

## 🎮 Com jugar

Mirar el fitxer [`regles.html`](regles.html) per a una explicació detallada de les regles i variants del joc.

## 📂 Estructura del projecte

- **`propostes.json`**: Conté les cartes de propostes amb informació com títol, tipus, gènere, durada, estrelles i idioma original.
- **`objectius.json`**: Defineix els objectius que els jugadors poden complir per guanyar punts.
- **`especials.json`**: Inclou les cartes especials amb accions úniques i els seus costos.
- **`regles.html`**: Guia del joc amb les regles i variants.
- **`cartes.html`**: Genera les cartes del joc en format imprimible.
- **`crispetes.html`**: Genera les crispetes (moneda del joc) en format imprimible.
- **`likes.html`**: Genera els tokens de votació (likes/dislikes) en format imprimible.

## 🚀 Com utilitzar el projecte

1. Aixeca un servidor local per poder obrir els fitxers HTML al navegador, ja que aquests importen altres documents com els JSON o imatges. Pots fer-ho amb la comanda següent:

    ```bash
    python -m http.server
    ```

2. Obre els fitxers HTML al navegador accedint a l'adreça proporcionada pel servidor local (normalment `http://localhost:8000`).

3. Imprimeix els components necessaris per jugar.

4. Segueix les regles descrites al fitxer `regles.html`.

## 🌐 Idiomes

El joc suporta internacionalització. Actualment, està disponible en català (`ca.json`) i es pot ampliar fàcilment afegint més fitxers de traducció.

## 🛠️ Contribució

Si vols contribuir al projecte, pots:
- Afegir noves cartes de propostes, objectius o accions especials.
- Millorar les regles o afegir variants.
- Traduir el joc a altres idiomes.

## 📜 Llicència

Aquest projecte està sota una llicència [MIT](https://opensource.org/licenses/MIT). Pots utilitzar-lo, modificar-lo i compartir-lo lliurement.

---

**Fet per decidir sense discutir... o discutint amb estil!**