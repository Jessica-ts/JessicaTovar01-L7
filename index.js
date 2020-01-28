let express = require("express");
let morgan = require("morgan");
let bodyParser = require("body-parser");
let uuid = require('uuid/v4');

let app = express();
let jsonParser = bodyParser.json();

app.use(express.static("public"));
app.use(morgan("dev"));

let comentario = [
	{
		id : uuid(),
    	titulo : "1er comentario",
    	contenido : "Este es el primer comentario del blog",
    	autor : "Ana",
    	fecha : new Date("January 17, 2020")

    },
	{
		id : uuid(),
    	titulo : "2ndo comentario",
    	contenido : "Este es el segundo comentario del blog",
    	autor : "Pedro",
    	fecha : new Date("January 22, 2020")
	}
];

app.get("/blog-api/comentarios", (req, res)=>{
	return res.status(200).json(comentario);
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
	
	let resultado = comentario.filter((elemento)=>{
		if(elemento.autor == autor )
			return elemento;
	});

	if(resultado.length >0){
		return res.status(200).json(resultado);
	}
	else{
		res.statusMessage = "No se encontro comentario con el autor proporcionado";
		return res.status(404).json({
			message : "No se encontro comentario con el autor proporcionado",
			status : 404
		});
	}

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

	comentario.push(nuevoComentario);
	 return res.status(201).json(nuevoComentario);
});

app.delete("/blog-api/remover-comentario/:id", (req,res)=>{
	let id = req.params.id;

	for(let i=0; i<comentario.length; i++)
	{
		if(id==comentario[i].id)
		{
			comentario.splice(i,1);
			return res.status(200).json({
            	message:"Mensaje eliminado con exito", 
            	status:200
            });
		}
	}

	res.statusMessage = "Id no encontrado en la lista";
	return res.status(404).json({
        message : "Id no encontrado en la lista",
        status : 404
    });
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

	for(let i=0; i<comentario.length; i++)
	{
		if(comentario[i].id == idParam)
		{
			if(titulo)
				comentario[i].titulo = titulo;

			if(contenido)
				comentario[i].contenido = contenido;

			if(autor)
				comentario[i].autor = autor;
			
			return res.status(202).json(comentario[i]);
		}
	}
});

app.listen("8080", () => {
    console.log("Servidor corriendo en puerto 8080");
});