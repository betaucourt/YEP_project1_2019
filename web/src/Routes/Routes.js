import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Home from '../Home/Home.js';
import Connection from '../Connection/Connection.js';
import Board from '../Board/Board'
import HomeUser from '../Logged/HomeUser';


class Root extends Component {
    render(){
        return(
            <BrowserRouter>
                <div>
                    <Route exact path="/" component={Home}/>
                    <Route exact path="/connection" component={Connection}/>
                    <Route path="/board/:boardId" component={Board}/>
                    <Route exact path="/boards" component={HomeUser}/>
                </div>
            </BrowserRouter>
        );
    }
}

export default Root;
