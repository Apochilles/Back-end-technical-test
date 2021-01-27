"use strict";
const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });
const { v4: uuidv4 } = require("uuid");

const cinemaworldTable = process.env.CINEMAWORLD_TABLE;
const filmworldTable = process.env.FILMWORLD_TABLE;
function response(statusCode, message) {
  return {
    statusCode: statusCode,
    body: JSON.stringify(message),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
  };
}

// sorts listing by price
function sortByPrice(a, b) {
  if (a.price > b.price) {
    return -1;
  } else return 1;
}
// determines which {database} is relevant to the endpoint
function databaseVariable(event) {
  const database = event.pathParameters.database;
  if (database === "cinemaworld") {
    return cinemaworldTable;
  } else return filmworldTable;
}

// Create a movie endpoint
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
        error: "Movie must have a title and body and they must not be empty",
      })
    );
  }

  const film = {
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    title: reqBody.title,
    body: reqBody.body,
    price: reqBody.price,
  };

  const tableName = databaseVariable(event);

  return db
    .put({
      TableName: tableName,
      Item: film,
    })

    .promise()
    .then(() => {
      callback(null, response(201, film));
    })
    .catch((err) => response(null, response(err.statusCode, err)));
};
// Get all films from one {database}
module.exports.getAllFilms = (event, context, callback) => {
  const tableName = databaseVariable(event);

  return db
    .scan({
      TableName: tableName,
    })
    .promise()
    .then((res) => {
      callback(null, response(200, res.Items.sort(sortByPrice)));
    })
    .catch((err) => callback(null, response(err.statusCode, err)));
};
// Get number of movies from one {database}
module.exports.getFilms = (event, context, callback) => {
  const numberOfFilms = event.pathParameters.number;
  const tableName = databaseVariable(event);
  const params = {
    TableName: tableName,
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
// Get a single movie from one {database}
module.exports.getFilm = (event, context, callback) => {
  const id = event.pathParameters.id;
  const tableName = databaseVariable(event);

  const params = {
    Key: {
      id: id,
    },
    TableName: tableName,
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
// Update a single movie from one {database
module.exports.updateFilm = (event, context, callback) => {
  const id = event.pathParameters.id;
  const reqBody = JSON.parse(event.body);
  const { body, title } = reqBody;
  const tableName = databaseVariable(event);

  const params = {
    Key: {
      id: id,
    },
    headers: {
      "Access-Control-Allow-Origin": "*",

      "Access-Control-Allow-Credentials": true,
    },
    TableName: tableName,
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
// Delete a single movie from one {database
module.exports.deleteFilm = (event, context, callback) => {
  const id = event.pathParameters.id;
  const tableName = databaseVariable(event);
  const params = {
    Key: {
      id: id,
    },
    TableName: tableName,
  };
  return db
    .delete(params)
    .promise()
    .then(() =>
      callback(null, response(200, { message: "Post deleted successfully" }))
    )
    .catch((err) => callback(null, response(err.statusCode, err)));
};
// Imports both {database} endpoints, combines the response in an array, converts it to CSV and sends it to S3 via SQS (queueing service)

module.exports.csvExport = (event, context, callback) => {
  const axios = require("axios");
  const { parse } = require("json2csv");
  const fs = require("fs");
  const AWS = require("aws-sdk");

  Promise.all([
    axios.get(
      "https://pvp8rab1r9.execute-api.ap-southeast-2.amazonaws.com/dev/cinemaworld/movies/"
    ),

    axios.get(
      "https://pvp8rab1r9.execute-api.ap-southeast-2.amazonaws.com/dev/filmworld/movies/"
    ),
  ])

    .then((responseArray) => {
      const newArray = [...responseArray[0].data, ...responseArray[1].data];
      console.log(newArray);
      // function to sort data by the last 24h hours
      const csv = parse(newArray);
      fs.writeFile("bulk_movies.csv", csv, { flag: "a+" }, (err) => {});
      console.log(csv);

      const s3 = new AWS.S3();

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
