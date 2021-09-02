import React from 'react'; 
import {
    Route,
    Switch
  } from 'react-router-dom';

// route used to create/join a room
import Home from './home'
// route used for the game logic 
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