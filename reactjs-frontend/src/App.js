import React from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import ListClientComponent from './components/ListClientComponent';
import HeaderComponent from './components/HeaderComponent';
import FooterComponent from './components/FooterComponent';
import CreateClientComponent from './components/CreateClientComponent';
import UpdateClientComponent from './components/UpdateClientComponent';
import ViewClientComponent from './components/ViewClientComponent';

function App() {
  return (
    <div>
        <Router>
              <HeaderComponent />
                <div className="container">
                    <Switch> 
                          <Route path = "/" exact component = {ListClientComponent}></Route>
                          <Route path = "/clients" component = {ListClientComponent}></Route>
                          <Route path = "/add-client/:id" component = {CreateClientComponent}></Route>
                          <Route path = "/view-client/:id" component = {ViewClientComponent}></Route>
                          {/* <Route path = "/update-client/:id" component = {UpdateClientComponent}></Route> */}
                    </Switch>
                </div>
              <FooterComponent />
        </Router>
    </div>
    
  );
}

export default App;