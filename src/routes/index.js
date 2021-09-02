import React from 'react'; 
import {
    Route,
    Switch
  } from 'react-router-dom';

import Home from './home'
import GameRoom from './gameRoom'

const RouteList=()=>
{
  return  (
            <Switch>
            <Route exact path='/' component={Home}></Route>
            <Route exact path='/gameroom' component={GameRoom}></Route>
            </Switch>
          );
}
  
export default RouteList;