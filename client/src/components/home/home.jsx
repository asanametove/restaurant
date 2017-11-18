import React from 'react';

import Carousel from '../carousel/carousel.jsx';
import './home.scss';

const imageClass = 'd-block w-100';

const Home = () => {
  return (
    <div className="l-home">
      <Carousel>
        <img className={imageClass}
          src={require('../../../images/home-1.jpg')}
          alt="First slide"
        />
        <img className={imageClass}
          src={require('../../../images/home-2.jpg')}
          alt="Second slide"
        />
        <img className={imageClass}
          src={require('../../../images/home-3.jpg')}
          alt="Third slide"
        />
        <img className={imageClass}
          src={require('../../../images/home-4.jpg')}
          alt="Third slide"
        />
        <img className={imageClass}
          src={require('../../../images/home-5.jpg')}
          alt="Third slide"
        />
      </Carousel>
    </div>
  );
};

export default Home;
