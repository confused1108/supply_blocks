
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
import QR_Reader from './qr_reader';
import Transporter from './transporter';
import Admin from './admin';
import Order from './order';
import Seller from './seller';
import Buyer from './buyer';
import Next from './next';
import Api1 from './api-1';
import Api from './api';

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
      <Route path='/transporter/:id' component={Transporter} />
      <Route path='/seller/:id' component={Seller} />
      <Route path='/tobuyer/:id' component={Buyer} />
      <Route path='/qr/:id' component={QR_Reader} />
      <Route path='/admin' component={Admin} />
      <Route path='/checkorders' component={Order} />
      <Route path='/next/:id/:no' component={Next} />
      <Route path='/api1/:id' component={Api1} />
      <Route path='/api/:id' component={Api} />
      </Switch>
      </div>
      </BrowserRouter>

    );
  }
}

export default App;