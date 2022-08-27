export default function animateCSS(
  node: HTMLElement,
  animation: string,
  rate = '1s',
  prefix = 'animate__'
): Promise<void> {
  return new Promise<void>((resolve) => {
    const animationName = `${prefix}${animation}`;
    node.style.setProperty('--animate-duration', rate);

    node.classList.add(`${prefix}animated`, animationName);
    function handleAnimationEnd(event: Event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve();
    }

    node.addEventListener('animationend', handleAnimationEnd, { once: true });
  });
}
