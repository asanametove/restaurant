import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/app/app.jsx';

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept('./components/app/app.jsx', () => {
    const App = require('./components/app/app.jsx').default;
    ReactDOM.render(
      <App />,
      document.getElementById('root'),
    );
  });
}
