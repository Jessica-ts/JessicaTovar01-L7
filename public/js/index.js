function loadComentarios()
{
	let url = "/blog-api/comentarios";
	$.ajax({
		url : url,
		method : "GET",
		dataType : "json",
		success : function(responseJSON){
			displayResults(responseJSON);
		},
		error : function(err){
			console.log(err);
		}
	});
}

function displayResults(responseJSON)
{	
	$("#comentarios").empty();
	for (let i = 0; i<responseJSON.length; i++)
	{
		$("#comentarios").append(`
			<li>
				<b> ID </b>: ${responseJSON[i].id} <p><b> Titulo</b>: ${responseJSON[i].titulo} </p> <b> Contenido</b>: ${responseJSON[i].contenido}
				<p> <b> Autor</b> : ${responseJSON[i].autor} </p> <b> Fecha</b>: ${responseJSON[i].fecha}
			</li>`)
	}
}

function displayResultsAutor(responseJSON)
{
	$("#comentariosAutor").empty();
	for (let i = 0; i<responseJSON.length; i++)
	{
		$("#comentariosAutor").append(`
			<li>
				<b> ID </b>: ${responseJSON[i].id} <p><b> Titulo</b>: ${responseJSON[i].titulo} </p> <b> Contenido</b>: ${responseJSON[i].contenido}
				<p> <b> Autor</b> : ${responseJSON[i].autor} </p> <b> Fecha</b>: ${responseJSON[i].fecha}
			</li>`)
	}
}
function agregar()
{
	$("#agregarB").on("click", (event)=>{
		event.preventDefault();

		let titulo= $("#titulo").val();
		let autor= $("#autorA").val();
		let contenido = $("#comentario").val();
		let url = "/blog-api/nuevo-comentario";

		$.ajax({
			url : url,
			method : "POST",
			data : JSON.stringify({
				titulo : titulo,
				autor : autor,
				contenido : contenido
			}),
			dataType : "json",
			contentType : "application/json",
			success: function(responseJSON)
			{
				console.log(responseJSON);
				loadComentarios();

			},
			error: function(err)
			{
				$("#agregarError").text(err.statusText);
				$("#agregarError").show();
	            	
			}
		});
		cleanAgregar();

	});
}

function actualizar()
{
	$("#actualizarB").on("click", (event)=>{
		event.preventDefault();

		let idAct = $("#id").val();
		let tituloAct = $("#tituloAct").val();
		let autorAct = $("#autorAct").val();
		let contenidoAct = $("#comentarioAct").val();
		let url = "/blog-api/actualizar-comentario/";

		$.ajax({
			url : url + idAct,
			method : "PUT",
			data : JSON.stringify({
				id : idAct,
				titulo: tituloAct != " " && tituloAct != "" ? tituloAct : undefined,
				autor: autorAct != " " && autorAct != "" ? autorAct : undefined,
        		contenido: contenidoAct != " " && contenidoAct != "" ? contenidoAct : undefined
			}),
			dataType : "json",
			contentType : "application/json",
			success: function(responseJSON)
			{
				console.log(responseJSON);
				loadComentarios();
			},
			error: function(err)
			{
				$("#actualizarError").text(err.statusText);
				$("#actualizarError").show();   
				console.log(err); 	
			}
		});
		cleanActualizar();
	});
}

function eliminar()
{
	$("#eliminarB").on("click", (event)=>{
		event.preventDefault();

		let id = $("#idEliminar").val();
		let url = "/blog-api/remover-comentario/";
		$.ajax({
			url : url + id,
			method : "DELETE",
			dataType : "json",
			contentType : "application/json",
			success: function(responseJSON)
			{
				console.log(responseJSON);
				loadComentarios();
			},
			error: function(err)
			{
				$("#eliminarError").text(err.statusText);
				$("#eliminarError").show();
				console.log(err);
	            	
			}
		});
		cleanEliminar();
	});
}

function comentarioAutor()
{
	$("#buscarB").on("click", (event)=>{
		event.preventDefault();

		let autor = $("#autor").val();
		let url = `/blog-api/comentarios-por-autor?autor=`;

		$.ajax({
			url :url + autor,
			method : "GET",
			dataType : "json",
			contentType : "application/json",
			success : function(responseJSON)
			{
				console.log(responseJSON);
				displayResultsAutor(responseJSON);
				
			},
			error: function(err)
			{
				$("#autorError").append(err.statusText);
				$("#autorError").show();
	            	
			}
		});
		$("#autor").val("");
		$("#autorError").hide();
	});
}

function cleanAgregar()
{
	$("#titulo").val("");
	$("#autorA").val("");
	$("#comentario").val("");
	$("#agregarError").hide();
}

function cleanActualizar()
{
	$("#id").val("");
	$("#tituloAct").val("");
	$("#autorAct").val("");
	$("#comentarioAct").val("");
	$("#actualizarError").hide();  
}

function cleanEliminar()
{
	$("#idEliminar").val("");
	$("#eliminarError").hide();
}

function init()
{
	loadComentarios();
	agregar();
	actualizar();
	eliminar();
	comentarioAutor();
}

init();