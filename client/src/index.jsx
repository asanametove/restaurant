import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App/App.jsx';
import './scss/main.scss';

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept('./components/App/App.jsx', () => {
    const App = require('./components/App/App.jsx').default;
    ReactDOM.render(
      <App />,
      document.getElementById('root'),
    );
  });
}
