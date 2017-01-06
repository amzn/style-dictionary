import React from 'react';
import Layout from './components/layout';
import Home from './pages/home';
import Colors from './pages/colors';
import Icons from './pages/icons';
import Properties from './pages/properties';
import {Router, Route, browserHistory} from 'react-router';
import Routes from './modules/routes';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <Router history={browserHistory}>
        <Route component={Layout}>
          {Routes.map((route)=> {
            return (
              <Route path={route.path} component={route.component} key={route.path} />
            )
          })}
        </Route>
      </Router>
    );
  }
}

export default App;
