const express = require('express')
const app = new express()
require('dotenv').config({ path: './.env' })

const getNLUInstance = () => {
  const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1')
  const { IamAuthenticator } = require('ibm-watson/auth')

  const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
    version: '2021-03-25',
    authenticator: new IamAuthenticator({
      apikey: process.env.API_KEY,
    }),
    serviceUrl: process.env.API_URL,
  })
  return naturalLanguageUnderstanding
}
const analyzeParams = {
  url: 'www.ibm.com',
  features: {
    entities: {
      emotion: true,
      sentiment: true,
      limit: 2,
    },
    keywords: {
      emotion: true,
      sentiment: true,
      limit: 2,
    },
  },
}
app.use(express.static('client'))

const cors_app = require('cors')
app.use(cors_app())

app.get('/', (req, res) => {
  res.render('index.html')
})

app.get('/url/emotion', (req, res) => {
  let nlu = getNLUInstance()
  nlu
    .analyze(
      {
        url: req.query.url,
        features: {
          emotion: {},
        },
      },
      null,
      2
    )
    .then((analysisResults) => console.log(analysisResults.result.emotion.document.emotion))
    .catch((error) => console.log('error:', error))

  // return res.send("url emotion for "+req.query.url);
  return res.send({ happy: '90', sad: '10' })
})

app.get('/url/sentiment', (req, res) => {
  let nlu = getNLUInstance()
  nlu
    .analyze(
      {
        url: req.query.url,
        features: {
          sentiment: {},
        },
      },
      null,
      2
    )
    .then((analysisResults) => console.log(analysisResults.result.sentiment.document))
    .catch((error) => console.log('error:', error))

  return res.send('url sentiment for ' + req.query.url)
})

app.get('/text/emotion', (req, res) => {
    console.log(req.query.text);
    
  let nlu = getNLUInstance()
  nlu.analyze(
      {
        text: req.query.text,
        features: {
          emotion: {},
        },
      }
    )
    .then((analysisResults) => console.log(analysisResults.result.emotion.document.emotion))
    .catch((error) => console.log('error:', error))

  return res.send('text emotion for ' + req.query.text)
})

app.get('/text/sentiment', (req, res) => {
  let nlu = getNLUInstance()
  nlu
    .analyze(
      {
        text: req.query.text,
        features: {
          sentiment: {},
        },
      },
      null,
      2
    )
    .then((analysisResults) => console.log(analysisResults.result.sentiment.document))
    .catch((error) => console.log('error:', error))

  return res.send('text sentiment for ' + req.query.text)
})

app.listen(3333, () => {
  console.log(`listening at http://localhost:3333`)
})
