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

  // Retorna todas las categorias actuales
  function get_categorias(){
    $resultado  = mysql_query("  SELECT * FROM categoria  ");
    return $resultado;
  }

  // Retorna todas las imagenes de un determinado usuario
  function get_imagenes(){
    $id_usuario    = mysql_real_escape_string( $_GET['par1'] );
    $resultado  = mysql_query("  SELECT arc_id, arc_nombre, arc_ruta_imagen, arc_descripcion, cat_nombre
                                 FROM archivo JOIN categoria
                                 WHERE arc_categoria = cat_id AND arc_usu_id_propietario = '$id_usuario' ORDER BY arc_id  ");
    if (mysql_num_rows($resultado) > 0){
      return $resultado;
    } else {
      return false;
    }

  }

  // -----------Limpiar datos, elegir funcion y retornar respuesta ----------- //

    $peticion =  $_GET['peticion'];
    $peticion = mysql_real_escape_string($peticion);
    //echo ("Entró al documento");
    if( $peticion == 'categorias') {
      $resultados = get_categorias();
    } else if ( $peticion == 'imagenes'){
      $resultados = get_imagenes();
    } else {
      header('HTTP/1.1 405 Método no encontrado!');
      exit;
    }

    //$número_filas = mysql_num_rows($resultados);
    if ($resultados == false){
      // Nada
    } else {
      while ($row = mysql_fetch_array($resultados)){
        $all[] = $row;
      }
      $resultados = $all;
    }

    echo json_encode( $resultados );
  ?>
