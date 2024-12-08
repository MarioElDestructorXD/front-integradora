import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/Login.vue";
import Register from "../components/Register.vue";
import Problem from "../components/Problem.vue";

// Función para verificar si el usuario está autenticado
function isAuthenticated() {
  return !!localStorage.getItem("authToken");
}

const routes = [
  {
    path: "/",
    redirect: "/login", // Redirige al Login cuando accedes a la raíz
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next("/problem"); // Si el usuario está logueado, redirige a la página de problemas
      } else {
        next(); // Si no está autenticado, permite el acceso a Login
      }
    },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next("/problem"); // Si el usuario está logueado, redirige a la página de problemas
      } else {
        next(); // Si no está autenticado, permite el acceso a Register
      }
    },
  },
  {
    path: "/problem",
    name: "Problema",
    component: Problem,
    beforeEnter: (to, from, next) => {
      if (!isAuthenticated()) {
        next("/login"); // Si no está logueado, redirige al Login
      } else {
        next(); // Si está logueado, permite el acceso a la página de problemas
      }
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
