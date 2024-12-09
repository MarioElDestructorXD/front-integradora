<template>
    <div>
        <!-- Navegación superior -->
        <header>
            <NavBar />
        </header>

        <!-- Perfil -->
        <div class="container-fluid full-height">
            <div class="mt-5"></div>
            <div class="card profile-card full-width">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-4 profile-section text-center">
                            <div class="profile-img position-relative mx-auto">
                                <span class="edit-icon" @click="openModal('editarImagenModal')">
                                    <i class="bi bi-pencil-fill"></i>
                                </span>
                            </div>
                            <h5>{{ profile.name }}</h5>
                        </div>
                        <div class="col-md-8">
                            <div class="info-section card">
                                <div class="card-body">
                                    <h5>Información Personal</h5>
                                    <form>
                                        <div class="row mb-3">
                                            <div v-for="(field, key) in personalInfo" :key="key" class="col-md-4">
                                                <label :for="key" class="form-label">{{ field.label }}</label>
                                                <input type="text" class="form-control" :id="key" :value="field.value"
                                                    disabled />
                                            </div>
                                        </div>
                                        <button type="button" class="btn orange-btn"
                                            @click="openModal('editarInfoModal')">Editar</button>
                                    </form>
                                </div>
                            </div>
                            <div class="address-section card mt-4">
                                <div class="card-body">
                                    <h5>Información de su Trabajo</h5>
                                    <form>
                                        <div class="mb-3">
                                            <label for="tipoTrabajo" class="form-label">Tipo de trabajo</label>
                                            <input type="text" class="form-control" id="tipoTrabajo"
                                                :value="workInfo.tipo" disabled />
                                        </div>
                                        <div class="mb-3">
                                            <label for="descripcionTrabajo" class="form-label">Descripción</label>
                                            <input type="text" class="form-control" id="descripcionTrabajo"
                                                :value="workInfo.descripcion" disabled />
                                        </div>
                                        <button type="button" class="btn orange-btn"
                                            @click="openModal('editarTrabajoModal')">Editar</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modals -->
    </div>
</template>

<script>
import NavBar from '../NavBar.vue';


export default {
    /* eslint-disable vue/multi-word-component-names */
    components: {
        NavBar
    },
    name: 'Profile',
    data() {
        return {
            searchQuery: '',
            isDrawerOpen: false,
            modals: {
                editarInfoModal: false,
                editarTrabajoModal: false,
                editarImagenModal: false,
            },
            profile: {
                name: 'Sheila Camila Sanchez Flores',
            },
            personalInfo: {
                nombre: { label: 'Nombre', value: 'Sheila' },
                apellidoPaterno: { label: 'Apellido Paterno', value: 'Sanchez' },
                apellidoMaterno: { label: 'Apellido Materno', value: 'Flores' },
            },
            workInfo: {
                tipo: 'Carpintería',
                descripcion: 'Soy una carpintera que te puede ayudar en cualquier problema',
            },
            dropdowns: [
                { label: 'Ubicación', options: ['ubi 1', 'ubi 2', 'ubi 3'] },
                { label: 'Categoría', options: ['Carpintería', 'Plomería', 'Electricista'] },
                { label: 'Problema', options: ['Carpintería', 'Plomería', 'Electricista'] },
            ],
            menuItems: [
                { label: 'Perfil', icon: 'account_circle' },
                { label: 'Historial', icon: 'history' },
                { label: 'Mapa', icon: 'location_on' },
            ],
        };
    },
    methods: {
        openDrawer() {
            this.isDrawerOpen = !this.isDrawerOpen;
        },
        handleDropdownChange(label, value) {
            console.log(`${label} changed to ${value}`);
        },
        navigate(label) {
            console.log(`Navigating to ${label}`);
        },
        handleLogout() {
            console.log('Logout clicked');
        },
        openModal(modal) {
            this.modals[modal] = true;
        },
        closeModal(modal) {
            this.modals[modal] = false;
        },
    },
};
</script>

<style scoped>
agrega el css

/* Estilos generales */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Arial, sans-serif;
}

html,
body {
    height: 100%;
    margin: 0;
}

.h1 {
    display: block;
    font-size: 2em;
    margin-block-start: 0.67em;
    margin-block-end: 0.67em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
    unicode-bidi: isolate;
}

/* Navbar */
.navbar {
    display: flex;
    align-items: center;
    background-color: #ffb300;
    padding: 5px 10px;
    /* Reducir el padding */
    font-size: 10px;
    /* Reducir el tamaño de la fuente */
}

.menu-btn {
    background: none;
    border: none;
    font-size: 20px;
    /* Reducir el tamaño del ícono */
    cursor: pointer;
    margin-right: 8px;
    /* Reducir margen entre el botón y el texto */
}

.search-container {
    display: flex;
    flex-grow: 1;
    margin: 0 8px;
    /* Reducir el margen */
}

.search-container input {
    width: 100%;
    padding: 6px;
    /* Reducir el padding */
    border-radius: 5px;
    /* Ajustar el radio para hacerlo más pequeño */
    border: 1px solid #ddd;
    font-size: 14px;
    /* Reducir tamaño de la fuente */
}

.search-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 20px;
    /* Reducir el tamaño del ícono */
}

.dropdown select {
    margin-left: 8px;
    /* Reducir margen */
    padding: 6px;
    /* Reducir padding */
    border-radius: 5px;
    border: 1px solid #ddd;
    background-color: white;
    font-size: 14px;
    /* Reducir tamaño de la fuente */
}

/* Drawer estilos */
.drawer {
    position: fixed;
    top: 0;
    left: -250px;
    height: 100%;
    width: 250px;
    /* Ajusta el ancho según tu diseño */
    background-color: #ffb300;
    /* Color del drawer */
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    /* Sombra para distinguirlo del contenido */
    display: flex;
    flex-direction: column;
    transform: translateX(-100%);
    /* Oculto fuera del viewport */
    transition: transform 0.3s ease;
    /* Animación suave para abrir/cerrar */
    z-index: 1050;
    /* Asegura que esté por encima del contenido */
}

/* Drawer visible */
.drawer.open {
    transform: translateX(0);
    /* Se muestra en pantalla */
}

/* Contenedor principal cuando el drawer está abierto */
body.drawer-open {
    overflow: hidden;
    /* Evita que la página se desplace cuando el drawer está abierto */
}

.container-fluid.full-height {
    margin-left: 0;
    transition: margin-left 0.3s ease;
    /* Suave deslizamiento si el diseño ajusta el contenido */
}

.drawer-header {
    padding: 12px;
    font-size: 18px;
    /* Reducir tamaño del texto */
    background-color: orange;
    color: white;
}

.drawer ul {
    list-style: none;
    padding: 12px;
}

.drawer ul li {
    margin: 10px 0;
    /* Reducir margen */
}

.drawer ul li a {
    display: flex;
    align-items: center;
    gap: 6px;
    /* Reducir el espacio entre los íconos y el texto */
    text-decoration: none;
    color: black;
    font-size: 14px;
    /* Reducir tamaño de la fuente */
}

.drawer-footer {
    margin-top: auto;
    padding: 8px;
    display: flex;
    justify-content: center;
}

.logout-button {
    background-color: red;
    color: white;
    border: none;
    padding: 6px 14px;
    /* Reducir padding */
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    /* Reducir tamaño de la fuente */
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
}

.logout-button:hover {
    background-color: red;
}

.drawer.open {
    left: 0;
}


.profile-section {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.profile-img {
    width: 100%;
    max-width: 450px;
    height: 450px;
    border-radius: 50%;
    background-color: #f0f0f0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 48px;
    color: #6c757d;
    margin-bottom: 15px;
    background-size: cover;
    background-position: center;
    position: relative;
}

.edit-icon {
    position: absolute;
    bottom: 5px;
    right: 35px;
    background-color: rgba(255, 255, 255);
    border-radius: 50%;
    padding: 12px;
    border: 5px solid #ccc;
    font-size: 50px;
    color: #6c757d;
}

.edit-icon:hover {
    cursor: pointer;
}

.orange-btn {
    background-color: #ffb100;
    color: white;
}

.info-section,
.address-section {
    border: 1px solid #e0e0e0;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
    background-color: white;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.full-width {
    width: 100%;
}

@media (max-width: 768px) {
    .profile-img {
        max-width: 300px;
        height: 300px;
    }
}
</style>