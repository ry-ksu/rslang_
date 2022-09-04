export default function playSounds(sounds: HTMLAudioElement[]) {
  let paused = true;
  let i = 0;
  const playPause = (sound: HTMLAudioElement) => {
    if (paused) {
      sound.play().catch((error) => console.error(error));
      paused = false;
    } else {
      sound.pause();
      paused = true;
    }
  };
  const ended = () => {
    if (i < sounds.length - 1) {
      i += 1;
      paused = true;
      playPause(sounds[i]);
    }
  };
  sounds.forEach((item) => {
    item.addEventListener('ended', ended);
    playPause(sounds[i]);
  });
}
