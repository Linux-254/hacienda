import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Flame } from 'lucide-react';
import { siteConfig } from '@/config/site.config';

export function LiveGrill() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  // Canvas ember particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    type Ember = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      decay: number;
      hue: number;
    };

    const embers: Ember[] = [];
    const maxEmbers = 45;

    const createEmber = (bottomOnly = true): Ember => ({
      x: Math.random() * width,
      y: bottomOnly ? height + Math.random() * 20 : Math.random() * height,
      vx: (Math.random() - 0.5) * 1.2,
      vy: -1.2 - Math.random() * 2.2,
      size: 1 + Math.random() * 2.5,
      alpha: 0.6 + Math.random() * 0.4,
      decay: 0.004 + Math.random() * 0.008,
      hue: Math.random() > 0.4 ? 38 + Math.random() * 15 : 18 + Math.random() * 15, // Golden-amber to fire-orange
    });

    for (let i = 0; i < maxEmbers; i++) {
      embers.push(createEmber(false));
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw embers
      for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        e.x += e.vx + Math.sin(e.y * 0.02) * 0.4;
        e.y += e.vy;
        e.alpha -= e.decay;

        if (e.alpha <= 0 || e.y < -10) {
          embers[i] = createEmber(true);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${e.hue}, 90%, 60%, ${e.alpha})`;
        ctx.shadowColor = `hsla(${e.hue}, 100%, 50%, 0.8)`;
        ctx.shadowBlur = e.size * 3;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Web Audio subtle charcoal sizzle sound
  const toggleSound = () => {
    if (isPlayingSound) {
      if (audioCtxRef.current) {
        audioCtxRef.current.suspend();
      }
      setIsPlayingSound(false);
      return;
    }

    try {
      if (!audioCtxRef.current) {
        const AudioContextClass =
          window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        // Generate pink noise filtered to mimic gentle charcoal crackle
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          data[i] = (b0 + b1 + b2) * 0.08;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 850;
        filter.Q.value = 1.2;

        const gain = ctx.createGain();
        gain.gain.value = 0.18;

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start();
        noiseNodeRef.current = noise;
      } else {
        audioCtxRef.current.resume();
      }
      setIsPlayingSound(true);
    } catch {
      // Audio autoplay restrictions or unsupported
    }
  };

  const burstEmbers = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // visual feedback ripple
  };

  return (
    <div className="relative overflow-hidden border border-[#C9A24B]/20 bg-[#160E0A]">
      {/* Background Grill Fire Imagery with Deep Heat Vignette */}
      <div className="relative aspect-[16/9] w-full max-h-[560px] overflow-hidden">
        <img
          src={siteConfig.images.grill}
          alt="Charcoal embers glowing on the Hacienda grill"
          loading="lazy"
          className="h-full w-full object-cover object-center brightness-[0.78] contrast-[1.12]"
        />
        {/* Hearth Warm Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B09] via-transparent to-[#0D0B09]/80" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#0D0B09]/40 to-[#0D0B09]" />

        {/* Ember Canvas Layer */}
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 h-full w-full"
        />

        {/* Live Grill Status & Controls */}
        <div className="absolute inset-x-6 top-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 rounded-full bg-[#D9822B] animate-pulse" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A24B]">
              Acacia Charcoal Hearth
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleSound}
              aria-label={isPlayingSound ? 'Mute grill fire sound' : 'Unmute grill fire sound'}
              className="flex min-h-[38px] items-center gap-2 border border-[#C9A24B]/30 bg-[#0D0B09]/80 px-3 py-1.5 text-[10px] uppercase tracking-widest text-[#F3E9D2] backdrop-blur-md transition hover:border-[#C9A24B] hover:text-[#C9A24B]"
            >
              {isPlayingSound ? (
                <>
                  <Volume2 size={13} className="text-[#C9A24B]" />
                  <span>Mute Hearth</span>
                </>
              ) : (
                <>
                  <VolumeX size={13} className="text-[#F3E9D2]/60" />
                  <span>Sizzle Audio</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Bottom Narrative Caption */}
        <div className="absolute inset-x-6 bottom-6 sm:inset-x-10 sm:bottom-10">
          <p className="font-cormorant text-2xl italic text-[#F3E9D2] sm:text-3xl">
            "A good table begins at the fire."
          </p>
          <p className="mt-2 max-w-xl text-xs leading-6 text-[#F3E9D2]/65">
            Slow coals, hardwood smoke, and thick cuts carved only when ordered.
            No microwave shortcuts, no hurried fire.
          </p>
        </div>
      </div>
    </div>
  );
}
