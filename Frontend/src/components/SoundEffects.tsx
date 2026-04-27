import { useEffect } from 'react';

const HOVER_SOUND_URL = 'https://res.cloudinary.com/dqp0zkagb/video/upload/v1777283617/bisonix_assets/audio/hover_sound.mp3';
const CLICK_SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3';

// Preload audio objects
const hoverAudio = new Audio(HOVER_SOUND_URL);
hoverAudio.volume = 0.05;
const clickAudio = new Audio(CLICK_SOUND_URL);
clickAudio.volume = 0.1;

export default function SoundEffects() {
  useEffect(() => {
    const playSound = (audio: HTMLAudioElement) => {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('a') || target.closest('li')) {
        playSound(clickAudio);
      }
    };

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('a') || target.closest('li')) {
        playSound(hoverAudio);
      }
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('mouseover', handleHover);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('mouseover', handleHover);
    };
  }, []);

  return null;
}
