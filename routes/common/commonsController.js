'use strict';
var mysql = require('mysql');
// Initialize pool
var pool = mysql.createPool({
	connectionLimit: 10,
	host: '127.0.0.1',
	user: 'root',
	password: 'a',
	database: 'test'
});
var crypto = require('crypto');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var dynamicUpdate = function(reqData) {
	var subQuery;
	var fields = ['firstName', 'lastName', 'contactNo'];
	fields.forEach(function(data) {
		if (data === 'firstName') {
			if (reqData.firstName) {
				subQuery = "first_name='" + reqData.firstName + "',"
			}
		} else if (data === 'lastName') {
			if (reqData.lastName) {
				subQuery += "last_name='" + reqData.lastName + "',"
			}
		} else if (data === 'contactNo') {
			if (reqData.contactNo) {
				subQuery += "contact_no='" + reqData.contactNo + "',"
			}
		}
	})
	console.log("subQuery", subQuery);
	return subQuery;
}
var commonsController = {
	addUser: function(req, res, next) {
		var response;
		pool.getConnection(function(err, connection) {
			// connection.query(getData, function(err, rows) {
			var passwordHash = bcrypt.hashSync(req.body.password);
			console.log("passwordHash", passwordHash);
			var checkUser = "select * from user where email='" + req.body.username + "'";
			connection.beginTransaction(function(err) {
				if (err) {
					throw err;
				}
				connection.query(checkUser, function(err, checkUserResult) {
					if (checkUserResult.length > 0) {
						response = {
							"statusCode": 404,
							"message": "Already exist",
							"data": {}
						}
						res.send(response);
					} else {
						var insertQuery = "insert into user(email,passwordhash)Values('" + req.body.email + "','" + passwordHash + "')"
						console.log("insertQuery", insertQuery);
						connection.query(insertQuery, function(err, insertQueryResult) {
							if (err) {
								response = {
									"statusCode": 404,
									"message": "Error during inserting database",
									"data": {}
								}
								res.send(response);
							} else {
								var userId = insertQueryResult.insertId;
								var insertInfoQuery;
								if (req.body.lastName) {
									insertInfoQuery = "insert into user_info(user_id,first_name,last_name,email,contact_no)Values(" + userId + ",'" + req.body.firstName + "','" + req.body.lastName + "','" + req.body.email + "','" + req.body.contactNo + "')";
								} else {
									insertInfoQuery = "insert into user_info(user_id,first_name,email,contact_no)Values(" + userId + ",'" + req.body.firstName + "','" + req.body.email + "','" + req.body.contactNo + "')";
								}
								console.log("insertInfoQuery", insertInfoQuery);
								connection.query(insertInfoQuery, function(err, insertInfoQueryResult) {
									if (err) {
										connection.rollback(function() {
											throw err;
										});
									} else {
										connection.commit(function(err) {
											if (err) {
												connection.rollback(function() {
													throw err;
												});
											}
											console.log('success!');
											response = {
												"statusCode": 200,
												"message": "inserted successfully",
												"data": {}
											}
											res.send(response);
										});
									}
								});
							}
						});
					}
				});
			});

			// });
			connection.release();
		});
	},
	fetchUser: function(req, res, next) {
		var getUser = "select user_info_id as userInfoId,first_name as firstName,last_name as lastName,email,contact_no as contactNo,IF(is_deleted=0,'Active','Inactive') as status from user_info";
		console.log("getUser", getUser);
		var response;
		pool.getConnection(function(err, connection) {
			connection.query(getUser, function(err, getUserResult) {
				if (getUserResult.length > 0) {
					response = {
						"statusCode": 200,
						"message": "Fetch successfully",
						"data": getUserResult
					}
				} else {
					response = {
						"statusCode": 404,
						"message": "No Data Found",
						"data": []
					}
				}
				res.send(response);
			})
			connection.release();
		});
	},
	updateUser: function(req, res, next) {
		var updateUser, response;
		if (req.body.status === 'Inactive') {
			updateUser = "update user_info set is_deleted=1 where user_info_id=" + req.body.userInfoId + "";
		} else {
			var returnData = dynamicUpdate(req.body);
			updateUser = "update user_info set " + returnData + "modified_at=current_timestamp where user_info_id=" + req.body.userInfoId + "";
		}
		console.log("updateUser", updateUser);
		pool.getConnection(function(err, connection) {
			connection.query(updateUser, function(err, updateUserResult) {
				if (err) {
					response = {
						"statusCode": 404,
						"message": "Error during updating databasea",
						"data": {}
					}
				} else {
					response = {
						"statusCode": 200,
						"message": "Updated successfully",
						"data": {}
					}
				}
				res.send(response);
			});
			connection.release();
		});
	},
	loginUser: function(req, res, next) {
		var reqData = req.body;
		var response;
		pool.getConnection(function(err, connection) {
			var checkUser = "select user_info.user_info_id,user.passwordhash,user_info.first_name from user inner join user_info on user_info.user_id=user.user_id where user.email='" + reqData.username + "' and user_info.is_deleted=0";
			console.log("checkUser", checkUser);
			connection.query(checkUser, function(err, checkUserResult) {
				if (checkUserResult.length > 0) {
					var authenticated = bcrypt.compareSync(req.body.password, checkUserResult[0].passwordhash);
					console.log("authenticated", authenticated);
					if (authenticated) {
						var token = jwt.sign({
							userInfoId: checkUserResult[0].user_info_id
						}, "test", {
							expiresIn: 86400 // expires in 24 hours
						});
						response = {
							"statusCode": 200,
							"message": "Login successfully",
							"data": {
								"token":token,
								"firstName":checkUserResult[0].first_name
							}
						}
						res.send(response);
					} else {
						response = {
							"statusCode": 404,
							"message": "username password mismatch",
							"data": {}
						}
						res.send(response);
					}
				} else {
					response = {
						"statusCode": 404,
						"message": "User is not active in the system",
						"data": {}
					}
					res.send(response);
				}
				var token = jwt.sign({
					email: req.body.email
				}, "Test", {
					expiresIn: 86400 // expires in 24 hours
				});
			});
			connection.release();
		});

	}
}
module.exports = commonsController;