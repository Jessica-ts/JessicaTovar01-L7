let mongoose = require("mongoose");

mongoose.Promise = global.Promise;

let comentarioCollection = mongoose.Schema({
	id : {type: String},
	titulo : {type : String},
	contenido : {type : String},
	autor : {type : String},
	fecha : {type : Date}

});

let Comentario = mongoose.model("comentarios", comentarioCollection);

let ComentariosList = {
	getAll : function(){
		return Comentario.find()
			.then(comentarios=>{
				return comentarios;
			})
			.catch(error=>{
				throw Error(error);
			});
	},

	getByAutor : function(autor){
		return Comentario.find({"autor": autor})
			.then(comentarios=>{
				return comentarios;
			})
			.catch(error=>{
				throw Error(error);
			});
	},

	post : function(newComentario){
		return Comentario.create(newComentario)
			.then(comentarios=>{
				return comentarios;
			})
			.catch(error=>{
				throw Error(error);
			});
	},

	delete : function(id){
		return Comentario.findOneAndRemove({"id": id})
			.then(comentarios=>{
				return comentarios;
			})
			.catch(error=>{
				throw Error(error);
			});
	},

	put : function(updateComentario){
		return Comentario.findOneAndUpdate({id:updateComentario.id}, {$set : updateComentario}, {return: true})
			.then(comentarios=>{
				return comentarios;
			})
			.catch(error=>{
				throw Error(error);
			});
	}
};

module.exports = {ComentariosList};

