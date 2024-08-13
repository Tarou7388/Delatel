<?php require_once '../header.php'; ?>

<div class="container-fluid px-4">
    <h1 class="mt-4">Control de Averías WISP</h1>

    <div class="text-end">
        <label for="numero_ficha">N°</label> 
        <input type="number" class="form-control form-control-sm d-inline-block w-auto">
        <label for="fecha">Fecha</label> 
        <input type="date" class="form-control form-control-sm d-inline-block w-auto">
    </div>

    <br>

    <div class="card mb-4">
        <div class="card-header">
            Complete los datos
        </div>
        <div class="card-body">
            <form action="" id="form-registro-wisp" autocomplete="off">

                <!-- Primera Fila -->
                <h5>Datos del Usuario</h5>
                <div class="row g-2 mb-2">
                    <div class="col-md">
                        <label for="lblnrodocumento">Número Identificador</label> 
                        <div class="input-group">
                            <input type="tel" class="form-control" maxlength="11" minlength="11" pattern="[0-11]+" id="nrodocumento" autofocus required>            
                            <button class="input-group-text btn btn-secondary" type="button" id="buscar-nrodocumento"><i class="fa-solid fa-magnifying-glass"></i></button>
                        </div>
                    </div>

                    <div class="col-md">
                        <label for="lblcliente">Cliente</label>
                        <input type="text" class="form-control" id="id_cliente" disabled>    
                    </div>

                    <div class="col-md">
                        <label for="lblplan">Plan</label>
                        <input type="text" class="form-control" id="plan" disabled>
                    </div>

                </div> <!-- Fin de la Primera Fila -->

                 <hr>

                 <!-- Segunda Fila -->
                 <h5>Parámetros Wireless</h5>
                 <div class="row g-2 mb-2">

                     <div class="col-md">
                        <label for="lblbase">Base</label>  
                        <input type="text" class="form-control" id="base" required>               
                     </div>
 
                     <div class="col-md">
                        <label for="lblip">IP</label>
                        <input type="text" class="form-control" id="ip" required>
                     </div>
 
                     <div class="col-md">
                        <label for="lblsenal">Señal</label>
                        <input type="number" class="form-control" id="senal" required>
                     </div>
 
                 </div> 

                 <div>
                    <div class="col-md">
                        <label for="lblest_Inicial">Estado Inicial</label>
                        <textarea type="text" class="form-control" id="est_Inicial" style="height: 100px" required></textarea>
                    </div>
                </div> <!-- Fin de la Segunda Fila -->

                 <hr>

                 <!-- Tercera Fila -->
                 <h5>Cambios Wireless</h5>
                 <div class="row g-2 mb-2">

                     <div class="col-md">
                        <label for="lblbase">Nueva Base</label>  
                        <input type="text" class="form-control" id="base" required> 
                     </div>
 
                     <div class="col-md">
                        <label for="lblip">Nuevo IP</label>
                        <input type="text" class="form-control" id="ip" required>
                     </div>
 
                     <div class="col-md">
                        <label for="lblsenal">Señal</label>
                        <input type="number" class="form-control" id="senal" required>
                     </div>
 
                 </div> 

                <div>
                    <div class="col-md">
                        <label for="lblproc_Solucion">Procedimiento de Solución</label>
                        <textarea type="text" class="form-control" id="proc_Solucion" style="height: 100px" required></textarea>    
                    </div>
                </div> <!-- Fin de la Tercera Fila -->

                <hr>

                <!-- Botones -->
                <div class="text-end">
                    <button type="button" id="btncodigo_Barra" class="btn btn-warning btn-sm">Verificar Código</button>
                    <button type="submit" id="btnregistrar_soporte" class="btn btn-primary btn-sm">Registrar Soporte</button>
                    <button type="reset" id="btncancelar" class="btn btn-secondary btn-sm">Cancelar Proceso</button>
                </div>

            </form>
        </div>
    </div>
</div>
<?php require_once "../footer.php"; ?>