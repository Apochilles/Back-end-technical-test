"use strict";
const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });
const uuid = require("uuid");

const cinemaworldTable = process.env.POSTS_TABLE;
// Create a response
function response(statusCode, message) {
  return {
    statusCode: statusCode,
    body: JSON.stringify(message),
  };
}

// Create a movie
module.exports.createFilm = (event, context, callback) => {
  const reqBody = JSON.parse(event.body);

  if (
    !reqBody.title ||
    reqBody.title.trim() === "" ||
    !reqBody.body ||
    reqBody.body.trim() === ""
  ) {
    return callback(
      null,
      response(400, {
        error: "Film must have a title and body and they must not be empty",
      })
    );
  }

  const film = {
    createdAt: new Date().toISOString(),
    userId: 1,
    title: reqBody.title,
    body: reqBody.body,
  };

  return db
    .put({
      TableName: cinemaworldTable,
      Item: film,
    })
    .promise()
    .then(() => {
      callback(null, response(201, film));
    })
    .catch((err) => response(null, response(err.statusCode, err)));
};

module.exports.getAllFilms = (event, context, callback) => {
  return db
    .scan({
      TableName: cinemaworldTable,
    })
    .promise()
    .then((res) => {
      callback(null, response(200, res.Items.sort(sortByDate)));
    })
    .catch((err) => callback(null, response(err.statusCode, err)));
};
// Get number of posts
module.exports.getFilms = (event, context, callback) => {
  const numberOfFilms = event.pathParameters.number;
  const params = {
    TableName: cinemaworldTable,
    Limit: numberOfPosts,
  };
  return db
    .scan(params)
    .promise()
    .then((res) => {
      callback(null, response(200, res.Items.sort(sortByDate)));
    })
    .catch((err) => callback(null, response(err.statusCode, err)));
};
// Get a single post
module.exports.getFilm = (event, context, callback) => {
  const id = event.pathParameters.id;

  const params = {
    Key: {
      id: id,
    },
    TableName: cinemaworldTable,
  };

  return db
    .get(params)
    .promise()
    .then((res) => {
      if (res.Item) callback(null, response(200, res.Item));
      else callback(null, response(404, { error: "Post not found" }));
    })
    .catch((err) => callback(null, response(err.statusCode, err)));
};
// Update a post
module.exports.updateFilm = (event, context, callback) => {
  const id = event.pathParameters.id;
  const reqBody = JSON.parse(event.body);
  const { body, title } = reqBody;

  const params = {
    Key: {
      id: id,
    },
    TableName: cinemaworldTable,
    ConditionExpression: "attribute_exists(id)",
    UpdateExpression: "SET title = :title, body = :body",
    ExpressionAttributeValues: {
      ":title": title,
      ":body": body,
    },
    ReturnValues: "ALL_NEW",
  };
  console.log("Updating");

  return db
    .update(params)
    .promise()
    .then((res) => {
      console.log(res);
      callback(null, response(200, res.Attributes));
    })
    .catch((err) => callback(null, response(err.statusCode, err)));
};
// Delete a post
module.exports.deleteFilm = (event, context, callback) => {
  const id = event.pathParameters.id;
  const params = {
    Key: {
      id: id,
    },
    TableName: cinemaworldTable,
  };
  return db
    .delete(params)
    .promise()
    .then(() =>
      callback(null, response(200, { message: "Post deleted successfully" }))
    )
    .catch((err) => callback(null, response(err.statusCode, err)));
};
