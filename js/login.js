$(document).ready(function() {
  verificar_usuario();  // Verifica si hay una sesion de usuario valida
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
          // si lo datos son correctos salta del index a la plataforma principal
          window.location = "plataforma.html";
        } else {
          // Si los datoss son incorrecto borra el localStorage
          localStorage["id_usuario"] = ""; // Borra el id del usuario
          localStorage["nickname"] = "";   // Borra el nickname del usuario
          localStorage["token"] = "";      // Borra el token corrrespondiente a la sesión
        }
      },
      error : function( request, error ){
        console.log("Error en ajax de verificar_usuario");
        console.log(error);
        console.log(request);
      }
    });
  } else {
    // Si no existen datos en el localStorage se mantiene en el index.html

  }
}


// Loguea al usuario
$('#form_login').submit(function(evento) {
  evento.preventDefault();
  datos_formulario =  $(this).serialize();
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
        $("#inputPassword").val("");

        alert("Los datos ingresados no son validos");
      }
    },
    error : function( request, error ){
      console.log("Error en ajax del login");
      console.log(error);
      console.log(request);
    }
  });
});
