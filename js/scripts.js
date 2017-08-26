$(document).ready(function() {
  get_categorias();  // Se obtienen todas las categorias de la base de datos
  get_mis_imagenes(); // Carga las imagenes del usuario
});

var url_login = "php/login/login.php"

var url_consulta = "php/consultas/consultar.php?"

var url_insertar = "php/inserciones/insertar.php?"


// Loguea al usuario
$('#form_login').submit(function(evento) {
  evento.preventDefault();
  datos_formulario =  $(this).serialize();
  console.log(url_login + datos_formulario);
  $.ajax({
    url: url_login,
    data: datos_formulario,
    type: 'POST',
    dataType: 'json',
    success: function(datos) {
      if (datos.respuesta == "ok"){
        localStorage["id_usuario"] = datos.id_usuario; // Guarda el id del usuario
        localStorage["nickname"] = datos.nickname; // Mantiene el nickname del usuario
        localStorage["token"] = datos.token;       // Guarda el token corrrespondiente a la sesión
        window.location = "plataforma.html";
      } else {
        console.log("No entro");
      }
    },
    error : function( request, error ){
      console.log("Error en ajax del login");
      console.log(error);
      console.log(request);
    }
  });
});

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

// Obtiene los datos para crear un nuevo archivo
$( "#btn_cerrar_sesion" ).click(function() {
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



/*

$('#formulario_pregrado').submit(function(evento) {
  datos_formulario =  $(this).serialize();
  ajax_general(evento, datos_formulario, '#formulario_pregrado', "#modal-pregrado" );
});

$('#formulario_posgrado').submit(function(evento) {
  datos_formulario =  $(this).serialize();
  ajax_general(evento, datos_formulario, '#formulario_posgrado', "#modal-posgrado");
  console.log("Entro");
});
*/
/*
function ajax_general(evento, datos_formulario, id_formulario, id_modal){
  evento.preventDefault();
  $.ajax({
    url: url_insercion,
    data: datos_formulario,
    type: 'GET',
    dataType: 'json',
    success: function(datos) {
      if (datos == true){
        //console.log("retorno true");
        $(id_modal).modal("hide");
        $(id_formulario)[0].reset();
        //alert("Su respuesta ha sido registrada");
        $('#modal-aceptacion').modal('show');
      } else {
        $(id_modal).modal("hide");
        $(id_formulario)[0].reset();
        $('#modal-fallo').modal('show');
      }
    },
    error : function( request, error ){
      $(id_modal).modal("hide");
      $(id_formulario)[0].reset();
      $('#modal-fallo').modal('show');
    }
  });
}
/* */
