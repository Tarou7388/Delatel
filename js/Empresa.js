import config from "../env.js";

document.addEventListener("DOMContentLoaded", function () {

  const userid = JSON.stringify(user['idUsuario']);

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

  const verificarCampos = () => {
    const campos = [
      txtRuc, txtRepresentanteLegal, txtRazonSocial,
      txtNombreComercial, txtTelefono, txtEmail,
      txtDireccion, txtReferencia, txtCoordenadas
    ];

    for (let campo of campos) {
      if (campo.value.trim() === '') {
        showToast("¡Por favor complete todos los campos!", "INFO");
        return true;
      }
    }
    return false;
  };

  const registrarEmpresa = () => {
    const params = new FormData();
    params.append("operacion", "registrarEmpresa");
    params.append("ruc", txtRuc.value);
    params.append("representante_legal", txtRepresentanteLegal.value);
    params.append("razon_social", txtRazonSocial.value);
    params.append("nombre_comercial", txtNombreComercial.value);
    params.append("telefono", txtTelefono.value);
    params.append("email", txtEmail.value);
    params.append("iduser_create", userid);

    const options = {
      method: "POST",
      body: params,
    };

    fetch(`${config.HOST}app/controllers/Empresa.controllers.php`, options)
      .then(response => response.json())
      .then(data => {
        registrarcliente(data.id_empresa);
        frmEmpresas.reset();
      })
      .catch(() => {
        showToast("Empresa ya registrada", "WARNING");
      });
  };

  const registrarcliente = (idEmpresa) => {
    const params = new FormData();
    params.append("operacion", "registrarCliente");
    params.append("idPersona", "");
    params.append("idEmpresa", idEmpresa);
    params.append("direccion", txtDireccion.value);
    params.append("referencia", txtReferencia.value);
    params.append("iduser_create", userid);
    params.append("coordenadas", txtCoordenadas.value);

    const options = {
      method: "POST",
      body: params,
    };

    fetch(`${config.HOST}app/controllers/Cliente.controllers.php`, options)
      .then(response => response.json())
      .then(data => {
        if (data.Guardado) {
          tablaClientes.ajax.reload();
          showToast("¡Cliente registrado!", "SUCCESS");
        } else {
          showToast("¡Error Verifique!", "ERROR");
        }
      })
      .catch(e => {
        console.error("Error al registrar el cliente:", e.message);
        console.error("Detalles del error:", e);
      });
  };

  const ObtenerDataRUC = (operacion, ruc) => {
    fetch(`${config.HOST}app/controllers/Persona.controlles.php?operacion=${operacion}&ruc=${encodeURIComponent(ruc)}`)
      .then(response => response.json())
      .then(data => {
        txtRazonSocial.value = data.razonSocial;
        txtDireccion.value = data.direccion;
      })
      .catch(e => {
        showToast("¡Empresa no encontrada, verifique RUC!", "INFO");
        console.error("Detalles del error:", e);
      });
  };

  frmEmpresas.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!verificarCampos()) {
        registrarEmpresa();
    }
  });

  btnBuscarEmpresa.addEventListener("click", () => {
    ObtenerDataRUC("getapiruc", txtRuc.value);
  });
});
