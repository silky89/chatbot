const LUISClient = require("../luis_sdk");
const APPID = "22c47090d79345c3b3e4930ef6b8aed0";
const APPKEY = "7a950bcf686d408086e0232b7335f1c8";
var LUISclient = LUISClient({
	appId: APPID,
	appKey: APPKEY,
	verbose: true
});
var mysql = require('mysql');
// Initialize pool
var pool = mysql.createPool({
	connectionLimit: 10,
	host: '127.0.0.1',
	user: 'root',
	password: 'a',
	database: 'test'
});
module.exports.getAIResponse = function(query, next) {
	LUISclient.predict(query, {

		//On success of prediction
		onSuccess: function(response) {
			printOnSuccess(response);
		},

		//On failure of prediction
		onFailure: function(err) {
			console.error(err);
		}
	});

	var printOnSuccess = function(response) {
		console.log("Query: " + response.query);
		console.log("Top Intent: " + response.topScoringIntent.intent);
		pool.getConnection(function(err, connection) {
			for (var i = 0; i < response.intents.length; i++) {
				// console.log("response.intents[i].score",response.intents[i].score);
				if (response.intents[i].score > .5) {
					var getBotAnswer="select * from bot_info where question='"+response.intents[i].intent+"'"
					connection.query(getBotAnswer, function(err, getBotAnswerResult) {
						console.log("getBotAnswerResult[0].answer",getBotAnswerResult[0].answer);
						next(getBotAnswerResult[0].answer);
					});
				}
			}
			// if (typeof response.dialog !== "undefined" && response.dialog !== null) {
			// 	console.log("Dialog Status: " + response.dialog.status);
			// 	if (!response.dialog.isFinished()) {
			// 		console.log("Dialog Parameter Name: " + response.dialog.parameterName);
			// 		console.log("Dialog Prompt: " + response.dialog.prompt);
			// 	}
			// }
			connection.release();
		});
		// res.send(response);
	};
};