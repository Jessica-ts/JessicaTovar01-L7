let express = require("express");
let morgan = require("morgan");
let bodyParser = require("body-parser");
let mongoose = require("mongoose");
let uuid = require('uuid/v4');
let {ComentariosList} = require("./model");
let {DATABASE_URL, PORT} = require("./config");

let app = express();
let jsonParser = bodyParser.json();

app.use(express.static("public"));
app.use(morgan("dev"));


app.get("/blog-api/comentarios", (req, res)=>{
	ComentariosList.getAll()
		.then(comentariosList=>{
			return res.status(200).json(comentariosList);
		})
		.catch(error=>{
			console.log(error);
			res.statusMessage="Hubo un error de conexión con la BD.";
			return res.status(500).send();
		});
});

app.get("/blog-api/comentarios-por-autor", (req, res)=>{
	let autor = req.query.autor;

	if(autor=="")
	{
		res.statusMessage = "No hay datos de autor!";
		return res.status(406).json({
			message : "No hay datos de autor!",
			status : 406
		});
	}
	
	ComentariosList.getByAutor(autor)
		.then(comentariosList=>{
			if(comentariosList!=""){
				console.log(comentariosList);
				return res.status(200).send(comentariosList);
			}
			else 
            {
                res.statusMessage = "No se encontro comentario con el autor proporcionado";
                return res.status(404).json({
                    message: "No se encontro comentario con el autor proporcionado", 
                    status: 404
                });
            }
		})
		.catch(error=>{
			console.log(error);
			res.statusMessage="Hubo un error de conexión con la BD.";
			return res.status(500).send();
		})

});

app.post("/blog-api/nuevo-comentario", jsonParser, (req, res)=>{
	let titulo = req.body.titulo;
	let contenido = req.body.contenido;
	let autor = req.body.autor;

	if(titulo=="" || contenido=="" || autor=="")
	{
		res.statusMessage = "Completa todos los datos";
		return res.status(406).json({
			message : "Completa todos los datos",
			status : 406
		});
	}
	
	let nuevoComentario = {
		id :uuid(),
		titulo : titulo,
		contenido : contenido,
		autor : autor,
		fecha : new Date()
	};

	ComentariosList.post(nuevoComentario)
		.then(comentariosList=>{
			return res.status(201).json(comentariosList);
		})
		.catch(error=>{
			console.log(error);
			res.statusMessage="Hubo un error de conexión con la BD.";
			return res.status(500).send();
		});
	
});

app.delete("/blog-api/remover-comentario/:id", (req,res)=>{
	let id = req.params.id;

	ComentariosList.delete(id)
		.then(comentariosList=>{
			if(comentariosList)
			{
				console.log(comentariosList);
				return res.status(200).json(comentariosList);
			}
			else
			{
				res.statusMessage = "Id no encontrado en la lista";
				return res.status(404).json({
       				message : "Id no encontrado en la lista",
        			status : 404
        		});
			}
		})
		.catch(error=>{
			console.log(error);
			res.statusMessage="Hubo un error con la conexión con la BD.";
			return res.status(500).send();
		})
});

app.put("/blog-api/actualizar-comentario/:id", jsonParser, (req, res)=>{
	let idBody = req.body.id;
	let idParam = req.params.id;
	let titulo = req.body.titulo;
	let contenido = req.body.contenido;
	let autor = req.body.autor;

	if(!idBody)
	{
		res.statusMessage="Proporciona el id en el body!";
		return res.status(406).json({
			message : "Proporciona el id en el body!",
			status : 406
		});
	}
	
	if(idBody != idParam){
		res.statusMessage = "Id de body no coincide con el id del parametro";
		return res.status(409).json({
			message : "Id de body no coincide con el id del parametro",
			status : 409
		});
	}
	
	if(!(titulo || contenido || autor))
	{
		res.statusMessage = "Los campos de titulo, contenido y autor estan vacios, completa alguno";
		return res.status(406).json({
			message : "Los campos de titulo, contenido y autor estan vacios, completa alguno",
			status : 406
		});
	}

	let commentToUpdate = { }
   commentToUpdate.id=idParam;

   if (titulo)
   {
        commentToUpdate.titulo= titulo;
   } 

   if (contenido)
   {
        commentToUpdate.contenido = contenido;
   }

   if (autor)
   {
        commentToUpdate.autor = autor;
   }

   ComentariosList.put(commentToUpdate)
   	.then(comentariosList=>{
   		return res.status(202).json(comentariosList);
   	})
   	.catch(error=>{
   		console.log(error);
   		res.statusMessage ="Hubo un error con la conexion de la BD.";
   		return res.status(500).send();
   	})
  
});

let server;
function runServer(port, databaseUrl){
 	return new Promise( (resolve, reject ) => {
 		mongoose.connect(databaseUrl, response => {
 			if ( response ){
 				return reject(response);
 			}
 			else{
 				server = app.listen(port, () => {
 					console.log( "Servidor corriendo en puerto " + port );
					 resolve();
				})
 				.on( 'error', err => {
 					mongoose.disconnect();
 					return reject(err);
 				})
 			}
 		});
 	});
}

function closeServer(){
	return mongoose.disconnect()
		.then(() => {
 			return new Promise((resolve, reject) => {
 				console.log('Closing the server');
				server.close( err => {
					if (err){
						return reject(err);
	 				}
					else{
 						resolve();
					}
 				});
 			});
 		});
}

runServer(PORT, DATABASE_URL);

module.exports={app, runServer, closeServer}