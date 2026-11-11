import { TextToSpeech } from '@capacitor-community/text-to-speech';
window.ArenaTTS = {
  speak: (text) => TextToSpeech.speak({ text, lang: 'tr-TR', rate: 0.88, pitch: 1, volume: 1, queueStrategy: 0 }),
  stop: () => TextToSpeech.stop()
};
