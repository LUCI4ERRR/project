/**
 * Very lightweight rule-based sentiment + crisis detection.
 * Works offline and is deterministic.
 */

const CRISIS_KEYWORDS = [
  "suicide","kill myself","end my life","want to die","i'll kill myself",
  "self harm","cut myself","cutting","no reason to live","i can't go on"
];

const NEGATIVE = ["sad","hopeless","depressed","anxious","stressed","overwhelmed","lonely","worthless"];
const POSITIVE = ["happy","better","okay","fine","relieved","calm","good","hopeful"];

function analyzeText(text) {
  const t = (text || "").toLowerCase();
  const words = t.split(/\W+/);
  let score = 0;
  for (const w of words) {
    if (NEGATIVE.includes(w)) score -= 1;
    if (POSITIVE.includes(w)) score += 1;
  }
  // crude polarity: -3..3 → normalize
  let polarity = Math.max(-3, Math.min(3, score));
  // risk if contains crisis keywords
  const crisisHit = CRISIS_KEYWORDS.some(k => t.includes(k));
  const risk = crisisHit || polarity <= -2;
  return { polarity, risk, crisisHit };
}

module.exports = { analyzeText, CRISIS_KEYWORDS };
