import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import './header.scss';

import * as routes from '../../constants/routes';

const getNavLinks = () => {
  const navLinks = [];
  const {
    menu, events, reservation, about, contact
  } = routes;

  navLinks.push({to: menu, title: 'menu'});
  navLinks.push({to: events, title: 'events'});
  navLinks.push({to: reservation, title: 'reservation'});
  navLinks.push({to: about, title: 'about'});
  navLinks.push({to: contact, title: 'contact'});

  return navLinks.map(({ to, title }) => (
    <NavLink key={to} to={to} activeClassName='active' className="nav-item nav-link">
      {title}
    </NavLink>
  ));
}

const headerClass = 'container header';
const navClass = 'navbar navbar-expand-lg navbar-dark bg-primary justify-content-between';
const logoClass = 'navbar-brand nav-item nav-link';
const linksClass = 'navbar-nav';

const Header = () => (
  <header className={headerClass}>
    <nav className={navClass}>
      <Link to={routes.home} className={logoClass}>Restaurant</Link>
      <div className={linksClass}>
        { getNavLinks() }
      </div>
    </nav>
  </header>
);

export default Header;
