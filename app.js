var express = require("express");
var request = require("request");
var bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// configurar el puerto y el mensaje en caso de exito
app.listen((process.env.PORT || 3000), () => console.log('Puerto funcionando'));

// Ruta de la pagina index
app.get("/", function (req, res) {
    res.send("Index");
});

// Facebook Webhook

// Usados para la verificacion
app.get("/webhook", function (req, res) {
    // Verificar la coincidendia del token
    if (req.query["hub.verify_token"] === process.env.VERIFICATION_TOKEN) {
        // Mensaje de exito y envio del token requerido
        console.log("Verificado");
        res.status(200).send(req.query["hub.challenge"]);
    } else {
        // Mensaje de fallo
        console.error("Tokens no coinciden");
        res.sendStatus(403);
    }
});


app.post("/webhook", function (req, res) {
    // Verificar si el vento proviene del pagina asociada
    if (req.body.object == "page") {
        req.body.entry.forEach(function(entry) {
            entry.messaging.forEach(function(event) {
                if (event.message) {
                    process_event(event);
                }
            });
        });
        res.sendStatus(200);
    }
});


// Funcion donde se procesara el evento
function process_event(event){
    // Capturamos los datos del que genera el evento y el mensaje 
    var senderID = event.sender.id;
    var message = event.message;
    var name = event.
    
    // Si en el evento existe un mensaje de tipo texto
    if(message.text){
        // Crear un payload para un simple mensaje de texto
        var response;
        switch (message.text) {
            case "Hola":
            response = {"text": 'Hola'};
              break;
            case "Info":
            response = {"text": 'Información de prueba'};
              break;
            default:
            response = {"text": 'No se ha podido procesar tu solicitud'};
          }
        
    }
    
    // Enviamos el mensaje mediante SendAPI
    enviar_texto(senderID, response);
}

// Funcion donde el chat respondera usando SendAPI
function enviar_texto(senderID, response){

    let request_body = {
        "recipient": {
          "id": senderID
        },
        "message": response
    }
    
    // Enviar el requisito HTTP a la plataforma de messenger
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
          console.log('Mensaje enviado!')
        } else {
          console.error("No se puedo enviar el mensaje:" + err);
        }
    }); 
}