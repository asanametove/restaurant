import React from 'react';
import PropTypes from 'prop-types';

const NavigationBar = ({children}) => (
  <nav className="main-nav">
    <ul>
      {
        children.map(child => (
          <li key={child.props.to}>
            {child}
          </li>
        ))
      }
    </ul>
  </nav>
);

NavigationBar.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node)
}

export default NavigationBar;
