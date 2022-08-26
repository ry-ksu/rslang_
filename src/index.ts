import ControllerTextBook from "./components/textBook/controller";

const tb = new ControllerTextBook();
tb.getData().catch((err) => console.log(err));

console.log('VICTORY');
