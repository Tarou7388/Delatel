<?php require_once '../../header.php'; ?>
<div class="container-fluid px-4">
    <h1 class="mt-4">Reporte</h1>
    <ol class="breadcrumb mb-4">
        <li class="breadcrumb-item active">Reporte PDF del Producto</li>
    </ol>
    <div class="card mb-4">
        <div class="card-header">
                Complete los datos
        </div>
        <div class="card-body">

            <label for="idtipoproducto" class="form-label">Seleccione un Producto:</label>

            <div class="input-group">
                <select name="idtipoproducto" id="idtipoproducto" class="form-select">
                    <option value="">Seleccione</option>
                </select>
                <button type="button" class="btn btn-outline-primary" id="generar"><i class="fa-solid fa-file-export"></i> Generar PDF</button>
            </div>

        </div>   
                
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script>
    document.addEventListener("DOMContentLoaded", () => {

        //Referencia al select y al boton
        const lista = document.querySelector("#idtipoproducto");
        const boton = document.querySelector("#generar");

        //Funcion autoejecutable
        (() => {
            fetch(`../../controllers/tipoProducto.controller.php?operacion=getAll`)
                .then(response => response.json())
                .then( data => {
                    data.forEach(row => {
                        const tagOption = document.createElement("option")
                        tagOption.value = row.idtipoproducto
                        tagOption.innerHTML = row.tipoproducto
                        lista.appendChild(tagOption)
                    });
                })
                .catch( e => { console.error(e) })
        })();

        //Obtener el valor de la lista
        lista.addEventListener("change", () => {
            lista.value;
        });

        //Llevar a otra pagina 
        boton.addEventListener("click", () => {
            if(lista.value != ""){
                window.open(`../../views/kardex/reporte.php?idtipoproducto=${lista.value}`,'blank');
            }else{
                Swal.fire("Debe Seleccionar un Producto");
            }
        })
    })
</script>

<?php require_once '../../footer.php'; ?>
</body>
</html>