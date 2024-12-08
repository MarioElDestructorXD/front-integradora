<template>
    <div class="contenedor-principal">
        <!-- Navbar -->
        <header>
            <NavBar />
        </header>

        <!-- Contenedor principal para problemas y detalles -->
        <!-- Lista de Problemas -->
        <div id="problemas-container" class="problemas-container">
            <p v-if="loading">Cargando problemas...</p>
            <p v-else-if="!problemas.length">No tienes problemas registrados.</p>
            <div v-for="problema in problemas" :key="problema.id" class="problema-card"
                @click="mostrarDetalle(problema)">
                <div class="problema-info">
                    <div class="imagen">
                        <img v-if="problema.fotografia" :src="`data:image/jpeg;base64,${problema.fotografia}`"
                            alt="Imagen del problema" class="problema-imagen" @error="handleImageError" />
                    </div>
                    <div class="informacion">
                        <h3>{{ problema.titulo }}</h3>
                        <p><strong>Descripción:</strong> {{ problema.descripcion }}</p>
                    </div>
                </div>
            </div>
        </div>


        <!-- Modal para mostrar los detalles del problema -->
        <div v-if="detalleVisible" class="modal-overlay" @click="cerrarDetalle">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <h3>{{ detalle.titulo }}</h3>
                    <button @click="cerrarDetalle" class="close-btn">×</button>
                </div>
                <div class="modal-body">
                    <p><strong>Descripción:</strong> {{ detalle.descripcion }}</p>
                    <img v-if="detalle.fotografia" :src="`data:image/jpeg;base64,${detalle.fotografia}`"
                        alt="Imagen del problema" class="detalle-imagen" />
                    <p v-else>No hay imagen disponible para este problema.</p>
                </div>
                <div class="modal-footer">
                    <button @click="cerrarDetalle" class="close-btn">Cerrar</button>
                </div>
            </div>
        </div>

        <button class="floating-button" @click="abrirFormulario">
            <font-awesome-icon icon="plus" class="button-icon" />
        </button>
    </div>
</template>

<script>
import NavBar from '../NavBar.vue';

export default {
    components: {
        NavBar
    },
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

        abrirFormulario() {
            this.$router.push('/addproblem');
        },
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


    },
};
</script>

<style scoped>


/* Contenedor Principal */
.main-container {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
    /* Permite el ajuste de los cards en filas */
    gap: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

/* Lista de Problemas */
.problemas-container {
    display: flex;
    flex-wrap: wrap;
    /* Permite el ajuste de los elementos */
    gap: 20px;
    /* Espacio entre los cards */
    width: 100%;
    padding: 20px;
    justify-content: flex-start;
    margin-top: 2%;
}

/* Estilo para cada card de problema */
.problema-card {
    display: flex;
    flex-direction: column;
    /* Los elementos dentro del card se organizan de manera vertical */
    align-items: center;
    background-color: #e7e7e7;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    gap: 10px;
    /* Espacio entre los elementos dentro del card */
    cursor: pointer;
    transition: transform 0.3s ease;
    margin-bottom: 16px;
    width: 100%;
    max-width: 280px;
    /* Limita el tamaño máximo de los cards */
}

.problema-card:hover {
    transform: scale(1.05);
}

.problema-imagen {
    max-width: 100px;
    max-height: 75px;
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


/* Modal */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
}

.modal-content {
    background-color: #fff;
    border-radius: 8px;
    padding: 15px;
    max-width: 600px;
    width: 80%;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 15px;
    overflow-y: auto;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f1f1f1;
    padding-bottom: 8px;
}

.modal-header h3 {
    margin: 0;
    font-size: 1.2rem;
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.2rem;
    color: #333;
    cursor: pointer;
}

.close-btn:hover {
    color: #dc3545;
}

.modal-body {
    font-size: 0.9rem;
    line-height: 1.4;
}

.detalle-imagen {
    max-width: 200px;
    height: auto;
    object-fit: contain;
    border-radius: 8px;
    margin-top: 15px;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
}

.modal-footer .close-btn {
    background-color: #007bff;
    color: white;
    padding: 8px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.9rem;
}

.modal-footer .close-btn:hover {
    background-color: #0056b3;
}

/* Botón flotante */
.floating-button {
    position: fixed;
    bottom: 15px;
    right: 15px;
    background-color: #007bff;
    color: white;
    border: none;
    padding: 12px;
    border-radius: 50%;
    font-size: 20px;
    cursor: pointer;
}

.floating-button:hover {
    background-color: #0056b3;
}



</style>
