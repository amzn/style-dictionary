import React, { Component } from 'react';
import logo from './css-modules-logo.png';

// import styles from './ComponentWithCssModules.module.css';
import styles from './ComponentWithCssModules.module.scss';

class MyComponent extends Component {
  render() {
    return (
      <div className={styles['component']}>
        <img src={logo} className={styles['component-media']} alt="CSS Modules logo" />
        <div className={styles['component-text']}>
          <h3 className={styles['component-text__description']}>
            This component is styled with CSS Modules and Style Dictionary tokens
          </h3>
          <p className={styles['component-text__reference']}>
            More information about CSS Modules:{' '}
            <a
              className={styles['component-link']}
              href="https://github.com/css-modules/css-modules"
              target="_blank"
              rel="noopener noreferrer"
            >
              github.com/css-modules/css-modules
            </a>
          </p>
        </div>
      </div>
    );
  }
}

export default MyComponent;
