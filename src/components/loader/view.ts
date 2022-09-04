export default class ViewLoader {
  drawLoader() {
    const component = document.createElement('div');
    component.className = 'loader__wrapper';
    component.innerHTML = `<div class='loader'>
                            <div class="loader__gif"></div>
                          </div>`;
    document.body.after(component);
  }

  showLoader() {
    (document.querySelector('.loader__wrapper') as HTMLElement).style.visibility = 'visible';
  }

  hideLoader() {
    (document.querySelector('.loader__wrapper') as HTMLElement).style.visibility = 'hidden';
  }
}
