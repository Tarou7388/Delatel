document.addEventListener("DOMContentLoaded", () => {

    const marca = document.querySelector("#slcMarca");
    const precioActual = document.querySelector("#txtPrecioActual");
    const tipoProducto = document.querySelector("#slcTipoProducto");
    const Modelo = document.querySelector("#txtModelo");
    const CodigoBarras = document.querySelector("#txtCodigoBarras");

    document.getElementById("form-productos").addEventListener("submit", (event) => {
        event.preventDefault();
        console.log(marca.value);
        console.log(precioActual.value);
        console.log(tipoProducto.value);
        console.log(Modelo.value);
        console.log(CodigoBarras.value)

        const params = new FormData();
        params.append('operacion', 'add');
        params.append('tipo_producto', tipoProducto.value);
        params.append('marca', marca.value);
        params.append('precio_actual', precioActual.value);
        params.append('modelo', Modelo.value);
        params.append('Codigo_Barras',CodigoBarras.value)

        fetch('../controllers/Productos.controllers.php', {
            method: 'POST',
            body: params
        })
            .then(response => response.text())
            .then(data => {
                console.log(data);
            })
    });
})