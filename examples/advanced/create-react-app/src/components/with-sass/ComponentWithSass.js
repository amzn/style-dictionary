import React, { Component } from 'react';
import logo from './sass-logo.svg';
import './ComponentWithSass.scss';

class MyComponent extends Component {
  render() {
    return (
      <div className="component">
          <img src={logo} className="component-media" alt="Sass logo" />
          <div className="component-text">
            <h3 className="component-text__description">
              This component is styled with Sass and Style Dictionary tokens
            </h3>
            <p className="component-text__reference">More information about Sass: <a className="component-link" href="https://sass-lang.com" target="_blank" rel="noopener noreferrer">sass-lang.com</a></p>
          </div>
      </div>
    );
  }
}

export default MyComponent;
