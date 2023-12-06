'use strict'
// Funcion para agretar ficheros js 
function include(file) {
 
  let script = document.createElement('script');
  script.src = file;
  script.type = 'text/javascript';
  script.defer = true;

  document.getElementsByTagName('head').item(0).appendChild(script);

}

//Incluimos el objeto Socio necesario para la aplicacion
include('../model/Usuario.js');


console.log('Empieza el programa')

// ------------------- VARIABLES GLOBALES ------------------------
const usuarios = {
  listaUsuarios : [],

  //Añade un socio a la lista
  anadirUsuario:function(usuario) {
    //Comprobamos si el dato pasado es del tipo Socio
    if(usuario instanceof Usuario ){
        this.listaUsuarios.push(usuario);
    } else {
      console.log("Se ha intentado agregar un datos que no es de tipo Usuario")
    }
  },

  //Comprueba si el usuario es correcto y crea cookie si es correcto
  usuarioValido:function(usuario,clave) {
    for(var i=0;i<this.listaUsuarios.length;i++) {
      if(this.listaUsuarios[i].usuario==usuario){
        if(this.listaUsuarios[i].esContrasenaValida(clave)){
          $.cookie("usuario", this.listaUsuarios[i].nombre+" "+this.listaUsuarios[i].apellido); 
          return true;
        }else{
          return false;
        }
      }
    }
    return false;
  },
}
// ------------------- FUNCIONES ------------------------

// EJERCICIO 1

/*
  funcion para leer del JSON
*/
function cargarUsuariosJSON () {
  console.log("entra");
  let listausuariosStorage=localStorage.getItem("usuariosEgoitz"); 
  if(listausuariosStorage==null){
    let path = 'model/usuarios.json'

    let request = new Request(path, {
      headers: new Headers({
        'Content-Type': 'text/json'
      }),
      method: 'GET'
    })

    fetch(request).then(response => {
        response.json().then(data => {
        aniadirUsuarioInicialesArray(data),
        localStorage.setItem("usuariosEgoitz",JSON.stringify(usuarios.listaUsuarios));
        console.log('Datos', data)
      })
    })
  }else{
    aniadirUsuarioInicialesArray(JSON.parse(listausuariosStorage))
  }
}

/* 
Funcion  para añadir usuario al array 
    cuando arranca la pagina
*/
function aniadirUsuarioInicialesArray(data) {
    for( var i=0;(data!==undefined) && (i< data.length) ;i++){
      //console.log(i+" :"+data[i].id+" "+data[i].nombre+" "+data[i].apellido+" "+data[i].usuario+" "+ data[i].contrasena);
      let socio= new Usuario(data[i].id,data[i].nombre,data[i].apellido,data[i].usuario,data[i].contrasena);
      usuarios.anadirUsuario(socio);
    }
    
}

/*
  Meotodo para capturar los datos del usuario introducidor en el formulario
*/
function validarUsuario () {
  // TODO: recoger los el usuario y clave del HTML
  let listausuarios=localStorage.getItem("usuarios");
  console.log(JSON.parse(listausuarios));
  let usuario=document.getElementById("usuarioID").value;
  let clave=document.getElementById("claveID").value;
  if(usuario.trim()=='' || clave.trim()==''){
    alert("Los datos nombre y apellido son obligatorios");
  }else{
   if(usuarios.usuarioValido(usuario,clave)){
    return true;
   }else{
    return false;
   }
  }
}

// ------------------- MAIN ------------------------
$(document).ready(function(){
  $.removeCookie("usuario") 
  cargarUsuariosJSON();
  $("#formLogin").on('submit', function(event,e){
    event.preventDefault(); 
    if(validarUsuario()){
      window.location.href = '/vista/juego.html';
    }else{
      $('#error').removeClass("d-none");
    }
  })
});

console.log('Acaba el programa')
