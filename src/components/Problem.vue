<template>
    <div class="contenedor-principal">
        <!-- Navbar -->
        <header>
            <nav class="navbar">
                <div class="navbar-container">
                    <div class="navbar-left">
                        <router-link to="/" class="navbar-logo">
                            <img src="../assets/logo.png" alt="Logo de FixyPro" />
                        </router-link>
                        <span class="navbar-brand">FixyPro</span>
                    </div>
                    <div class="navbar-right">
                        <span class="navbar-user">{{ username }}</span>
                        <button @click="logout" class="logout-btn">Cerrar sesión</button>
                    </div>
                </div>
            </nav>
        </header>

        <!-- Lista de Problemas -->
        <div id="problemas-container" class="problemas-container">
            <p v-if="loading">Cargando problemas...</p>
            <p v-else-if="!problemas.length">No tienes problemas registrados.</p>
            <div v-for="problema in problemas" :key="problema.id" class="problema-card"
                @click="mostrarDetalle(problema)">
                <div class="informacion">
                    <h3>{{ problema.titulo }}</h3>
                    <p><strong>Descripción:</strong> {{ problema.descripcion }}</p>
                </div>
                <div v-if="problema.fotografia" class="imagen">
                    <img :src="problema.fotografia" alt="Imagen del problema" class="problema-imagen"
                        @error="handleImageError" />
                </div>
            </div>
        </div>

        <!-- Detalles del problema seleccionado -->
        <div v-if="detalleVisible" class="detalle-container">
            <div id="detalle-info" class="detalle-info">
                <h3>Detalles del Problema: {{ detalle.titulo }}</h3>
                <p><strong>Descripción:</strong> {{ detalle.descripcion }}</p>
                <img v-if="detalle.fotografia" :src="detalle.fotografia" alt="Imagen del problema"
                    class="problema-imagen" />
                <p v-else>No hay imagen disponible para este problema.</p>
            </div>
            <button @click="cerrarDetalle" class="close-btn">X</button>
        </div>
    </div>
</template>

<script>
/* eslint-disable vue/multi-word-component-names */
export default {
    name: 'Problem',
    data() {
        return {
            problemas: [],
            loading: true,
            detalleVisible: false,
            detalle: {},
            username: '',
        };
    },
    created() {
        this.cargarProblemas();
        this.username = localStorage.getItem('username') || 'Usuario';
    },
    methods: {
        // Método para cargar los problemas
        async cargarProblemas() {
            const token = localStorage.getItem('authToken');
            if (!token) {
                this.$router.push('/login'); // Redirige a la página de login si no hay token
                return;
            }

            try {
                const response = await fetch('http://localhost:8080/api/problemas/mis-problemas', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                this.problemas = data || [];
                this.loading = false;
            } catch (error) {
                console.error('Error al cargar problemas:', error);
                this.loading = false;
            }
        },

        // Mostrar detalles de un problema
        mostrarDetalle(problema) {
            this.detalle = problema;
            this.detalleVisible = true;
        },

        // Cerrar el panel de detalles
        cerrarDetalle() {
            this.detalleVisible = false;
        },

        // Manejar error de imagen
        handleImageError(event) {
            event.target.src = 'placeholder.jpg';
            event.target.alt = 'Imagen no disponible';
        },

        // Método para cerrar sesión
        logout() {
            const token = localStorage.getItem('authToken');
            if (token) {
                fetch('http://localhost:8080/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                })
                    .then((response) => {
                        if (response.ok) {
                            localStorage.removeItem('authToken');
                            localStorage.removeItem('username');
                            this.$router.push('/login'); // Redirige al login
                        } else {
                            alert('Error al cerrar sesión');
                        }
                    })
                    .catch((error) => {
                        console.error('Error al cerrar sesión:', error);
                        alert('No se pudo cerrar sesión');
                    });
            } else {
                alert('No hay sesión activa');
            }
        },
    },
};
</script>

<style scoped>
/* Estilo común para navbar de login y problemas */
.navbar {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #003049;
    padding: 12px 0;
    z-index: 1000;
}

.navbar-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    width: 100%;
}

.navbar-left {
    display: flex;
    align-items: center;
}

.navbar-logo img {
    width: 40px;
    height: auto;
}

.navbar-brand {
    color: white;
    font-size: 24px;
    font-weight: 600;
    text-align: center;
    flex-grow: 1;
}

.navbar-right {
    display: flex;
    align-items: center;
}

.navbar-user {
    color: white;
    font-size: 16px;
    margin-right: 20px;
}

.logout-btn {
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 8px 12px;
    font-size: 14px;
    cursor: pointer;
    border-radius: 5px;
}

.logout-btn:hover {
    background-color: #c82333;
}

/* Estilo para el contenedor de los problemas */
.problemas-container {
    width: 50%;
    padding: 20px;
    overflow-y: auto;
    background-color: #f4f4f4;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

/* Otros estilos permanecen igual */
</style>
