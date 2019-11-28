const express = require('express')
const fs = require('fs')
const jsYaml = require("js-yaml");
const { OpenApiValidator } = require("express-openapi-validate");

const app = express()
const port = 3000

// Load the validator and the spec
const openApiDocument = jsYaml.safeLoad(
    fs.readFileSync("./spec/api.spec.yaml", "utf-8")
  );

// Construct the validator with some basic options
const validator = new OpenApiValidator(openApiDocument,
    {
        ajvOptions: {
            allErrors: true,
            removeAdditional: "all",
        }
      }
    );

// we need JSON
app.use(express.json());

// Our post endpoint
app.post('/:dataset/:version/records',
    validator.validate("post", '/{dataset}/{version}/records'),
    (req, res, next) => {
    const {
        dataset,
        version,
    } = req.params 
    res.send(`Should handle the search for ${dataset} / ${version} : ${JSON.stringify(req.body)}`)
})

// add some error handling
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      error: {
        name: err.name,
        message: err.message,
        data: err.data,
      },
    });
  });

// listen to the port
app.listen(port, () => console.log('App listening on port ' + port))