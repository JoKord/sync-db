;(function(){
	'use strict';
	const promise = require('bluebird');
	const spex = require('spex')(promise);
	const errors = require('./modules/error')

	module.exports = function(err, req, res, next){
		if(err instanceof errors.TimestampError){
			console.log("Error::TimestampError");
			return res.status(err.resCode).json(err); 
		};
		if(err instanceof errors.DatabaseError){
			console.log("Error::DatabaseError");
			return res.status(err.resCode).json(err);
		}
		if(err instanceof errors.ServerError){
			console.log("Error::ServerError");
			return res.status(500).json(err);
		}
		if(err instanceof spex.errors.SequenceError){
			console.log("Error::SequenceError");
			let seqError = new errors.SequenceError(err.message, {
				id_tree:res.locals.clientData.logs[err.index].id_tree,
				reason: err.reason
			});
			return res.status(seqError.resCode).json(seqError);
		}
		console.log("Error::Unknown");
		return res.status(500).json(new errors.ServerError("Unknown Error Ocurred", "Server::", true));
	};
})();