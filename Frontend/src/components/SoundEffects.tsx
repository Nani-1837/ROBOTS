import { useEffect } from 'react';

const CLICK_SOUND = 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'; // Lighter Pop Sound
const HOVER_SOUND = 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'; // Subtle hover

export default function SoundEffects() {
  useEffect(() => {
    const playSound = (url: string, volume = 0.1) => {
      const audio = new Audio(url);
      audio.volume = volume;
      audio.play().catch(() => {});
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('a') || target.closest('li')) {
        playSound(CLICK_SOUND, 0.1); // Reduced volume click
      }
    };

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('a') || target.closest('li')) {
        playSound(HOVER_SOUND, 0.05); // Very subtle hover
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
