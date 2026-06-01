let translations = {};

export function setTranslations(newTranslations) {
  translations = newTranslations;
}

export function t(key) {
  return translations[key.toLowerCase()] || key;
}

export function splitIntoPages(array, pageSize) {
  const pages = [];
  for (let i = 0; i < array.length; i += pageSize) {
    pages.push(array.slice(i, i + pageSize));
  }
  return pages;
}

function createCardHTML(title, contentHTML) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `<h2>${title}</h2>${contentHTML}`;
  return card;
}

export function createBack(tipo) {
  const emoji = {
    "Propuesta": "🎞️ 📺",
    "Objetivo": "🎯",
    "Especial": "✨"
  }[tipo] || "🎲";

  const colorClass = {
    "Propuesta": "back-propuesta",
    "Objetivo": "back-objetivo",
    "Especial": "back-especial"
  }[tipo] || "";

  const card = document.createElement("div");
  card.className = `card ${colorClass}`;
  if (tipo === "Objetivo") {
    card.classList.add("objective-card");
  }
  card.innerHTML = `<h2>${emoji}<br>${t(tipo)}</h2>`;
  return card;
}

export function createProposalCard(p) {
  const emoji = p.type === "Movie" ? "🎞️" : "📺";
  const levels = { short: 1, medium: 2, long: 3 }[p.duration.toLowerCase()] || 0;
  const barHTML = `<div class="duration-bar">${[0, 1, 2].map(i => `<div class="segment ${i < levels ? "filled" : ""}"></div>`).join("")}</div>`;
  const language = p.original_language
    ? `<div class="tags"><span class="tag">${p.original_language}</span></div>`
    : "";

  const starsHTML = Array.from({ length: 5 }, (_, i) =>
    `<span class="star ${i < p.stars ? "" : "empty"}">⭐</span>`
  ).join("");

  const html = `
    <div class="emoji-title"><span>${emoji}</span><h2>${p.title}</h2></div>
    <div class="stars">${starsHTML}</div>
    ${barHTML}
    <p style="text-align:center;"><em>${p.genre}</em></p>
    <div class="tags">${language}</div>`;
  return createCardHTML("", html);
}

export function createObjectiveCard(o) {
  const card = document.createElement("div");
  card.className = "card objective-card";
  card.innerHTML = `
    <div class="objective-title">${t("objectiu")}</div>
    <div class="objective-description">${o.description}</div>
    <div class="objective-points">${o.points} ${t("punt")}${o.points > 1 ? "s" : ""}</div>
  `;
  return card;
}

export function createSpecialCard(e) {
  const card = document.createElement("div");
  card.className = "card special-card";

  const costClass = e.fixed ? "special-cost fixed" : "special-cost";
  const costText = e.fixed ? `${e.cost} (${t("cost fix")})` : e.cost;

  card.innerHTML = `
    <div class="special-title">${e.title}</div>
    <div class="special-effect">${e.effect}</div>
    <div class="${costClass}">
      <img src="popcorn.png" alt="palomitas">
      ${costText}
    </div>
  `;
  return card;
}

export function renderSectionWithBacks(data, tipo, renderFunc, containerId, numberOfCardsPerPage = 8) {
  const container = document.getElementById(containerId);
  const cards = data.map(renderFunc);
  const pages = splitIntoPages(cards, numberOfCardsPerPage);
  const isObjectives = tipo === "Objetivo";

  pages.forEach(page => {
    const front = document.createElement("div");
    front.className = `page ${isObjectives ? "objectives-page" : ""}`;
    page.forEach(card => front.appendChild(card));
    container.appendChild(front);

    const back = document.createElement("div");
    back.className = `page ${isObjectives ? "objectives-page back-page" : ""}`;
    page.forEach(() => back.appendChild(createBack(tipo)));
    container.appendChild(back);
  });
}
