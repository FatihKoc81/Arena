/**
 * ARENA Okey / 101 - Kurallar ve Puanlama Motoru
 * Taş: { color: 'red'|'blue'|'black'|'green'|'joker', value: 1-13 }
 */
class OkeyRulesEngine {
  static isValidPer(tiles) {
    if (!Array.isArray(tiles) || tiles.length < 3) return false;
    const normal = tiles.filter(t => t && t.color !== 'joker');
    if (normal.length === 0) return false;
    return this.checkIsGroup(tiles) || this.checkIsRun(tiles);
  }

  static checkIsGroup(tiles) {
    if (!Array.isArray(tiles) || tiles.length < 3 || tiles.length > 4) return false;
    const normal = tiles.filter(t => t && t.color !== 'joker');
    if (!normal.length) return false;
    const value = normal[0].value;
    const colors = new Set();
    for (const tile of normal) {
      if (tile.value !== value || colors.has(tile.color)) return false;
      colors.add(tile.color);
    }
    // Jokerler grupta eksik renklerin yerini doldurur; aynı renkten iki taş olamaz.
    return colors.size + (tiles.length - normal.length) === tiles.length;
  }

  static checkIsRun(tiles) {
    if (!Array.isArray(tiles) || tiles.length < 3) return false;
    const normal = tiles.filter(t => t && t.color !== 'joker').slice().sort((a,b) => a.value-b.value);
    if (!normal.length) return false;
    const color = normal[0].color;
    if (normal.some(t => t.color !== color || !Number.isInteger(t.value) || t.value < 1 || t.value > 13)) return false;
    // Aynı sayı tekrarı seriyi geçersiz kılar. Jokerler aradaki boşlukları kapatır.
    let jokers = tiles.length - normal.length;
    let previous = normal[0].value;
    for (let i=1; i<normal.length; i++) {
      const gap = normal[i].value - previous - 1;
      if (gap < 0 || gap > jokers) return false;
      jokers -= gap;
      previous = normal[i].value;
    }
    return true;
  }

  static checkPairs(handTiles, requiredPairsCount = 7) {
    const counts = new Map();
    let jokers = 0;
    for (const tile of (handTiles || [])) {
      if (tile.color === 'joker') jokers++;
      else {
        const key = tile.color + '-' + tile.value;
        counts.set(key, (counts.get(key) || 0) + 1);
      }
    }
    let pairs = 0;
    for (const count of counts.values()) {
      pairs += Math.floor(count / 2);
      if (count % 2 && jokers) { pairs++; jokers--; }
    }
    pairs += Math.floor(jokers / 2);
    return pairs >= requiredPairsCount;
  }

  static calculatePenaltyScore(handTiles, hasOpened = false) {
    if (!hasOpened) return 200;
    return (handTiles || []).reduce((sum, tile) =>
      sum + (tile.color === 'joker' ? 50 : tile.value === 1 ? 11 : tile.value), 0);
  }
}
window.OkeyRulesEngine = OkeyRulesEngine;
