import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Route, Switch } from "react-router";

import Header from '../header/header.jsx';
import Home from '../home/home.jsx';
import Menu from '../menu/menu.jsx';
import Events from '../events/events.jsx';
import Reservation from '../reservation/reservation.jsx';
import About from '../about/about.jsx';
import Contact from '../contact/contact.jsx';
import * as routes from '../../constants/routes.js';

const App = () => {
  const {
    home,
    menu,
    events,
    reservation,
    about,
    contact,
  } = routes;

  return (
    <BrowserRouter>
      <div className="wrapper">
        <Header />
        <Switch>
          <Route path={home} component={Home} exact />
          <Route path={menu} component={Menu} exact />
          <Route path={events} component={Events} exact />
          <Route path={reservation} component={Reservation} exact />
          <Route path={about} component={About} exact />
          <Route path={contact} component={Contact} exact />
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default App;
