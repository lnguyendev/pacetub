import React, { Component } from 'react';
import jwt_decode from 'jwt-decode';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { setCurrentUser, logoutUser } from './actions/authActions';
import setAuthToken from './utils/setAuthToken';
import { Provider } from 'react-redux';
import store from './store';

import './App.scss';

import PrivateRoute from './components/common/PrivateRoute';

import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';

if (localStorage.jwtToken) {
  setAuthToken(localStorage.jwtToken);
  const decoded = jwt_decode(localStorage.jwtToken);
  store.dispatch(setCurrentUser(decoded));

  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser());
    window.location.href = '/';
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Switch>
              <Route exact path="/" component={Login} />
              <Route exact path="/register" component={Register} />
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
