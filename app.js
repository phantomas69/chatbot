
// aqui traigo los paquetes basicos para la instalación
'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const request = require ('request');
//acceso al token de facebook
const access_token = "EAAd3jaxivLoBAKsexwa8hhJLPQVRDf0haFC5CqZBKS4WlPguSIceUwZBg1XiXLbfTQC2dSbxA11Td87lpbqoUCmixLJW0nTwDdKQZBu4acYXibwrZBVSYlMBtZCz3JQ0rDzAyzl7Vm2cpqnUwlXGdrngIOwHpaxwaLM5MVgRG9AZDZD"
const app = express();

//denifo el acceso al puerto 
app.set('port', 5000);

//esta linea es para que entienda nuestro servidor que va a recibir informacion de una api
//de facebook.

app.use(bodyParser.json());
app.get('/', (req, res) =>{
  res.send('Hola Mundo!');
})


//aqui vamos a ñadir lo que es el weebhook con el que vamos a verificar con un token
//la asignacion y la conexion que va a tener la api de facebook con nuestro codigo en nuestro
//servidor con express

app.get('/webhook', (req, res) => {
  
  /*verifica que el token que asignamos en nuestro codigo sea el mismo
  que se manda en la verificacion de este weebhook a la hora de conectar nuestro servidor
  con lo que viene  siendo nuestra app dentro de fb*/
  if (req.query['hub.verify_token'] === 'patricia_token') {

    //si es correcto
    //de esta forma creamos la conexion de forma correcta
    res.send(req.query['hub.challenge']);
  } //si no es correcto
  else {
    res.send('chatbot no tienes permisos')
  }
})

//pieza de codigo que me persmite distinguir los mensajes

app.post('/webhook/', function(req, res){
    const webhook_event = req.body.entry[0];
    if(webhook_event.messaging) {
        webhook_event.messaging.forEach(event => {
            handleEvent(event.sender.id, event);
        });
    }
    res.sendStatus(200);
});

function handleEvent(senderId, event) {
    if (event.message){
        handleMessage(senderId, event.message)
    }else if (event.postback){
        handlePostBack(senderId, event.postback.payload)
    }
}
 







function handleMessage(senderId, event){
    if(event.text){
        defaultMessage(senderId);
    } else if(event.attachments){
        handleAttachments(senderId, event)
    }
}

function defaultMessage(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            //saludo inicial
            "text": "Hola soy Artaud, voy a ayudarte a crear las campañas de marketing más exitosas. ¿Qué puedo hacer por ti? ",
            
           //respuestas rapidas
           "quick_replies": [
            {
                "content_type": "text",
                "title": "Ver servicios",
                "payload": "CONTRATO_PAYLOAD"
            },
            {
                "content_type": "text",
                "title": "Entrevista",
                "payload": "ENTREVISTA_PAYLOAD"
            }
        ]


        }
    }
    senderActions(senderId)
    callsendApi(messageData);



}

function handlePostBack (senderId, payload) {
    switch (payload) {
        case"INICIO_PAYLOAD": 
        console.log(payload);
        break;

        case"CONTRATO_PAYLOAD": 
        console.log(payload);
        break;
      
    }
    
}

     function senderActions(senderId){
         const messageData ={
             "recipient":{
                 "id": senderId
             },
             "sender_action":"typing_on"
         }
         callsendApi(messageData);
     }


          function handleAttachments(senderId, event){
            let attachment_type = event.attachments[0].type;
            switch (attachment_type) {
                case "image":
                    console.log(attachment_type);
                break;
                case "video": 
                    console.log(attachment_type);
                break;
                case "audio":
                    console.log(attachment_type);
                break;
              case "file":
                    console.log(attachment_type);
                break;
              default:
                    console.log(attachment_type);
                break;
            }
        }

//funcion de callasendapi
function callsendApi(response){

request({
    "uri":"https://graph.facebook.com/v2.6/me/messages?access_token=${messengerAPI.ACCESS_TOKEN}",
    "qs" :{
        "access_token": access_token
    },
    "method" : "POST",
    "json": response
    },
    function(err){
        if(err){
            console.log('ha ocurrido un error')
        } else{
            console.log('mensaje enviado')
        }
    }
)
}

//servicios  y descripciones.  //no funiona 
    function showServices(senderId){
        const messageData = {
            "recipient":{
                "id": senderId
            },
            "message":{
                "attachment":{
                    "type":"template",
                    "payload" :{
                        "template_type": "generic",
                        "elements": [
                            {
                                "title": "Desarrollo web ",
                                "subtitle": "Desarrollo web y creacion marcas ",
                                "image_url": "https://mockraw.com/wp-content/uploads/2018/12/MK15.jpg",
                                "buttons":[
                                    {
                                        "type": "postback",
                                        "title": "elegir plan web",
                                        "payload": "ONE_PAYLOAD",
                                        
                                    }
                                ]

                            }
                        ]
                    }
                }
            }
        }
        callsendApi(messageData)
    }




//mensaje que nos dice si la  hubo error, o todo va correcto
app.listen(app.get('port'), err => {
  /*si error es igual a true, muestre el mensaje y cancele el proceso
   Si  no hubo error enseñe ese otro mensaje*/
  err ? console.log('hubo un error').proccess.exit(1) :
  console.log(`Nuestro servidor funciona en el puerto ${app.get('port')}`,);
})










