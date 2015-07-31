
module.exports = function(sequelize, DataType){
	return sequelize.define('Quiz',
	{ pregunta: { type: DataType.STRING ,
				 validate:{ notEmpty:{msg:"-> falta pregunta"}}
		},
	  respuesta: { type: DataType.STRING,
				  validate: {notEmpty:{msg: "-> falta respuesta"}}
		}
	
	}
	);
}