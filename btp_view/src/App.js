import React, { Component } from 'react';
import {BrowserRouter,Switch,Route} from 'react-router-dom';
import Dashboard from './dashboard';
import Register from './register';
import Login from './login';
import ForInd from './forind';
import IndRegister from './indregister';
import IndLogin from './indlogin';
import Within from './within';
import National from './national';
import International from './international';
import Final from './final';
import Dashbrd from './cdashboard';
import Add from './add';
import Check from './check';

class App extends Component {
  render() {
    return (

      <BrowserRouter>
      <div className='App'>
      <Switch>
      <Route  exact path='/' component={Dashboard} />
      <Route path='/register' component={Register} />
      <Route path='/login' component={Login} />
      <Route path='/indregister' component={IndRegister} />
      <Route path='/indlogin' component={IndLogin} />
      <Route path='/forind' component={ForInd} />
      <Route path='/within/:id' component={Within} />
      <Route path='/national' component={National} />
      <Route path='/international' component={International} />
      <Route path='/checkpackage/:email' component={Final} />
      <Route path='/dashbrd' component={Dashbrd} />
      <Route path='/package/:id' component={Add} />
      <Route path='/check/:id' component={Check} />
      </Switch>
      </div>
      </BrowserRouter>

    );
  }
}

export default App;