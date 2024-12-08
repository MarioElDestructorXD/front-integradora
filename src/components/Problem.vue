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
                        <button @click="logout" class="logout-btn">
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            </nav>
        </header>

        <!-- Spinner de cierre de sesión -->
        <div v-if="isLoggingOut" class="spinner-overlay">
            <div class="spinner"></div>
            <p>Cerrando sesión...</p>
        </div>

        <!-- Contenedor principal para problemas y detalles -->
        <div class="main-container">
            <!-- Lista de Problemas -->
            <div id="problemas-container" class="problemas-container">
                <p v-if="loading">Cargando problemas...</p>
                <p v-else-if="!problemas.length">No tienes problemas registrados.</p>
                <div v-for="problema in problemas" :key="problema.id" class="problema-card"
                    @click="mostrarDetalle(problema)">
                    <div class="problema-info">
                        <div class="imagen">
                            <img :src="`data:image/jpeg;base64,${problema.fotografia}`" alt="Imagen del problema"
                                class="problema-imagen" @error="handleImageError" />
                        </div>
                        <div class="informacion">
                            <h3>{{ problema.titulo }}</h3>
                            <p><strong>Descripción:</strong> {{ problema.descripcion }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Detalles del problema seleccionado -->
            <div v-if="detalleVisible" class="detalle-container">
                <div id="detalle-info" class="detalle-info">
                    <h3>Detalles del Problema: {{ detalle.titulo }}</h3>
                    <p><strong>Descripción:</strong> {{ detalle.descripcion }}</p>
                    <img v-if="detalle.fotografia" :src="`data:image/jpeg;base64,${detalle.fotografia}`"
                        alt="Imagen del problema" class="detalle-imagen" />
                    <p v-else>No hay imagen disponible para este problema.</p>
                </div>
                <button @click="cerrarDetalle" class="close-btn">X</button>
            </div>
        </div>
    </div>
</template>

<script>
import Swal from 'sweetalert2';

export default {
    /* eslint-disable vue/multi-word-component-names */
    name: 'Problem',
    data() {
        return {
            problemas: [],
            loading: true,
            detalleVisible: false,
            detalle: {},
            username: '', // Nombre del usuario logueado
            userImage: '', // Imagen del usuario (si está disponible)
            isLoggingOut: false, // Estado para controlar el spinner
        };
    },
    created() {
        this.cargarProblemas();
        this.obtenerPerfilUsuario();
    },
    methods: {
        // Método para cargar los problemas del usuario logueado
        async cargarProblemas() {
            const token = localStorage.getItem('authToken');
            if (!token) {
                this.$router.push('/login');
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

        // Método para obtener el perfil del usuario
        async obtenerPerfilUsuario() {
            const token = localStorage.getItem('authToken');
            if (!token) {
                this.$router.push('/login');
                return;
            }

            try {
                const response = await fetch('http://localhost:8080/api/user/profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const user = await response.json();
                    this.username = user.name || 'Usuario'; // Usamos el campo 'name' para mostrar el nombre completo
                    if (user.photo) {
                        this.userImage = `data:image/jpeg;base64,${user.photo}`; // Si existe una foto de usuario
                    }
                } else {
                    console.error('Error al obtener perfil de usuario');
                    this.username = 'Usuario';
                }
            } catch (error) {
                console.error('Error al obtener perfil:', error);
                this.username = 'Usuario';
            }
        },

        // Mostrar detalles de un problema
        mostrarDetalle(problema) {
            this.detalle = problema;
            this.detalleVisible = true;
        },

        // Cerrar detalle de un problema
        cerrarDetalle() {
            this.detalleVisible = false;
        },

        // Manejo de errores en la carga de imágenes de problemas
        handleImageError(event) {
            event.target.src = 'placeholder.jpg';
            event.target.alt = 'Imagen no disponible';
        },

        async logout() {
            this.isLoggingOut = true; // Activar el estado de "cierre de sesión" para controlar el spinner

            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    // Mostrar el spinner de SweetAlert2 mientras hacemos la solicitud de cierre de sesión
                    Swal.fire({
                        title: 'Cerrando sesión...',
                        text: 'Por favor, espera un momento.',
                        allowOutsideClick: false,
                        didOpen: () => {
                            Swal.showLoading(); // Muestra el spinner
                        }
                    });
                    

                    // Realizar la solicitud de cierre de sesión al backend
                    const response = await fetch('http://localhost:8080/auth/logout', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    if (response.ok) {
                        // Si la respuesta es exitosa, limpiamos el localStorage
                        localStorage.removeItem('authToken');
                        localStorage.removeItem('username');

                        // Esperamos un pequeño retraso para asegurar que el spinner se vea antes de redirigir
                        setTimeout(() => {
                            Swal.close(); // Cerrar el spinner
                            this.$router.push('/login'); // Redirigir al login
                        }, 2000); // Esperar 2 segundos antes de redirigir (ajusta si lo necesitas)
                    } else {
                        // Si la respuesta no es exitosa
                        Swal.fire({
                            icon: 'error',
                            title: 'Error al cerrar sesión',
                            text: 'Por favor, intenta nuevamente.',
                            showConfirmButton: false,
                            timer: 3000
                        });
                    }
                } catch (error) {
                    console.error('Error al cerrar sesión:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al conectar',
                        text: 'No se pudo cerrar sesión.',
                        showConfirmButton: false,
                        timer: 3000
                    });
                } finally {
                    this.isLoggingOut = false; // Desactivar el spinner de la interfaz
                }
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'No hay sesión activa',
                    text: 'Por favor, inicia sesión primero.',
                    showConfirmButton: false,
                    timer: 3000
                });
            }
        }
    },
};
</script>

<style scoped>
/* Navbar */
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

/* Contenedor Principal */
.main-container {
    display: flex;
    justify-content: center;
    /* Centra el contenido horizontalmente */
    align-items: flex-start;
    /* Alinea los elementos al inicio en el eje vertical */
    padding: 20px;
    gap: 20px;
    max-width: 1200px;
    /* Limita el ancho máximo */
    margin: 0 auto;
    /* Centra el contenedor en la página */
}

/* Lista de Problemas */
.problemas-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 45%;
    padding: 20px;
    background-color: #f4f4f4;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.problema-card {
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    gap: 20px;
    cursor: pointer;
    transition: transform 0.3s ease;
    margin-bottom: 16px;
    width: 100%;
}

.problema-card:hover {
    transform: scale(1.05);
}

.problema-imagen {
    max-width: 150px;
    max-height: 100px;
    object-fit: cover;
    border-radius: 8px;
}

.informacion {
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 300px;
}

.informacion h3 {
    font-size: 18px;
    color: #333;
    margin-bottom: 10px;
}

.informacion p {
    font-size: 14px;
    color: #555;
    margin-bottom: 10px;
}

/* Detalles del Problema */
.detalle-container {
    width: 45%;
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
    position: relative;
}

.detalle-info {
    font-size: 14px;
    color: #333;
}

.detalle-info h3 {
    font-size: 24px;
    color: #333;
    margin-bottom: 15px;
}

.detalle-imagen {
    max-width: 100%;
    /* La imagen ocupará todo el ancho disponible */
    height: auto;
    max-height: 300px;
    /* Limita la altura máxima de la imagen */
    object-fit: contain;
    border-radius: 8px;
}

/* Botón Cerrar Detalle */
.close-btn {
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 10px 15px;
    font-size: 16px;
    cursor: pointer;
    border-radius: 8px;
    position: absolute;
    top: 15px;
    right: 15px;
}

.close-btn:hover {
    background-color: #c82333;
}

/* Spinner de cierre de sesión */
.spinner-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
}

.spinner {
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid #fff;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
