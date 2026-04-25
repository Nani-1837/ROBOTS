import { useEffect } from 'react';

const CLICK_SOUND = 'https://assets.mixkit.co/active_storage/sfx/2567/2567-preview.mp3'; // Heavy Mech Click
const HOVER_SOUND = 'https://assets.mixkit.co/active_storage/sfx/2541/2541-preview.mp3'; // Servo/Vibration Hum

export default function SoundEffects() {
  useEffect(() => {
    const playSound = (url: string, volume = 1.0) => {
      const audio = new Audio(url);
      audio.volume = volume;
      audio.play().catch(() => {});
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('a') || target.closest('li')) {
        playSound(CLICK_SOUND, 1.0); // Full volume click
      }
    };

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Target navbar links, buttons, and list items
      if (target.closest('button') || target.closest('a') || target.closest('li')) {
        playSound(HOVER_SOUND, 1.0); // Maximum volume for robotic vibration hover
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
