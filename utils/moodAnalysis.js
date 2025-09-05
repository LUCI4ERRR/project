/**
 * Small helpers for mood aggregation
 */

function aggregateMood(entries) {
  if (!entries || entries.length === 0) return { averageMood: null, count: 0 };
  const sum = entries.reduce((s, e) => s + (e.mood || 0), 0);
  return { averageMood: sum / entries.length, count: entries.length };
}

module.exports = { aggregateMood };
