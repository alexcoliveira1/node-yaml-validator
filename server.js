const express = require('express')
const app = express()
const port = 3000

app.use(express.json());

app.post('/:dataset/:version/records', (req, res) => {
  const {
    dataset,
    version,
  } = req.params
  res.send(`Should handle the search for ${dataset} / ${version} : ${JSON.stringify(req.body)}`)
})

app.listen(port, () => console.log('App listening on port ' + port))