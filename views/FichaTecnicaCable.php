<?php require_once '../header.php'; ?> 

<div class="container-fluid px-4">
    <h1 class="mt-4">Instalación de Cable</h1>

    <div class="row g-3 mb-2">
        <div class="row g-3 mb-2">
            <div class="col md-6">
                <input type="number" class="form-control" id="lblnumFicha" placeholder="N°" disabled>
            </div>
            <div class="col md-6">
                <input type="date" class="form-control" id="lblfecha" placeholder="Fecha" disabled>
            </div>
        </div>
    </div>

    <br>

    <div class="card mb-4">
        <div class="card-header">
            Complete los datos
        </div>
        <div class="card-body">
            <form action="" id="form-registro-wisp" autocomplete="off">

                <!-- Primera fila -->
                <div class="row g-2 mb-2">

                    <div class="col-md">
                        <label for="lblperiodo">Periodo</label>
                        <select class="form-select" id="periodo" aria-label="Selecciona una opción">
                            <option selected disabled>Elige una opción</option>
                            <option value="1">Mensual</option>
                            <option value="2">Contado</option>
                        </select>
                    </div>

                    <div class="col-md">
                        <label for="lblpotencia">Potencia</label>
                        <input type="text" class="form-control" id="potencia" required>
                    </div>

                    <div class="col-md">
                        <label for="lblpotencia">Sintonizador</label>
                        <input type="text" class="form-control" id="sintonizador">
                    </div>

                </div> <!-- Fin de Primera Fila -->

                <hr>

                <!-- Segunda Fila -->
                <div class="row g-2 mb-2">

                    <div class="col-md">
                        <label for="lbltriplexor">Triplexor</label>
                        <div class="input-group">
                            <input type="text" id="num_triplexor" class="form-control">
                            <select class="form-select" id="triplexor" aria-label="Selecciona una opción">
                                <option selected disabled>Elige una opción</option>
                                <option value="1">No</option>
                                <option value="2">Activo</option>
                                <option value="3">Pasivo</option>
                            </select>
                        </div>
                    </div>

                    <div class="col-md">
                        <label for="lblspliter">Spliter</label>
                        <div class="input-group">
                            <input type="text" id="num_pliter" class="form-control">
                            <select class="form-select" id="spliter" aria-label="Selecciona una opción">
                                <option selected disabled>Elige una opción</option>
                                <option value="1">1x3</option>
                                <option value="2">1x5</option>
                                <option value="3">1x8</option>
                            </select>
                        </div>
                    </div>

                    <div class="col-md">
                        <label for="lbltriplexor">Cable</label>
                        <div class="input-group">
                            <input type="text" class="form-control">
                            <input type="text" class="form-control" id="cable" disabled>
                        </div>
                    </div>

                    <div class="col-md">
                        <label for="lbltriplexor">Conectores</label>
                        <div class="input-group">
                            <input type="number" class="form-control">
                            <input type="text" class="form-control" id="conector" disabled>
                        </div>
                    </div> <!-- Fin de Segunda Fila -->

                </div>

                <!-- Tercera Fila -->
                <div>
                    <div class="col-md">
                        <label for="lblproc_Solucion">Detalles</label>
                        <textarea type="text" class="form-control" id="detalles" style="height: 100px" required></textarea>    
                    </div>
                </div>

                <hr>

               <!-- Botones -->
               <div class="row">
                    <div class="col-12 text-center text-md-end mb-3">
                        <button type="button" id="btncodigo_Barra" class="btn btn-warning btn-sm me-2 mb-2 mb-md-0">Verificar Código</button>
                        <button type="submit" id="btnregistrar_soporte" class="btn btn-primary btn-sm me-2 mb-2 mb-md-0">Registrar Soporte</button>
                        <button type="reset" id="btncancelar" class="btn btn-secondary btn-sm mb-2 mb-md-0">Cancelar Proceso</button>
                    </div>
                </div>

            </form>
        </div>

    </div>
</div>

<?php require_once "../footer.php"; ?>