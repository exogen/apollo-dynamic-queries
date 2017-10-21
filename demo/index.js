import React from 'react'
import ReactDOM from 'react-dom'
import { injectGlobal } from 'styled-components'
import App from './App'

injectGlobal`
  html,
  body {
    font-size: 100%
  }

  body {
    margin: 0;
    padding: 20px;
    font-family: Lato, 'Open Sans', Helvetica, sans-serif;
  }

  code {
    font-family: Menlo, Monaco, Consolas, monospace;
  }

  .Artist {
    border: 1px solid #ccc;
    margin: 0 0 5px 0;
    padding: 10px;

    h1 {
      margin: 0;
      font-size: 20px;
    }

    p {
      margin: 0;
    }

    small {
      font-size: 12px;
    }
  }
`

ReactDOM.render(<App />, document.getElementById('root'))
