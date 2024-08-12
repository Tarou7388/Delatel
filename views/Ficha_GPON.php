<?php require_once '../header.php'; ?>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">

<div class="container-fluid px-4">
    <h1 class="mt-4">Control de Averías GPON</h1>

    <div class="text-end">
        <label for="numero_ficha">N°</label> 
        <input type="number" class="form-control form-control-sm d-inline-block w-auto">
        <label for="fecha">Fecha</label> 
        <input type="date" class="form-control form-control-sm d-inline-block w-auto">
    </div>

    <br>

    <div class="card mb-4">
        <div class="card-header">
            Complete los Datos
        </div>
        <div class="card-body">
            <form action="" id="frm-registro-gpon" autocomplete="off">

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
                         <label for="lblid_cliente">Cliente</label>
                         <input type="text" class="form-control" id="id_cliente" disabled>    
                     </div>
 
                     <div class="col-md">
                         <label for="lblplan">Plan</label>
                         <input type="text" class="form-control" id="plan" disabled>
                     </div>
 
                 </div> <!-- Fin de la Primera Fila -->

                 <hr>

                 <!-- Segunda Fila -->
                <h5>Parámetros Técnicos</h5>
                <div class="row g-2 mb-2">

                    <div class="col-md">
                        <label for="lblpppoe">PPPoE</label>
                        <input type="text" class="form-control" id="pppoe" required>
                    </div>

                    <div class="col-md">
                        <label for="lblpotencia">Potencia</label>
                        <input type="number" class="form-control" id="potencia" required>
                    </div>

                    <div class="col-md">
                        <label for="lblpppoe">CATV</label>
                        <input type="text" class="form-control" id="catv" placeholder="SI/NO" required>
                    </div>

                </div> <!-- Fin de la Segunda Fila -->

                <!-- Tercera Fila -->
                <div class="row g-2 mb-2">

                    <div class="col-md">
                        <label for="lblclave">Clave</label>
                        <input type="text" class="form-control" id="clave" required>
                    </div>

                    <div class="col-md">
                        <label for="lblvlan">VLAN</label>
                        <input type="number" class="form-control" id="vlan" required>
                    </div>

                    <div class="col-md">
                        <label for="lblpotencia">Potencia</label>
                        <input type="number" class="form-control" id="potencia" required>
                    </div> <!-- Fin de Tercera Fila -->

                </div>

                <!-- Cuarta Fila -->
                <div class="row g-2 mb-2">

                    <div class="col-md">
                        <label for="lblssid">SSID</label>
                        <input type="text" class="form-control" id="potencia" required>
                    </div>

                    <div class="col-md">
                        <label for="lblpass">Password</label>
                        <input type="text" class="form-control" id="pass" required>
                    </div>

                    <div class="col-md">
                        <label for="lblotros">Otros</label>
                        <input type="text" class="form-control" id="otros" required>
                    </div>

                </div>
                <div>
                    <div class="col-md">
                        <label for="lblest_Inicial">Estado Inicial</label>
                        <textarea type="text" class="form-control" id="est_Inicial" style="height: 100px" required></textarea>
                    </div>
                </div> <!-- Fin de Cuarta Fila -->

                <hr>

                <!-- Cambios Técnicos -->
                 <!-- Primera Fila -->
                <h5>Cambios Técnicos GPON</h5>
                 <div class="row g-2 mb-2">  

                    <div class="col-md">
                        <label for="lblpppoe">PPPoE</label>
                        <input type="text" class="form-control" id="pppoe" required>
                    </div>

                    <div class="col-md">
                        <label for="lblpotencia">Potencia</label>
                        <input type="number" class="form-control" id="potencia" required>
                    </div>

                    <div class="col-md">
                        <label for="lblpppoe">CATV</label>
                        <input type="text" class="form-control" id="catv" placeholder="SI/NO" required>
                    </div>

                 </div> <!-- Fin de la Primera Fila -->

                 <!-- Segunda Fila -->
                <div class="row g-2 mb-2">

                    <div class="col-md">
                        <label for="lblclave">Clave</label>
                        <input type="text" class="form-control" id="clave" required>
                    </div>

                    <div class="col-md">
                        <label for="lblvlan">VLAN</label>
                        <input type="number" class="form-control" id="vlan" required>
                    </div>

                    <div class="col-md">
                        <label for="lblpotencia">Potencia</label>
                        <input type="number" class="form-control" id="potencia" required>
                    </div> <!-- Fin de la Segunda Fila -->

                </div>

                <!-- Tercera Fila -->
                <div class="row g-2 mb-2">

                    <div class="col-md">
                        <label for="lblssid">SSID</label>
                        <input type="text" class="form-control" id="potencia" required>
                    </div>

                    <div class="col-md">
                        <label for="lblpass">Password</label>
                        <input type="text" class="form-control" id="pass" required>
                    </div>

                    <div class="col-md">
                        <label for="lblotros">Otros</label>
                        <input type="text" class="form-control" id="otros" required>
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