document.addEventListener("DOMContentLoaded", () => {

    const nombreProducto = document.querySelector("#txtNombreProducto");
    const precioActual = document.querySelector("#txtPrecioActual");
    const tipoProducto = document.querySelector("#slcTipoProducto");
    const marca = document.querySelector("#slcMarca");

    document.getElementById("form-productos").addEventListener("submit", (event) => {
        event.preventDefault();
        console.log(nombreProducto.value);
        console.log(precioActual.value);
        console.log(tipoProducto.value);
        console.log(marca.value);

        const params = new FormData();
        params.append('operacion', 'add');
        params.append('tipo_producto', tipoProducto.value);
        params.append('nombreProducto', nombreProducto.value);
        params.append('precio_actual', precioActual.value);
        params.append('marca', marca.value);

        fetch('../controllers/Productos.controllers.php', {
            method: 'POST',
            body: params
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
    });
})