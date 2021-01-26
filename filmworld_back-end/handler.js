"use strict";
const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });
const { v4: uuidv4 } = require("uuid");

const cinemaworldTable = process.env.CINEMAWORLD_TABLE;
const filmworldTable = process.env.FILMWORLD_TABLE;
// Create a response
function response(statusCode, message) {
  return {
    statusCode: statusCode,
    body: JSON.stringify(message),
  };
}

function sortByPrice(a, b) {
  if (a.price > b.price) {
    return -1;
  } else return 1;
}

// Create a movie
module.exports.createMovie = (event, context, callback) => {
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
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    userId: 1,
    title: reqBody.title,
    body: reqBody.body,
  };

  return db
    .put({
      TableName: filmworldTable,
      Item: film,
    })
    .promise()
    .then(() => {
      callback(null, response(201, film));
    })
    .catch((err) => response(null, response(err.statusCode, err)));
};

module.exports.getAllMovies = (event, context, callback) => {
  return db
    .scan({
      TableName: filmworldTable,
    })
    .promise()
    .then((res) => {
      callback(null, response(200, res.Items.sort(sortByPrice)));
    })
    .catch((err) => callback(null, response(err.statusCode, err)));
};
// Get number of posts
module.exports.getMovies = (event, context, callback) => {
  const numberOfFilms = event.pathParameters.number;
  const params = {
    headers: {
      "Access-Control-Allow-Origin": "*",

      "Access-Control-Allow-Credentials": true,
    },
    TableName: filmworldTable,
    Limit: numberOfPosts,
  };
  return db
    .scan(params)
    .promise()
    .then((res) => {
      callback(null, response(200, res.Items.sort(sortByPrice)));
    })
    .catch((err) => callback(null, response(err.statusCode, err)));
};
// Get a single post
module.exports.getMovie = (event, context, callback) => {
  const id = event.pathParameters.id;

  const params = {
    Key: {
      id: id,
    },
    TableName: filmworldTable,
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
module.exports.updateMovie = (event, context, callback) => {
  const id = event.pathParameters.id;
  const reqBody = JSON.parse(event.body);
  const { body, title } = reqBody;

  const params = {
    Key: {
      id: id,
    },
    TableName: filmworldTable,
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
module.exports.deleteMovie = (event, context, callback) => {
  const id = event.pathParameters.id;
  const params = {
    Key: {
      id: id,
    },
    TableName: filmworldTable,
  };
  return db
    .delete(params)
    .promise()
    .then(() =>
      callback(null, response(200, { message: "Post deleted successfully" }))
    )
    .catch((err) => callback(null, response(err.statusCode, err)));
};

module.exports.csvExport = (event, context, callback) => {
  const axios = require("axios");
  const { parse } = require("json2csv");
  const fs = require("fs");

  const config = {
    method: "get",
    url:
      "https://spxc62p1r2.execute-api.ap-southeast-2.amazonaws.com/dev/films/",
  };
  axios(config)
    .then(function (response) {
      const res = response.data;
      const csv = parse(res);
      fs.writeFile("bulk_movies.csv", csv, { flag: "a+" }, (err) => {});
      console.log(csv);

      const s3 = new S3();

      s3.upload({
        Bucket: "bulkmovies",
        Key: "bulk_movies.csv",
        Body: csv,
      }).promise();
    })
    .catch(function (error) {
      console.log(error);
    });
};
