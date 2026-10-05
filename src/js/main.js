import "../scss/main.scss";
import { GameApp } from "./gameapp";

document.addEventListener("DOMContentLoaded", () => {
  const app = new GameApp();
  app.init();
});
