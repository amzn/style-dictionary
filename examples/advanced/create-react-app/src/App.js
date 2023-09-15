import React, { Component } from 'react';
import logo from './logo.svg';
import './App.scss';

// custom components for demo
import ComponentWithSass from './components/with-sass/ComponentWithSass';
import ComponentWithStyledComponents from './components/with-styled-components/ComponentWithStyledComponents';
import ComponentWithCssModules from './components/with-css-modules/ComponentWithCssModules';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <a href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
            <img className="App-logo" src={logo} alt="React logo" />
          </a>
          <div>
            <h3 className="App-description">This app is built with Create React App (CRA)</h3>
            <code>
              More information about CRA:{' '}
              <a
                href="https://github.com/facebook/create-react-app"
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/facebook/create-react-app
              </a>
            </code>
          </div>
        </header>
        <main>
          <ComponentWithSass />
          <ComponentWithStyledComponents />
          <ComponentWithCssModules />
        </main>
      </div>
    );
  }
}

export default App;
