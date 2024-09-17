import config from "../env.js";

document.addEventListener("DOMContentLoaded", function () {
  const userid= JSON.stringify(user['idUsuario']);
  if (permisos[0].permisos.personas.leer != 1) {
    window.location.href = `${config.HOST}views`;
  }
   
  const divEmpresaCard = document.getElementById("divEmpresaCard");
  const frmEmpresas = document.getElementById("frmEmpresas");

  const txtRuc = document.getElementById("txtRuc");
  const txtRepresentanteLegal = document.getElementById("txtRepresentanteLegal");
  const txtRazonSocial = document.getElementById("txtRazonSocial");
  const txtNombreComercial = document.getElementById("txtNombreComercial");
  const txtTelefono = document.getElementById("txtTelefono");
  const txtEmail = document.getElementById("txtEmail");
  const txtCoordenadas = document.getElementById("txtCoordenadas");

  const txtDireccion = document.getElementById("txtDireccion");
  const txtReferencia = document.getElementById("txtReferencia");


  const btnCancelarEmpresa = document.getElementById("btnCancelarEmpresa");
  const btnBuscarEmpresa = document.getElementById("btnBuscarEmpresa");

  frmEmpresas.addEventListener("submit", (event) => {
    event.preventDefault();
    const bandera = verificarCampos();
    if(!bandera)
    {
      if (permisos[0].permisos.personas.crear != 1) {
        alert("No tienes permiso de registrar");
      }
      registrarEmpresa();
    }
  });

  function registrarEmpresa()
  {
  
      const params = new FormData();
      params.append("operacion", "Registrar");
      params.append("ruc", txtRuc.value);
      params.append("representante_legal", txtRepresentanteLegal.value);
      params.append("razon_social", txtRazonSocial.value);
      params.append("nombre_comercial", txtNombreComercial.value);
      params.append("telefono", txtTelefono.value);
      params.append("email", txtEmail.value);
      params.append("iduser_create",userid);

      const options = {
        method: "POST",
        body: params,
      };

      fetch(`${config.HOST}controllers/Empresas.controllers.php`, options)
        .then((response) => response.json())
        .then((data) => {
          registrarcliente(data.id_empresa);
          frmEmpresas.reset();
        })
        .catch((e) => {
          console.error(e);
        });
    
  }


  function registrarcliente(idEmpresa) {
    const params = new FormData();
    params.append("operacion", "add");;
    params.append("direccion", txtDireccion.value);
    params.append("referencia", txtReferencia.value);
    params.append("idempresa",idEmpresa)
    params.append("idPersona","");
    params.append("iduser_create", userid);
    params.append("coordenadas", txtCoordenadas.value);

    const options = {
      method: "POST",
      body: params,
    };

    fetch(`${config.HOST}controllers/Cliente.controllers.php`, options)
      .then((response) => response.json())
      .then((data) => {
        if (data.Guardado) {
          tablaClientes.ajax.reload();
          alert("Cliente registrado");
        } else {
          alert("Error: Verifique");
        }
      })
      .catch((e) => {
        console.error(e);
      });
  }

  btnBuscarEmpresa.addEventListener("click", () => {
    ObtenerDataRUC("getapiruc",txtRuc.value);
  });

  function ObtenerDataRUC(operacion,ruc) {
    fetch(
      `${config.HOST}controllers/Personas.controlles.php?Operacion=${operacion}&ruc=${encodeURIComponent(
        ruc
      )}`
    )
      .then((response) => response.json())
      .then((data) => {
        txtRazonSocial.value = data.razonSocial;
        txtDireccion.value = data.direccion;
      })
      .catch((e) => {
        alert("Empresa no encontrada, verifique RUC")
      });
  }

  function verificarCampos() {
    const campos = [
      txtRuc, txtRepresentanteLegal, txtRazonSocial,
      txtNombreComercial, txtTelefono, txtEmail,
      txtDireccion, txtReferencia,txtCoordenadas
    ];
  
    for (let campo of campos) {
      if (campo.value.trim() === '') {
        alert('Por favor, complete todos los campos.');
        return true;
      }
    }

    return false;
  }
});
