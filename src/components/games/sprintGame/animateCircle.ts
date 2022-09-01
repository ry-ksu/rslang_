const strokeDashoffset = (num: number) => 440 - (440 * num) / 100;

export default (perSent = 100): Animation => {
  const circle = document.querySelector('.circle-html') as HTMLElement;

  const animate = circle.animate(
    [{ strokeDashoffset: strokeDashoffset(0) }, { strokeDashoffset: strokeDashoffset(perSent) }],
    77000
  );


  animate.finished
    .then(() => {
      circle.style.strokeDashoffset = String(strokeDashoffset(perSent));
    })
    .catch((err) => console.log(err));

  return animate;
};
