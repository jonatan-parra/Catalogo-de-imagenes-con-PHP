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
  function cerrar_sesion(){
    $id_usuario    = mysql_real_escape_string( $_POST['par1'] );
    $token         = mysql_real_escape_string( $_POST['par2'] );
    $resultado     = mysql_query("  SELECT usu_nombres FROM usuario
                                 WHERE usu_id = '$id_usuario' AND usu_token = '$token' ");
    if (mysql_num_rows($resultado) > 0){
      $nuevo_token = generateRandomString();
      mysql_query(" UPDATE usuario SET usu_token = '$nuevo_token'
                    WHERE usu_id = '$id_usuario' AND usu_token = '$token' ");
      $resultado = [ 'respuesta' => 'funciono'];
    } else {
      $resultado = [ 'respuesta' => 'fallo'];
    }
    return $resultado;
  }

  function validar_token(){
      $id_usuario    = mysql_real_escape_string( $_POST['par1'] );
      $token      = mysql_real_escape_string( $_POST['par2'] );
      $resultado  = mysql_query("  SELECT usu_id FROM usuario
                                   WHERE usu_id = '$id_usuario' AND usu_token = '$token' ");
      if (mysql_num_rows($resultado) > 0){
        $resultado = [ 'respuesta' => 'ok'];
      } else {
        $resultado = [ 'respuesta' => 'fallo'];
      }
      return $resultado;
    }

    function crear_sesion(){
      $usuario    = mysql_real_escape_string( $_POST['par1'] );
      $contrasena = mysql_real_escape_string( $_POST['par2'] );
      $resultado  = mysql_query(" SELECT usu_id
                                  FROM usuario
                                  WHERE usu_nickname = '$usuario' AND usu_contrasena = '$contrasena' ");

      $token = generateRandomString();

      if ( mysql_num_rows($resultado) > 0) {
        mysql_query(" UPDATE usuario SET usu_token = '$token' WHERE usu_nickname = '$usuario' ");
        $res2 = mysql_fetch_array($resultado);
        $usu_id = $res2['usu_id'];
        $resultado = [ 'respuesta' => 'ok', 'nickname' => $usuario, 'token' => $token, 'id_usuario' => $usu_id ];
      } else {
        $resultado = [ 'respuesta' => 'fallo'];
      }
      return $resultado;
    }

    //Genera un string aleatorio de tamano n para usar en los tokens de sesion
    function generateRandomString($length = 15) {
      $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      $charactersLength = strlen($characters);
      $randomString = '';
      for ($i = 0; $i < $length; $i++) {
          $randomString .= $characters[rand(0, $charactersLength - 1)];
      }
      return $randomString;
  }

  // -----------Limpiar datos, elegir funcion y retornar respuesta ----------- //

    $peticion =  $_POST['peticion'];
    $peticion = mysql_real_escape_string($peticion);

    if( $peticion == 'validar_login') {
      $resultados = crear_sesion();
    } else if ( $peticion == 'cerrar_sesion'){
      $resultados = cerrar_sesion();
    } else if ( $peticion == 'validar_token'){
      $resultados = validar_token();
    } else {
      header('HTTP/1.1 405 Método no encontrado!');
      exit;
    }

    echo json_encode( $resultados );
  ?>
