import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Carousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0
    }

    this.rootHandler = this.rootHandler.bind(this);
  }

  renderIndicators(children, current) {
    return (
      <ol className="carousel-indicators">
        {
          children.map((child, index) => (
            <li
              key={index}
              data-target="indicator"
              data-slide-to={index}
              className={index === current ? 'js-slider active' : 'js-slider'}
            />
          ))
        }
      </ol>
    )
  }

  renderContent(children, current) {
    const defaultClass = 'carousel-item';
    const activeClass = `${defaultClass} active`;

    return (
      <div className="carousel-inner">
        {
          children.map((child, index) => (
            <div key={index} className={index === current ? activeClass : defaultClass}>
              { child }
            </div>
          ))
        }
      </div>
    )
  }

  move(direction) {
    const last = this.props.children.length - 1;

    if (direction === 'prev') {
      this.setState(({current}) => ({current: current > 0 ? current - 1 : last}))
    } else if (direction === 'next') {
      this.setState(({current}) => ({current: current < last ? current + 1 : 0}))
    }
  }

  rootHandler({ target }) {
    const control = target.closest('.js-slider');
    if(!control) return;

    const { slideTo, slide } = control.dataset;
    if (slideTo) this.setState({ current: Number(slideTo)})
    else if (slide) this.move(slide);
  }

  render() {
    const { children } = this.props;
    const { current } = this.state;
    return (
      <div className="carousel slide" data-ride="carousel" onClick={this.rootHandler}>
        { this.renderIndicators(children, current) }
        { this.renderContent(children, current) }
        <a className="carousel-control-prev js-slider" role="button" data-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="sr-only">Previous</span>
        </a>
        <a className="carousel-control-next js-slider" role="button" data-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="sr-only">Next</span>
        </a>
      </div>
    );
  }
}

Carousel.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ])
};

export default Carousel;
