import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const wwwDir = join(__dirname, "../www");

function loadJSON(filename) {
  return JSON.parse(readFileSync(join(wwwDir, filename), "utf-8"));
}

// ---------------------------------------------------------------------------
// proposals.es.json
// ---------------------------------------------------------------------------

describe("proposals.es.json", () => {
  const proposals = loadJSON("proposals.es.json");
  const VALID_TYPES = ["Movie", "TV"];
  const VALID_DURATIONS = ["Short", "Medium", "Long"];

  it("has at least one entry", () => {
    expect(proposals.length).toBeGreaterThan(0);
  });

  it("all titles are non-empty strings", () => {
    proposals.forEach(p =>
      expect(typeof p.title === "string" && p.title.length > 0, `"${p.title}" title is empty`).toBe(true)
    );
  });

  it("all types are 'Movie' or 'TV'", () => {
    proposals.forEach(p =>
      expect(VALID_TYPES, `"${p.title}" has invalid type "${p.type}"`).toContain(p.type)
    );
  });

  it("all durations are Short, Medium, or Long", () => {
    proposals.forEach(p =>
      expect(VALID_DURATIONS, `"${p.title}" has invalid duration "${p.duration}"`).toContain(p.duration)
    );
  });

  it("all star ratings are integers between 1 and 5", () => {
    proposals.forEach(p => {
      expect(Number.isInteger(p.stars), `"${p.title}" stars is not an integer`).toBe(true);
      expect(p.stars, `"${p.title}" stars out of range`).toBeGreaterThanOrEqual(1);
      expect(p.stars, `"${p.title}" stars out of range`).toBeLessThanOrEqual(5);
    });
  });

  it("all genres are non-empty strings", () => {
    proposals.forEach(p =>
      expect(typeof p.genre === "string" && p.genre.length > 0, `"${p.title}" has empty genre`).toBe(true)
    );
  });

  it("original_language is a string when present", () => {
    proposals.forEach(p => {
      if (p.original_language !== undefined) {
        expect(typeof p.original_language, `"${p.title}" original_language is not a string`).toBe("string");
      }
    });
  });
});

// ---------------------------------------------------------------------------
// objectives.es.json
// ---------------------------------------------------------------------------

describe("objectives.es.json", () => {
  const objectives = loadJSON("objectives.es.json");

  it("has at least one entry", () => {
    expect(objectives.length).toBeGreaterThan(0);
  });

  it("all points are positive integers", () => {
    objectives.forEach((o, i) => {
      expect(Number.isInteger(o.points), `objectives[${i}] points is not an integer`).toBe(true);
      expect(o.points, `objectives[${i}] points must be positive`).toBeGreaterThan(0);
    });
  });

  it("description is a string on every entry", () => {
    objectives.forEach((o, i) =>
      expect(typeof o.description, `objectives[${i}] description is not a string`).toBe("string")
    );
  });
});

// ---------------------------------------------------------------------------
// specials.es.json
// ---------------------------------------------------------------------------

describe("specials.es.json", () => {
  const specials = loadJSON("specials.es.json");

  it("has at least one entry", () => {
    expect(specials.length).toBeGreaterThan(0);
  });

  it("has exactly 2 fixed cards", () => {
    const fixed = specials.filter(s => s.fixed === true);
    expect(fixed).toHaveLength(2);
  });

  it("all costs are positive numbers", () => {
    specials.forEach(s =>
      expect(s.cost, `"${s.title}" cost must be positive`).toBeGreaterThan(0)
    );
  });

  it("all effects are non-empty strings", () => {
    specials.forEach(s =>
      expect(typeof s.effect === "string" && s.effect.length > 0, `"${s.title}" has empty effect`).toBe(true)
    );
  });

  it("all titles are non-empty strings", () => {
    specials.forEach(s =>
      expect(typeof s.title === "string" && s.title.length > 0, `special card has empty title`).toBe(true)
    );
  });
});

// ---------------------------------------------------------------------------
// Translation files
// ---------------------------------------------------------------------------

describe("translation files (es / en / ca)", () => {
  const REQUIRED_KEYS = ["proposta", "objectiu", "especial", "cost", "punt", "cost fix"];
  const langs = ["es", "en", "ca"];

  it("each file contains all required keys", () => {
    langs.forEach(lang => {
      const tr = loadJSON(`${lang}.json`);
      REQUIRED_KEYS.forEach(key => {
        expect(Object.keys(tr).map(k => k.toLowerCase()), `${lang}.json missing key "${key}"`).toContain(key.toLowerCase());
      });
    });
  });

  it("no required key maps to an empty value", () => {
    langs.forEach(lang => {
      const tr = loadJSON(`${lang}.json`);
      // normalize keys to lowercase for lookup
      const normalized = Object.fromEntries(Object.entries(tr).map(([k, v]) => [k.toLowerCase(), v]));
      REQUIRED_KEYS.forEach(key => {
        expect(normalized[key.toLowerCase()], `${lang}.json key "${key}" is empty`).toBeTruthy();
      });
    });
  });

  it("all translation files expose the same set of keys (case-insensitive)", () => {
    const keySets = langs.map(lang =>
      Object.keys(loadJSON(`${lang}.json`)).map(k => k.toLowerCase()).sort()
    );
    expect(keySets[0]).toEqual(keySets[1]);
    expect(keySets[0]).toEqual(keySets[2]);
  });

  it("all keys in every translation file are lowercase (t() lowercases the lookup, not the stored key)", () => {
    langs.forEach(lang => {
      const keys = Object.keys(loadJSON(`${lang}.json`));
      keys.forEach(k =>
        expect(k, `${lang}.json has mixed-case key "${k}" — t() won't find it`).toBe(k.toLowerCase())
      );
    });
  });
});
