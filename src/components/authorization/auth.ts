export default () => {
  document.addEventListener('click', (e: Event) => {
    const target = e.target as HTMLElement;
    if (!target.matches('.popup__btn')) {
      return;
    }

    const popup = document.querySelector<HTMLElement>('.popup');

    if (popup?.getAttribute('data') !== target.getAttribute('data')) {
      return;
    }
    console.log('there');
  });
}