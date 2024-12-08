// vue.config.js
module.exports = {
  devServer: {
    port: 3000, // Cambia a cualquier puerto que desees (3000 es solo un ejemplo)
    proxy: {
      "/api": {
        target: "http://localhost:8080", // Redirige todas las peticiones /api a tu backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
};
