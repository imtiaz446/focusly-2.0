// Web Audio API Synthesizer for Focusly
// Pure procedural audio generation - no external audio files required!

class SoundEngine {
  private ctx: AudioContext | null = null;
  private ambientSource: AudioNode | null = null;
  private ambientGain: GainNode | null = null;
  private isAmbientPlaying = false;
  private currentAmbientType: string = 'none';

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play crisp UI click
  playClick(volume = 0.3) {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(volume * 0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      // Audio might be blocked until user gesture
    }
  }

  // Play session start acoustic chime
  playStart(volume = 0.5) {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0.001, now + idx * 0.07);
        gain.gain.linearRampToValueAtTime(volume * 0.25, now + idx * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.65);
      });
    } catch (e) {
      // Audio context error ignore
    }
  }

  // Play rich crystal completion chime (zen bowl resonance)
  playCompletionChime(volume = 0.7) {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      // Resonant singing bowl harmonics
      const partials = [
        { freq: 440, gain: 0.5, decay: 3.5 },
        { freq: 884, gain: 0.35, decay: 2.8 },
        { freq: 1320, gain: 0.2, decay: 2.2 },
        { freq: 1764, gain: 0.15, decay: 1.8 },
      ];

      partials.forEach(p => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(p.freq, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(volume * p.gain, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + p.decay);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + p.decay + 0.1);
      });
    } catch (e) {
      console.warn('Completion chime error:', e);
    }
  }

  // Level Up / Achievement Fanfare
  playFanfare(volume = 0.6) {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const notes = [
        { f: 523.25, time: 0.0, dur: 0.12 },
        { f: 659.25, time: 0.12, dur: 0.12 },
        { f: 783.99, time: 0.24, dur: 0.15 },
        { f: 1046.5, time: 0.38, dur: 0.7 },
      ];

      notes.forEach(n => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, now + n.time);

        gain.gain.setValueAtTime(0.01, now + n.time);
        gain.gain.linearRampToValueAtTime(volume * 0.4, now + n.time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.time + n.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + n.time);
        osc.stop(now + n.time + n.dur + 0.05);
      });
    } catch (e) {}
  }

  // Start procedural ambient soundscape
  startAmbient(type: 'whitenoise' | 'rain' | 'binaural' | 'cosmic', volume = 0.25) {
    try {
      this.stopAmbient();
      const ctx = this.getContext();
      this.currentAmbientType = type;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 1.2);
      masterGain.connect(ctx.destination);
      this.ambientGain = masterGain;

      if (type === 'whitenoise') {
        // Filtered soft brown/white noise
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          lastOut = (lastOut + 0.02 * white) / 1.02; // Brown noise approximation
          data[i] = lastOut * 3.5;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(650, ctx.currentTime);

        noise.connect(filter);
        filter.connect(masterGain);
        noise.start();
        this.ambientSource = noise;
      } else if (type === 'rain') {
        // Rain: layered noise with high-pass and band-pass filtering
        const bufferSize = ctx.sampleRate * 3;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const lowpass = ctx.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.setValueAtTime(1200, ctx.currentTime);

        const highpass = ctx.createBiquadFilter();
        highpass.type = 'highpass';
        highpass.frequency.setValueAtTime(250, ctx.currentTime);

        noise.connect(lowpass);
        lowpass.connect(highpass);
        highpass.connect(masterGain);

        noise.start();
        this.ambientSource = noise;
      } else if (type === 'binaural') {
        // Binaural alpha focus beat: 216Hz and 226Hz (10Hz alpha difference)
        const oscL = ctx.createOscillator();
        const oscR = ctx.createOscillator();
        oscL.type = 'sine';
        oscR.type = 'sine';
        oscL.frequency.setValueAtTime(216, ctx.currentTime);
        oscR.frequency.setValueAtTime(226, ctx.currentTime);

        const merger = ctx.createChannelMerger(2);
        oscL.connect(merger, 0, 0);
        oscR.connect(merger, 0, 1);

        merger.connect(masterGain);

        oscL.start();
        oscR.start();

        // Wrap into dummy node for cancellation
        this.ambientSource = {
          disconnect: () => {
            try {
              oscL.stop();
              oscR.stop();
              oscL.disconnect();
              oscR.disconnect();
            } catch (e) {}
          },
        } as any;
      } else if (type === 'cosmic') {
        // Cosmic space drone: low mellow resonant sine chords with slow filter modulation
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();

        osc1.type = 'sawtooth';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(110, ctx.currentTime); // A2
        osc2.frequency.setValueAtTime(164.81, ctx.currentTime); // E3

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, ctx.currentTime);
        filter.Q.setValueAtTime(3, ctx.currentTime);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(masterGain);

        osc1.start();
        osc2.start();

        this.ambientSource = {
          disconnect: () => {
            try {
              osc1.stop();
              osc2.stop();
              osc1.disconnect();
              osc2.disconnect();
            } catch (e) {}
          },
        } as any;
      }

      this.isAmbientPlaying = true;
    } catch (e) {
      console.warn('Failed to start ambient sound:', e);
    }
  }

  // Set ambient volume smoothly
  setAmbientVolume(volume: number) {
    if (this.ambientGain && this.ctx) {
      try {
        this.ambientGain.gain.setValueAtTime(volume, this.ctx.currentTime);
      } catch (e) {}
    }
  }

  // Stop ambient sound
  stopAmbient() {
    if (this.ambientGain && this.ctx) {
      try {
        this.ambientGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
      } catch (e) {}
    }
    setTimeout(() => {
      if (this.ambientSource) {
        try {
          if ('stop' in this.ambientSource) {
            (this.ambientSource as any).stop();
          }
          this.ambientSource.disconnect();
        } catch (e) {}
        this.ambientSource = null;
      }
      this.isAmbientPlaying = false;
      this.currentAmbientType = 'none';
    }, 550);
  }

  getAmbientState() {
    return {
      isPlaying: this.isAmbientPlaying,
      type: this.currentAmbientType,
    };
  }
}

export const soundEngine = new SoundEngine();
