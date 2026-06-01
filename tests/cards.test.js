import { describe, it, expect, beforeEach } from "vitest";
import {
  setTranslations,
  t,
  splitIntoPages,
  createBack,
  createProposalCard,
  createObjectiveCard,
  createSpecialCard,
  renderSectionWithBacks,
} from "../www/cards.js";

const esTranslations = {
  proposta: "Propuesta",
  objectiu: "Objetivo",
  especial: "Especial",
  cost: "Coste",
  punt: "punto",
  "cost fix": "Coste fijo",
};

beforeEach(() => {
  setTranslations(esTranslations);
  document.body.innerHTML = "";
});

// ---------------------------------------------------------------------------
// t()
// ---------------------------------------------------------------------------

describe("t()", () => {
  it("returns translation for a known key", () => {
    expect(t("punt")).toBe("punto");
  });

  it("is case-insensitive on the lookup key", () => {
    expect(t("PUNT")).toBe("punto");
    expect(t("Punt")).toBe("punto");
  });

  it("returns the original key when no translation exists", () => {
    expect(t("nonexistent")).toBe("nonexistent");
  });

  it("returns empty string for empty key", () => {
    expect(t("")).toBe("");
  });
});

// ---------------------------------------------------------------------------
// splitIntoPages()
// ---------------------------------------------------------------------------

describe("splitIntoPages()", () => {
  it("returns an empty array for empty input", () => {
    expect(splitIntoPages([], 8)).toEqual([]);
  });

  it("returns one full page when items fit exactly", () => {
    const arr = Array.from({ length: 8 }, (_, i) => i);
    const pages = splitIntoPages(arr, 8);
    expect(pages).toHaveLength(1);
    expect(pages[0]).toHaveLength(8);
  });

  it("puts the remainder on the last page", () => {
    const arr = Array.from({ length: 17 }, (_, i) => i);
    const pages = splitIntoPages(arr, 8);
    expect(pages).toHaveLength(3);
    expect(pages[0]).toHaveLength(8);
    expect(pages[1]).toHaveLength(8);
    expect(pages[2]).toHaveLength(1);
  });

  it("handles an array smaller than the page size", () => {
    const pages = splitIntoPages([1, 2, 3], 8);
    expect(pages).toHaveLength(1);
    expect(pages[0]).toEqual([1, 2, 3]);
  });

  it("preserves all items in order", () => {
    const arr = Array.from({ length: 40 }, (_, i) => i);
    expect(splitIntoPages(arr, 8).flat()).toEqual(arr);
  });

  it("works with the objectives page size of 9", () => {
    const arr = Array.from({ length: 24 }, (_, i) => i);
    const pages = splitIntoPages(arr, 9);
    expect(pages).toHaveLength(3);
    expect(pages[2]).toHaveLength(6);
  });
});

// ---------------------------------------------------------------------------
// createProposalCard()
// ---------------------------------------------------------------------------

describe("createProposalCard()", () => {
  const base = {
    title: "Jurassic Park",
    type: "Movie",
    genre: "Aventura",
    duration: "Long",
    stars: 5,
    original_language: "Inglés",
  };

  it("uses the film emoji for Movie type", () => {
    const card = createProposalCard({ ...base, type: "Movie" });
    expect(card.innerHTML).toContain("🎞️");
  });

  it("uses the TV emoji for TV type", () => {
    const card = createProposalCard({ ...base, type: "TV" });
    expect(card.innerHTML).toContain("📺");
  });

  it("shows 3 filled segments for Long duration", () => {
    const card = createProposalCard({ ...base, duration: "Long" });
    expect(card.querySelectorAll(".segment.filled")).toHaveLength(3);
  });

  it("shows 2 filled segments for Medium duration", () => {
    const card = createProposalCard({ ...base, duration: "Medium" });
    expect(card.querySelectorAll(".segment.filled")).toHaveLength(2);
  });

  it("shows 1 filled segment for Short duration", () => {
    const card = createProposalCard({ ...base, duration: "Short" });
    expect(card.querySelectorAll(".segment.filled")).toHaveLength(1);
  });

  it("always renders exactly 5 star elements", () => {
    expect(createProposalCard({ ...base, stars: 1 }).querySelectorAll(".star")).toHaveLength(5);
    expect(createProposalCard({ ...base, stars: 5 }).querySelectorAll(".star")).toHaveLength(5);
  });

  it("renders the correct split of filled vs empty stars", () => {
    const card = createProposalCard({ ...base, stars: 3 });
    expect(card.querySelectorAll(".star:not(.empty)")).toHaveLength(3);
    expect(card.querySelectorAll(".star.empty")).toHaveLength(2);
  });

  it("filled + empty stars always total 5", () => {
    [1, 2, 3, 4, 5].forEach(stars => {
      const card = createProposalCard({ ...base, stars });
      const filled = card.querySelectorAll(".star:not(.empty)").length;
      const empty = card.querySelectorAll(".star.empty").length;
      expect(filled + empty).toBe(5);
    });
  });

  it("shows the language tag when original_language is set", () => {
    const card = createProposalCard({ ...base, original_language: "Inglés" });
    expect(card.querySelector(".tag").textContent).toBe("Inglés");
  });

  it("shows no language tag when original_language is absent", () => {
    const { original_language, ...noLang } = base;
    const card = createProposalCard(noLang);
    expect(card.querySelector(".tag")).toBeNull();
  });

  it("shows the title", () => {
    const card = createProposalCard(base);
    expect(card.innerHTML).toContain("Jurassic Park");
  });

  it("shows the genre", () => {
    const card = createProposalCard(base);
    expect(card.querySelector("em").textContent).toBe("Aventura");
  });
});

// ---------------------------------------------------------------------------
// createObjectiveCard()
// ---------------------------------------------------------------------------

describe("createObjectiveCard()", () => {
  it("uses plural 'puntos' for points > 1", () => {
    const card = createObjectiveCard({ description: "Algo", points: 3 });
    expect(card.querySelector(".objective-points").textContent.trim()).toBe("3 puntos");
  });

  it("uses singular 'punto' for exactly 1 point", () => {
    const card = createObjectiveCard({ description: "Algo", points: 1 });
    expect(card.querySelector(".objective-points").textContent.trim()).toBe("1 punto");
  });

  it("shows the description", () => {
    const card = createObjectiveCard({ description: "Debe ser una película", points: 2 });
    expect(card.querySelector(".objective-description").textContent).toBe("Debe ser una película");
  });

  it("has the objective-card CSS class", () => {
    const card = createObjectiveCard({ description: "X", points: 2 });
    expect(card.classList.contains("objective-card")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// createSpecialCard()
// ---------------------------------------------------------------------------

describe("createSpecialCard()", () => {
  it("does NOT apply 'fixed' class for a non-fixed card", () => {
    const card = createSpecialCard({ title: "T", effect: "E", cost: 2 });
    expect(card.querySelector(".special-cost").classList.contains("fixed")).toBe(false);
  });

  it("applies 'fixed' class for a fixed card", () => {
    const card = createSpecialCard({ title: "T", effect: "E", cost: 1, fixed: true });
    expect(card.querySelector(".special-cost").classList.contains("fixed")).toBe(true);
  });

  it("shows just the cost number for a non-fixed card", () => {
    const card = createSpecialCard({ title: "T", effect: "E", cost: 3 });
    expect(card.querySelector(".special-cost").textContent).toContain("3");
    expect(card.querySelector(".special-cost").textContent).not.toContain("fijo");
  });

  it("shows 'Coste fijo' label for a fixed card", () => {
    const card = createSpecialCard({ title: "T", effect: "E", cost: 1, fixed: true });
    expect(card.querySelector(".special-cost").textContent).toContain("Coste fijo");
  });

  it("shows the effect text", () => {
    const card = createSpecialCard({ title: "T", effect: "Elimina una propuesta", cost: 2 });
    expect(card.querySelector(".special-effect").textContent.trim()).toBe("Elimina una propuesta");
  });

  it("shows the title", () => {
    const card = createSpecialCard({ title: "🎭 Cambio de plataforma", effect: "E", cost: 2 });
    expect(card.querySelector(".special-title").textContent).toBe("🎭 Cambio de plataforma");
  });
});

// ---------------------------------------------------------------------------
// createBack()
// ---------------------------------------------------------------------------

describe("createBack()", () => {
  it("applies back-propuesta class for Propuesta", () => {
    expect(createBack("Propuesta").classList.contains("back-propuesta")).toBe(true);
  });

  it("applies back-objetivo class for Objetivo", () => {
    expect(createBack("Objetivo").classList.contains("back-objetivo")).toBe(true);
  });

  it("also applies objective-card class for Objetivo", () => {
    expect(createBack("Objetivo").classList.contains("objective-card")).toBe(true);
  });

  it("does NOT apply objective-card class for Propuesta", () => {
    expect(createBack("Propuesta").classList.contains("objective-card")).toBe(false);
  });

  it("applies back-especial class for Especial", () => {
    expect(createBack("Especial").classList.contains("back-especial")).toBe(true);
  });

  it("falls back to the generic dice emoji for an unknown tipo", () => {
    expect(createBack("Unknown").innerHTML).toContain("🎲");
  });
});

// ---------------------------------------------------------------------------
// renderSectionWithBacks()
// ---------------------------------------------------------------------------

describe("renderSectionWithBacks()", () => {
  function setupContainer(id) {
    const div = document.createElement("div");
    div.id = id;
    document.body.appendChild(div);
    return div;
  }

  it("creates one front page and one back page per chunk", () => {
    setupContainer("test-section");
    const data = Array.from({ length: 8 }, (_, i) => ({ title: `Item ${i}`, type: "Movie", genre: "X", duration: "Short", stars: 1 }));
    renderSectionWithBacks(data, "Propuesta", createProposalCard, "test-section", 8);
    const pages = document.querySelectorAll("#test-section .page");
    expect(pages).toHaveLength(2); // 1 front + 1 back
  });

  it("back pages carry the back-page class for non-objectives", () => {
    setupContainer("test-section2");
    const data = [{ title: "T", type: "Movie", genre: "X", duration: "Short", stars: 1 }];
    renderSectionWithBacks(data, "Propuesta", createProposalCard, "test-section2", 8);
    const pages = [...document.querySelectorAll("#test-section2 .page")];
    expect(pages[1].classList.contains("back-page")).toBe(false); // non-objective back pages lack the class
  });

  it("objective back pages carry objectives-page and back-page classes", () => {
    setupContainer("test-objectives");
    const data = [{ description: "D", points: 2 }];
    renderSectionWithBacks(data, "Objetivo", createObjectiveCard, "test-objectives", 9);
    const pages = [...document.querySelectorAll("#test-objectives .page")];
    expect(pages[1].classList.contains("objectives-page")).toBe(true);
    expect(pages[1].classList.contains("back-page")).toBe(true);
  });

  it("produces the correct total number of page elements for multiple chunks", () => {
    setupContainer("test-multi");
    const data = Array.from({ length: 20 }, (_, i) => ({ title: `T${i}`, type: "TV", genre: "X", duration: "Long", stars: 3 }));
    renderSectionWithBacks(data, "Propuesta", createProposalCard, "test-multi", 8);
    // 20 items → 3 chunks → 3 front + 3 back = 6 pages
    expect(document.querySelectorAll("#test-multi .page")).toHaveLength(6);
  });
});
