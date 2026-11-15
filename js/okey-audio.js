/**
 * ARENA Okey / 101 - Web Audio API efekt motoru
 * Sesler ilk kullanıcı etkileşiminde başlatılır; harici dosya gerektirmez.
 */
class OkeyAudioEngine {
  constructor() { this.audioCtx = null; }
  initContext() {
    if (typeof window === 'undefined') return false;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return false;
    if (!this.audioCtx) this.audioCtx = new Ctx();
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume().catch(() => {});
    return true;
  }
  playTone(type, startHz, endHz, duration, volume, wave) {
    if (!this.initContext()) return;
    const ctx = this.audioCtx, now = ctx.currentTime;
    const osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.type = wave;
    osc.frequency.setValueAtTime(startHz, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(1,endHz), now + duration);
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(now); osc.stop(now + duration + 0.005);
  }
  playTileClick() { this.playTone('click',700,150,.05,.3,'triangle'); }
  playTileDiscard() { this.playTone('discard',250,60,.14,.5,'sine'); }
}
window.OkeyAudioEngine = OkeyAudioEngine;
window.okeySfx = window.okeySfx || new OkeyAudioEngine();
