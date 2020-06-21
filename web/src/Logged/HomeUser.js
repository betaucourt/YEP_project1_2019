import React, { Component } from 'react';
import API from '../Api/Api';
import BoardCreate from './BoardCreate';

import '../App.css'
import './HomeUser.css'

import { IconContext } from "react-icons";
import { MdFavorite } from 'react-icons/md';
import { MdFavoriteBorder } from 'react-icons/md';
import { MdSettings } from 'react-icons/md';
import { MdPowerSettingsNew } from 'react-icons/md';

import defaultAvatar from '../assets/defaultAvatar.jpg'

class HomeUser extends Component {

    constructor(props) {
        super(props);
        if (!localStorage.getItem('access_token')) {
            this.props.history.push('/');
        }
        this.state = {
            user: {
                name: '',
                avatar: defaultAvatar,
            },
            error: '',
            projects: [/*
                {
                    id: 0,
                    title: 'test1',
                    favorite: true,
                },
                {
                    id: 1,
                    title: 'test2',
                    favorite: false,
                },
                {
                    id: 2,
                    title: 'test3',
                    favorite: true,
                },
                {
                    id: 3,
                    title: 'test4',
                    favorite: false,
                },*/
            ],
            modal: false,
            users: [],
        };
        this.setBoardTask = this.setBoardTask.bind(this);
    }

    componentDidMount() {
        API.getUser(localStorage.getItem('access_token'))
            .then((response) => {
                this.setState({
                    user: {
                        name: response.username,
                        avatar: response.avatar ? response.avatar : defaultAvatar
                    },
                    projects: response.projects
                });
            })
            .catch((error) => {
                this.logout()
            })
    }

    logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh');
        this.props.history.push('/');
    }

    myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({[nam]: val});
    }

    setBoardTask(state) {
        this.setState({modal: state});
    }


    render() {
        return (
            <body>
                <div class="header">
                    <h1 className="title-epitrello left-header" onClick={() => this.props.history.push('/boards')}>EpiTrello</h1>
                    <div class="right-header">
                        <p class="username">{this.state.user.name}</p>
                        <img src={this.state.user.avatar} class="avatar"/>
                        <IconContext.Provider
                                value={{
                                    className: 'settings'
                                }}
                            >
                                <MdSettings/>
                        </IconContext.Provider>
                        <IconContext.Provider
                                value={{
                                    className: 'logout'
                                }}
                            >
                                <MdPowerSettingsNew onClick={() => this.logout()}/>
                        </IconContext.Provider>
                    </div>
                </div>
                <h2 class="homeUser-categories-text">Vos tableaux favoris</h2>
                <section class="card">
                    { this.state.projects && this.state.projects.map((project) => (
                        project.favorite &&
                            <div class="card--content" onClick={() => this.props.history.push('/board/' + project.id)}>
                                <h2 class="homeUser-tab-title-text">{project.name}</h2>
                            </div>
                    ))}
                </section>

                <h2 class="homeUser-categories-text">Vos tableaux</h2>
                <button className='homeUser-creation-button' onClick={() => this.setBoardTask(true)}>Créer un tableau</button>
                <section class="card">
                    { this.state.projects && this.state.projects.map((project) => (
                        <div class="card--content" onClick={() => this.props.history.push('/board/' + project.id)}>
                            <h2 class="homeUser-tab-title-text">{project.name}</h2>
                        </div>
                    ))}
                </section>
                <BoardCreate open={this.state.modal} users={this.state.users} close={this.setBoardTask}/>
            </body>
        );
    }
}

export default HomeUser;
