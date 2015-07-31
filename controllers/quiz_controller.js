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
		res.render('quizes/index',{quizes : quizes, errors:[]});
	}).catch(function(error){next(error);  });
};


//GET /quizes/question   ->  /quizes/show
exports.show = function(req, res) {
	//models.Quiz.findById(req.params.quizId).then(function(quiz){
		res.render('quizes/show', {quiz: req.quiz , errors:[]});
	//});
};

//GET /quizes/answer
exports.answer = function (req, res) {
	//models.Quiz.findById(req.params.quizId).then(function(quiz){
		var resultado = 'Incorrecto';
		if(req.query.respuesta === req.quiz.respuesta){
			resultado ='Correcto';
		}
		res.render('quizes/answer', {quiz: req.quiz,  respuesta:resultado, errors:[]});	
	//});
}

exports.new = function(req, res){
	var quiz = models.Quiz.build(
		{pregunta:"Pregunta", respuesta: "Respuesta",tema: "otro"}
	);
	res.render('quizes/new',{quiz:quiz, errors:[]});
}

exports.create = function(req, res){
	var quiz = models.Quiz.build( req.body.quiz	);
	//guarda en DB los campos pregunta y respuesta de quiz
	quiz.validate().then( function(err) {
		if(err)
		{
			res.render('quizes/new',{quiz:quiz , errors: err.errors});
		}
		else
		{
			quiz.save({fields:["pregunta","respuesta","tema"]}).then(function() {
				res.redirect('/quizes');
			});
		
		}
	});
	
}


exports.edit = function(req, res){
	var quiz = req.quiz; //autoload de instancia de quiz
	res.render('quizes/edit',{quiz:quiz, errors:[]});
}


exports.update = function(req, res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;
	
	req.quiz.validate()
	.then(function (err) {
		if(err){
			res.render('quizes/edit', {quiz: req.quiz , errors: err.errors});
		}
		else{
			req.quiz
			.save( {fields:["pregunta","respuesta","tema"]} )
			.then( function(){ res.redirect('/quizes'); } );
		}
		
		
	});
}

exports.destroy = function(req, res) {
	
	req.quiz.destroy().then(function () {
				 res.redirect('/quizes'); 
	}).catch(function(error){next(error)});
}