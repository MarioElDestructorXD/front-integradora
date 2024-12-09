<template>
    <div>
        <!-- Navbar -->
        <header>
            <nav class="navbar">
                <div class="navbar-container">
                    <a class="navbar-logo" href="#">
                        <img src="../../assets/logo.png" alt="Logo de FixyPro" />
                    </a>
                    <span class="navbar-brand">FixyPro</span>
                </div>
            </nav>
        </header>

        <!-- Contenido de Creación de Problema -->
        <div class="wrapper">
            <div class="title"><span>Crear Problema</span></div>
            <form @submit.prevent="handleSubmit">
                <div class="row">
                    <div class="input-icon-container">
                        <font-awesome-icon icon="pen" class="input-icon" />
                    </div>
                    <input v-model="titulo" type="text" placeholder="Título del problema" required />
                </div>

                <div class="row">
                    <div class="input-icon-container">
                        <font-awesome-icon icon="pen" class="input-icon" />
                    </div>
                    <input v-model="descripcion" type="text" placeholder="Descripción del problema" required />
                </div>

                <div class="row">
                    <div class="input-icon-container">
                        <font-awesome-icon icon="cloud-arrow-up" class="input-icon" />
                    </div>
                    <input type="file" accept="image/*" @change="handleFotoChange" />
                </div>

                <div class="row">
                    <div class="input-icon-container">
                        <font-awesome-icon icon="list" class="input-icon" />
                    </div>
                    <select v-model="categoria" required>
                        <option value="">Selecciona categoría</option>
                        <option value="CARPINTERIA">Carpintería</option>
                        <option value="PLOMERIA">Plomería</option>
                        <option value="ELECTRICIDAD">Electricidad</option>
                        <option value="ALBAÑILERIA">Albañilería</option>
                    </select>
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn-primary">Crear Problema</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import Swal from 'sweetalert2';

export default {
    name: 'AddProblem',
    data() {
        return {
            titulo: '',
            descripcion: '',
            foto: null,  // Almacena la foto seleccionada
            categoria: '',
        };
    },
    methods: {
        handleFotoChange(event) {
            // Captura la foto seleccionada por el usuario
            const file = event.target.files[0];

            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    // Convertimos la imagen a base64
                    this.foto = reader.result.split(',')[1]; // Tomamos solo la parte base64 (después de la coma)
                };
                reader.readAsDataURL(file);
            }
        },

        async handleSubmit() {
            const confirmCreate = await Swal.fire({
                title: '¿Estás seguro?',
                text: '¿Quieres crear este problema con los datos proporcionados?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, crear',
                cancelButtonText: 'No, cancelar',
            });

            if (!confirmCreate.isConfirmed) return;

            if (!this.titulo || !this.descripcion || !this.categoria) {
                await Swal.fire({
                    title: 'Campos incompletos',
                    text: 'Por favor, completa todos los campos.',
                    icon: 'warning',
                    confirmButtonText: 'Entendido',
                });
                return;
            }

            try {
                // Verificar si se ha seleccionado una foto
                if (!this.foto) {
                    await Swal.fire({
                        title: 'Foto faltante',
                        text: 'Por favor, sube una foto.',
                        icon: 'warning',
                        confirmButtonText: 'Entendido',
                    });
                    return;
                }

                // Crear el objeto JSON para enviar los datos
                const data = {
                    titulo: this.titulo,
                    descripcion: this.descripcion,
                    categoria: this.categoria,
                    fotografia: this.foto,  // Enviar foto como base64
                    estado: "ABIERTO",
                    usuario: {
                        id: 1,  // Asegúrate de usar el ID del usuario logueado
                    },
                    proveedor: null, // O el ID del proveedor si aplica
                };

                // Obtener el token de autenticación
                const token = localStorage.getItem('authToken');

                // Verificar si el token existe
                if (!token) {
                    await Swal.fire({
                        title: 'No autenticado',
                        text: 'Necesitas estar autenticado para crear un problema.',
                        icon: 'error',
                        confirmButtonText: 'Entendido',
                    });
                    return;
                }

                // Enviar la solicitud como JSON
                const response = await fetch('http://localhost:8080/api/problemas', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,  // Incluir el token JWT
                    },
                    body: JSON.stringify(data),  // Convertir los datos a JSON
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    await Swal.fire({
                        title: 'Error',
                        text: errorData.message || 'No se pudo crear el problema. Verifica tus permisos.',
                        icon: 'error',
                        confirmButtonText: 'Entendido',
                    });
                    return;
                }

                await Swal.fire({
                    title: 'Problema creado',
                    text: 'Tu problema ha sido creado exitosamente.',
                    icon: 'success',
                    confirmButtonText: 'Continuar',
                });

                this.$router.push('/problem');
            } catch (error) {
                await Swal.fire({
                    title: 'Error',
                    text: 'Error al conectarse al servidor.',
                    icon: 'error',
                    confirmButtonText: 'Entendido',
                });
            }
        }

    }
};
</script>


<style scoped>
/* Estilos CSS similares al formulario de registro */
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap");

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Poppins", sans-serif;
}

body {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    padding: 15px;
    background: #f8f8f8;
    overflow: hidden;
}

/* Navbar Styles */
header {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #003049;
    padding: 12px 0;
    z-index: 1000;
}

.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    width: 100%;
}

.navbar-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.navbar-logo img {
    width: 40px;
    height: auto;
}

.navbar-brand {
    color: white !important;
    font-size: 24px;
    font-weight: 600;
    text-align: center;
    flex-grow: 1;
}

/* Wrapper para el formulario */
.wrapper {
    width: 100%;
    max-width: 700px;
    min-width: 250px;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0px 4px 10px 1px rgba(0, 0, 0, 0.1);
    margin: 50px auto;
}

.wrapper .title {
    padding: 18px;
    background: #003049;
    border-radius: 5px 5px 0 0;
    color: #fff;
    font-size: 26px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
}

/* Estilo de formulario y sus campos */
.wrapper form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
    padding: 20px;
}

.wrapper form .row {
    position: relative;
}

.wrapper form .row input,
.wrapper form .row select,
.wrapper form .row textarea {
    height: 45px;
    width: 100%;
    outline: none;
    padding-left: 45px;
    border-radius: 5px;
    border: 1px solid lightgrey;
    font-size: 16px;
    transition: all 0.3s ease;
}

form .row input:focus,
form .row select:focus,
form .row textarea:focus {
    border-color: #003049;
}

form .row input::placeholder,
form .row select::placeholder,
form .row textarea::placeholder {
    color: #999;
}

/* Contenedor de icono */
.wrapper form .row .input-icon-container {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 35px;
}

.input-icon {
    color: #003049;
    font-size: 18px;
}

/* Botones de acción */
.form-actions {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.form-actions button {
    background-color: #003049;
    color: #fff;
    border: none;
    padding: 12px 30px;
    border-radius: 5px;
    font-size: 18px;
    cursor: pointer;
}

.form-actions button:hover {
    background-color: #022c47;
}
</style>
