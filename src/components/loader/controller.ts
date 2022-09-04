import ViewLoader from "./view";

export default class ControllerLoader {
  viewLoader: ViewLoader;

  constructor () {
    this.viewLoader = new ViewLoader();
  }

  getData() {
    this.viewLoader.drawLoader();
  }

  showLoader() {
    this.viewLoader.showLoader();
  }

  hideLoader() {
    this.viewLoader.hideLoader();
  }
}