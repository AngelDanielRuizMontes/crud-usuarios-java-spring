"use strict";

let usuarioSeleccionado = null;

async function solicitud(url, options = {}) {
    try {
        let resultado = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
            },
            ...options
        });
        if (!resultado.ok) {
            throw new Error(`HTTP error! status: ${resultado.status}`);
        }
        const data = await resultado.text();
        if (data.trim() !== "") {
            return JSON.parse(data);
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

        function mostrar(data) {
            console.log(JSON.stringify(data, null, 2));

            const tableBody = document.querySelector('#userTable tbody');
            tableBody.innerHTML = '';

            data.forEach(item => {
                const row = document.createElement('tr');

                row.addEventListener('click', () => mostrarFormularioEdicion(item));

                const cellName = document.createElement('td');
                cellName.textContent = item.firstName;
                row.appendChild(cellName);

                const celllastName = document.createElement('td');
                celllastName.textContent = item.lastName;
                row.appendChild(celllastName);

                const cellEmail = document.createElement('td');
                cellEmail.textContent = item.email;
                row.appendChild(cellEmail);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Borrar';
                deleteButton.classList.add('btn','btn-danger');
                deleteButton.addEventListener('click', async () => {
                await borrarUsuario(item.id);
                });
                const cellDeleteButton = document.createElement('td');
                cellDeleteButton.appendChild(deleteButton);
                row.appendChild(cellDeleteButton);

                tableBody.appendChild(row);
            });
        }

        function mostrarFormularioEdicion(usuario) {
            usuarioSeleccionado = usuario;

            document.getElementById('editfirstName').value = usuario.firstName;
            document.getElementById('editlastName').value = usuario.lastName;
            document.getElementById('editEmail').value = usuario.email;

            document.getElementById('editUserForm').classList.remove('d-none');
        }

        async function actualizarUsuario(event) {
            event.preventDefault();

            const NewfirstName = document.getElementById('editfirstName').value;
            const NewlastName = document.getElementById('editlastName').value;
            const Newemail = document.getElementById('editEmail').value;

            const usuarioActualizado = {
                id: usuarioSeleccionado.id,
                firstName: NewfirstName,
                lastName: NewlastName,
                email: Newemail
            }

            let url = `http://localhost:8080/person/${usuarioSeleccionado.id}`;
            try {
                await solicitud(url, {
                    method: 'PUT',
                    body: JSON.stringify(usuarioActualizado)
                });
                carga();
            } catch (error) {
                console.error('Error al actualizar el usuario:', error);
            }
        }

        async function carga() {
            let url = `http://localhost:8080/person/lista`;
            try {
                const resultado = await solicitud(url);
                mostrar(resultado);
            } catch (error) {
                console.error('Error al cargar los datos:', error);
            }
        }

        async function agregarUsuario(event) {
            event.preventDefault();

            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;

            const nuevoUsuario = {
                firstName: firstName,
                lastName: lastName,
                email: email
            };

            let url = `http://localhost:8080/person`;
            try {
                await solicitud(url, {
                    method: 'POST',
                    body: JSON.stringify(nuevoUsuario)
                });
                carga();
            } catch (error) {
                console.error('Error al agregar el usuario:', error);
            }
        }

        async function borrarUsuario(id) {
            let url = `http://localhost:8080/person/${id}`;
            try {
                await solicitud(url, {
                    method: 'DELETE'
                });
                carga();
            } catch (error) {
                console.error('Error al borrar el usuario:', error);
            }
        }

        document.addEventListener('DOMContentLoaded', (event) => {
            carga();
            document.getElementById('addUserForm').addEventListener('submit', agregarUsuario);
        });

        document.addEventListener('DOMContentLoaded', (event) => {
            carga();
            document.getElementById('editUserForm').addEventListener('submit', actualizarUsuario);
        });