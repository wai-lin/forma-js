const express = require('express')
const cors = require('cors')
const multer = require('multer')
const upload = multer()
const jsonGraphqlExpress = require('json-graphql-server').default

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(upload.array())

const graphqlData = require('./gql-mock-data')

app.use('/graphql', jsonGraphqlExpress(graphqlData))

app.use('/throttle', async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const statusCode = req.body.statusCode || 200

  res.status(statusCode).json({
    message: 'Response from Throttle route',
    requestMethod: req.method,
    requestBody: req.body,
    requestHeaders: req.headers,
  })
})

app.use('*', (req, res) => {
  const statusCode = req.body.statusCode || 200

  res.status(statusCode).json({
    requestMethod: req.method,
    requestBody: req.body,
    requestHeaders: req.headers,
  })
})

app.listen(4000, () => {
  console.log('Server listening on port 4000')
})
