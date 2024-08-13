document.addEventListener("DOMContentLoaded", () => {

    const valtip = document.getElementById("idtipoproducto");
    const valmr = document.getElementById("idmarca");

    function cargarProductos() {
        fetch(`../../controllers/Producto.controller.php?operacion=getAll`)
            .then(response => response.json())
            .then(data => {
                const listaProductos = document.getElementById('lista-productos');
                console.log(data);
                listaProductos.innerHTML = '';
                data.forEach((producto, index) => {
                    const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${producto.marcas}</td>
                    <td>${producto.tipoproducto}</td>
                    <td>${producto.descripcion}</td>
                    <td>${producto.modelo}</td>
                </tr>
            `;
                    listaProductos.innerHTML += row;
                });
            })
    };

    (() => {
        fetch(`../../controllers/Marca.controller.php?operacion=getAll`)
            .then(response => response.json())
            .then(data => {
                const selectMarca = document.getElementById('idmarca');
                data.forEach(marca => {
                    const option = document.createElement('option');
                    option.value = marca.idmarcas;
                    option.text = marca.marcas;
                    selectMarca.appendChild(option);
                });
            })
    })();

    (() => {
        fetch(`../../controllers/Tipoproducto.controller.php?operacion=getAll`)
            .then(response => response.json())
            .then(data => {
                const selectMarca = document.getElementById('idtipoproducto');
                data.forEach(marca => {
                    const option = document.createElement('option');
                    option.value = marca.idtipoproducto;
                    option.text = marca.tipoproducto;
                    selectMarca.appendChild(option);
                });
            })
    })();

    document.getElementById("form-productos").addEventListener("submit", (event) => {
        event.preventDefault();
        console.log(valtip.value);
        console.log(valmr.value);

        const params = new FormData();
        params.append('operacion', 'addpr');
        params.append('descripcion', document.querySelector("#descripcion").value);
        params.append('modelo', document.querySelector("#modelo").value);
        params.append('idtipoproducto', valtip.value);
        params.append('idmarca', valmr.value);

        fetch('../../controllers/Producto.controller.php', {
                method: 'POST',
                body: params
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                cargarProductos();
            })
    });

    cargarProductos();

})