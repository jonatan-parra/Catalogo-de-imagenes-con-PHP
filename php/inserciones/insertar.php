<?php
//  --------- Inicio configuracion ---------- //
  header('Content-Type: application/json');
  require('../conexion.php');
  $dbhandle = mysql_connect($hostname, $username, $password)
  or die ("No es posible conectarse a MySQL");

  $seleccion = mysql_select_db($dataBase)
  or die ("Base de datos no disponible");

  mysql_query("SET NAMES 'utf8'");
// ---------- Fin configuracion -------------- //

// ----------- Guardar nuevos registros -------------//
  function agregar_registro(){
    $nombre_imagen  = mysql_real_escape_string( $_POST["par1"] );
    $descripcion  = mysql_real_escape_string( $_POST["par2"] );
    $categoria   = mysql_real_escape_string( $_POST["par3"] );
  //  $imagen = mysql_real_escape_string( $_POST["par4"] );
    $id_usuario   = mysql_real_escape_string( $_POST["par5"] );

    $tiempo = time();
    $dir_subida1 = '../../archivos_guardados/' ;
    $dir_subida2 = 'archivos_guardados/';
    $path  = $dir_subida1 . $tiempo . "_" . basename($_FILES['par4']['name']);
    $path1 = $dir_subida2 . $tiempo . "_" . basename($_FILES['par4']['name']);
    $path = str_replace(' ', '', $path);

    if (move_uploaded_file($_FILES['par4']['tmp_name'], $path)) {
      $registro = mysql_query( "INSERT INTO archivo (arc_id, arc_usu_id_propietario, arc_nombre, arc_ruta_imagen, arc_descripcion, arc_categoria)
                                  VALUES (NULL, '$id_usuario', '$nombre_imagen',  '$path1', '$descripcion', '$categoria' )" );
      $resultado = [ 'respuesta' => 'ok'];
    } else {
      $resultado = [ 'respuesta' => 'fallo'];
    }

    return $resultado;
  }

// ----------- Fin nuevos registros -------------//

  $peticion = $_POST['peticion'];
  $peticion = mysql_real_escape_string($peticion);

  if( $peticion == 'agregar') {
    $resultados = agregar_registro();
  } else {
    header('HTTP/1.1 405 Method Not Allowed');
    exit;
  }

  echo json_encode( $resultados );
  exit;
?>
