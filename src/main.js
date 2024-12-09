import { createApp } from "vue";
import App from "./App.vue";
import "bootstrap/dist/css/bootstrap.min.css";
import router from "../src/router/router";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faUser,
  faPhone,
  faEnvelope,
  faLock,
  faUserShield,
  faCamera,
  faPlus,
  faCloudArrowUp,
  faPen,
  faList,
  faCompass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
  faUser,
  faPhone,
  faEnvelope,
  faLock,
  faUserShield,
  faCamera,
  faPlus,
  faCloudArrowUp,
  faPen,
  faList,
  faCompass
);

createApp(App)
  .component("font-awesome-icon", FontAwesomeIcon)
  .use(router)
  .mount("#app");
