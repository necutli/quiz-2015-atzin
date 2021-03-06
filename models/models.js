var path = require("path");

//Postgres DATABASE_URL = postgres://user:password@host:port/database
//SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6] || null);
var user    = (url[2] || null);
var pwd     = (url[3] || null);
var protocol= (url[1] || null);
var dialect = (url[1] || null);
var port    = (url[5] || null);
var host    = (url[4] || null);
var storage = process.env.DATABASE_STORAGE;

//cargar Modelo ORM
var Sequelize = require('sequelize');

//Usar BBDD SQLite;
var sequelize = new Sequelize(DB_name, user, pwd,
			{dialect:protocol, 
			 protocol:protocol,
			 port:port,
			 host:host,
			 storage: storage,
			 omitNull: true
			 }
			);
			
// Importar la definicion de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));

//Importar la definicion de la tabla Comment
var comment_path = path.join( __dirname,'Comment');
var Comment = sequelize.import( comment_path );

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz = Quiz; // exportar definicion de tabla Quiz
exports.Comment = Comment; // exportar definicion de tabla Comment
//sequelize.sinc() crea e inicializa tabla de preguntas en DB
//console.info('Inicializar Base de datos');
sequelize.sync().then(function() {
	//success(.. ) ejecuta el manejador una vez creada la tabla
	
	Quiz.count().then(function (count){
		if(count === 0) { // la tabla se inicializa solo si esta vacía
		Quiz.create({ pregunta: 'Capital de Italia',
						respuesta: 'Roma'
						});
		Quiz.create({ pregunta: 'Capital de Portugal',
						respuesta: 'Lisboa'
						});
				//.then(function(){console.log('Base de datos inicializada');});
		}
	});
});