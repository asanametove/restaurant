import React from 'react';
import { NavLink } from 'react-router-dom';

import NavigationBar from '../navigation-bar/navigation-bar.jsx';
import * as routes from '../../constants/routes';
import './header.scss';

const Header = () => {
  const {
    home, menu, events, reservation, about, contact
  } = routes;

  return (
    <header className="header">
      <div className="logo">
        <NavLink to={home}>Restaurant</NavLink>
      </div>
      <NavigationBar>
        <NavLink to={menu} activeClassName='current'>
          menu
        </NavLink>
        <NavLink to={events} activeClassName='current'>
          events
        </NavLink>
        <NavLink to={reservation} activeClassName='current'>
          reservation
        </NavLink>
        <NavLink to={about} activeClassName='current'>
          about
        </NavLink>
        <NavLink to={contact} activeClassName='current'>
          contact
        </NavLink>
      </NavigationBar>
    </header>
  );
};

export default Header;
