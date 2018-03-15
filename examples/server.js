const React = require('react');
const {renderToStaticMarkup} = require('react-dom/server');
const express = require('express');

const Index = (
  <html>
    <head>
      <meta charSet="utf-8" />
      <title>Replaceables!</title>
    </head>
    <body>
      <div id="main" />
    </body>
  </html>
);

const Example = props => (
  <html>
    <head>
      <meta charSet="utf-8" />
      <title>Replaceables!</title>
      <script src={bundle} charSet="utf-8" />
    </head>
    <body>
      <div id="main" />
    </body>
  </html>
);

let app = express();

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>\n${renderToStaticMarkup(<Index />)}`);
});

app.listen(9090);
