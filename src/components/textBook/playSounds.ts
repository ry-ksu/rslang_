export default function playSounds(sounds: HTMLAudioElement[]) {
  try {
    let paused = true;
    let i = 0;
    let playPromise: Promise<void>;
    const playPause = (sound: HTMLAudioElement) => {
      if (paused && sound.paused) {
        sound.play().catch((error) => console.error(error));
        paused = false;
      } else {
        if (playPromise !== undefined) {
          playPromise.then(() => sound.pause()).catch((error) => console.error(error));
        }
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
  } catch {
    console.log('');
  }
}
