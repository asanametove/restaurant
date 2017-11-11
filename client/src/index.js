import './scss/main.scss';
import main from './main'

main();

if (module.hot) {
  module.hot.accept('./main', () => {
    const main = require('./main').default;
    main();
  });
}