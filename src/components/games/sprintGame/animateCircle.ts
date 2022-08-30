const strokeDashoffset = (num: number) => 440 - (440 * num) / 100;

export default (perSent = 100): void => {
  const circle = document.querySelector('.circle-html') as HTMLElement;
  const progressBar = document.querySelector('.progressbar__text') as HTMLElement;

  const animate = circle.animate([
    { strokeDashoffset: strokeDashoffset(0) },
    { strokeDashoffset: strokeDashoffset(perSent) },
  ], 77000);

  animate.finished.then(() => {
    circle.style.strokeDashoffset = String(strokeDashoffset(perSent));
  }).catch((err) => console.log(err));

  let count = +(progressBar.dataset.count as string);
  const progress = setInterval(() => {
    count -= 1;
    progressBar.innerHTML = String(count);
  }, 1000);
  setTimeout(() => clearInterval(progress), 60000);
};