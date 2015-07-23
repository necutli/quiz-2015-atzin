var models = require('../models/models.js');

// Autoload factoriza el código si ruta incluye :quizId
exports.load = function (req, res, next, quizId){
	models.Quiz.findById(quizId).then(function(quiz){ 
		if(quiz){
			req.quiz = quiz;
			next();
		}
		else
		{ next(new Error('No existe quizId='+ quizId)); }
	}).catch(function(error){ next(error); });
};

exports.index = function(req, res) {
	var buscar = (  req.query.search || "" ).replace(/\s/,'%').replace(/(.*)/, "%$1%");
	//console.log("Buscar: " + buscar);
	models.Quiz.findAll({where:['pregunta like ?' ,  buscar ] , order: [['pregunta' , 'ASC']] }).then( function (quizes){
		res.render('quizes/index',{quizes : quizes});
	}).catch(function(error){next(error);  });
};


//GET /quizes/question   ->  /quizes/show
exports.show = function(req, res) {
	//models.Quiz.findById(req.params.quizId).then(function(quiz){
		res.render('quizes/show', {quiz: req.quiz});
	//});
};

//GET /quizes/answer
exports.answer = function (req, res) {
	//models.Quiz.findById(req.params.quizId).then(function(quiz){
		var resultado = 'Incorrecto';
		if(req.query.respuesta === req.quiz.respuesta){
			resultado ='Correcto';
		}
		res.render('quizes/answer', {quiz: req.quiz,  respuesta:resultado});	
	//});
}

exports.new = function(req, res){
	var quiz = models.Quiz.build(
	{pregunta:"Pregunta", respuesta: "Respuesta"}
	);
	res.render('quizes/new',{quiz:quiz});
}

exports.create = function(req, res){
	var quiz = models.Quiz.build( req.body.quiz	);
	//guarda en DB los campos pregunta y respuesta de quiz
	quiz.save({fields:["pregunta","respuesta"]}).then(function() {
		res.redirect('/quizes');
	});
}