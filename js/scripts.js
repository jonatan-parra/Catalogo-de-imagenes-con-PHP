$(document).ready(function() {
  verificar_usuario();  // Verifica que la sesion del usuario sea valida
  get_categorias();  // Se obtienen todas las categorias de la base de datos
  get_mis_imagenes(); // Carga las imagenes del usuario
});


// Verifica que las credenciales del usuario sean validas
function verificar_usuario(){
  if ( localStorage["id_usuario"] ){
    // Si existen datos en el localStorage verifica que sean correctos
    datos_sesion = "peticion=validar_token&par1=" + localStorage["id_usuario"] + "&par2=" + localStorage["token"];
    $.ajax({
      url: url_login,
      data: datos_sesion,
      type: 'POST',
      dataType: 'json',
      success: function(datos) {
        if (datos.respuesta == "ok"){
          // si lo datos son correctos no hace nada
        } else {
          // Si los datoss son incorrecto borra el localStorage y redirecciona al inicio
          localStorage["id_usuario"] = ""; // Borra el id del usuario
          localStorage["nickname"] = "";   // Borra el nickname del usuario
          localStorage["token"] = "";      // Borra el token corrrespondiente a la sesión
          //window.location = "index.html";
          console.log("Redireccionando al inicio");
        }
      },
      error : function( request, error ){
        console.log("Error en ajax de verificar_usuario");
        console.log(error);
        console.log(request);
      }
    });
  } else {
    // Si no existen datos en el localStorage redirecciona automaticamente al index
    window.location = "index.html";
  }
}


// Obtiene las categorias usadas en el formulario de creación
function get_categorias(){
  url = url_consulta + "peticion=categorias";
  $.getJSON( url )
  .done(function(datos_del_ws){
    $("#select_categorias").empty();
    $("#select_categorias").append("<option value='' selected='selected'> --- categorías --- </option>" );
    $.each(datos_del_ws, function(indice,valor){
      $("#select_categorias").append("<option value=" + valor.cat_id + ">" + valor.cat_nombre + "</option>" );
    })
  });
}

// Obtiene las imagenes de un determindo usuario
function get_mis_imagenes(){
  url = url_consulta + "peticion=imagenes&par1=" + localStorage["id_usuario"];
  $.getJSON( url )
  .done(function(datos_del_ws){
    $("#mi_catalogo").empty();
    $.each(datos_del_ws, function(indice,valor){
      $("#mi_catalogo").append(" <div class='col-md-2'> <img width='96' height='96' src=' " +  valor.arc_ruta_imagen + "' title=' " + valor.arc_descripcion + " - " + valor.cat_nombre + " '/> <br> " + valor.arc_nombre + " </div> " );
    })
  });
}

// Cierra la sesion en el servidor y borra los parametros locales
$( "#btn_cerrar_sesion" ).click(function() {
  datos_sesion = "peticion=cerrar_sesion&par1=" + localStorage["id_usuario"] + "&par2=" + localStorage["token"];
  $.ajax({
    url: url_login,
    data: datos_sesion,
    type: 'POST',
    dataType: 'json',
    success: function(datos) {
      if (datos.respuesta == "ok"){
        //window.location = "index.html";
      } else {
      }
    },
    error : function( request, error ){
      console.log("Error en ajax del cerrar sesion");
      console.log(error);
      console.log(request);
    }
  });
  localStorage["id_usuario"] = ""; // Borra el id del usuario
  localStorage["nickname"] = "";   // Borra el nickname del usuario
  localStorage["token"] = "";      // Borra el token corrrespondiente a la sesión
  window.location = "index.html";
});

// Obtiene los datos para crear un nuevo archivo
$('#formulario_creacion').submit(function(evento) {
  evento.preventDefault();
  datos_formulario =$(this);
  var formData = new FormData(document.getElementById("formulario_creacion"));
  formData.append("par5", localStorage["id_usuario"]);
  $.ajax({
    url: url_insertar,
    data: formData,
    type: 'POST',
    dataType: 'json',
    cache: false,
    contentType: false,
	  processData: false,
    success: function(datos) {
      if (datos.respuesta == "ok"){
        $('#formulario_creacion')[0].reset();
        $('#modal-creacion').modal("hide");
        $('#modal-aceptacion').modal('show');
        get_mis_imagenes();
      } else {
      //  $('#modal-creacion')[0].reset();
        $('#modal-creacion').modal("hide");
        $('#modal-fallo').modal('show');
      }
    },
    error : function( request, error ){
      console.log("Error en ajax de creacion");
      console.log(error);
      console.log(request);
    }
  });
});
