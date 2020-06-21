import React, { Component } from 'react';
import ReactModal from 'react-modal';
import Api from '../Api/Api';

import './BoardCreate.css'

import { IconContext } from "react-icons";
import { IoIosClose } from 'react-icons/io';
import { IoIosAdd } from 'react-icons/io';

import defaultAvatar from '../assets/defaultAvatar.jpg'

class BoardCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: '',
            team: [],
        }
    }

    getAvatar(id) {
        var asset = defaultAvatar;
        this.props.team.forEach((user) => {
            console.log(user)
            if (user.id === id) {
                asset = user.avatar
            }
        })
        return <img src={asset} class='avatar' onClick={() => this.removeMember(id)}/>;
    }

    addMember(id) {
        let teamCopy = this.state.team
        if (teamCopy.includes(id) === false) {
            teamCopy.push(id)
        }
        this.setState({team: teamCopy})
    }

    removeMember(id) {
        let teamCopy = []
        this.state.team.forEach(user => {
            if (user != id) {
                teamCopy.push(id)
            }
        })
        this.setState({team: teamCopy})
    }

    submit() {
        Api.boardCreate(localStorage.getItem('access_token'), this.state.name, this.state.description)
            .then((response) => {
                this.props.close();
            })
    }

    render() {
        return(
            <ReactModal
                isOpen={this.props.open}
                contentLabel="Create a board"
                id="board-create-modal"
                onRequestClose={() => this.props.close(false)}
                ariaHideApp={false}
                className="content"
                overlayClassName="overlay"
                style={{
                    overlay: {
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    },
                    content: {
                        position: 'absolute',
                        top                   : '50%',
                        left                  : '50%',
                        right                 : 'auto',
                        bottom                : 'auto',
                        marginRight           : '-50%',
                        transform             : 'translate(-50%, -50%)',
                        width: '1000px',
                        border: '1px solid #ccc',
                        background: '#fff',
                        overflow: 'auto',
                        WebkitOverflowScrolling: 'scroll',
                        borderRadius: '4px',
                        outline: 'none',
                        padding: '20px',
                        paddingBottom: '0px'
                    }
                }}
            >
                <div class="name-container">
                    <input placeholder="Nom du projet" class="name" value={this.state.name} onChange={(text) => this.setState({name: text.target.value})}/>
                </div>
                <div class="text-container">
                    <input placeholder="Description du projet" class="description" value={this.state.description} onChange={(text) => this.setState({description: text.target.value})}/>
                </div>
                <div class="members">
                    <div class="assigned">
                        <p>Membres assignés : </p>
                        {this.state.team.map((user) => (
                            this.getAvatar(user)
                        ))}
                    </div>
                    <div class="board-members">
                        <p>Equipe : </p>
                        {this.props.users.map((user) => (
                            <img src={user.avatar} class='avatar' onClick={() => this.addMember(user.id)}/>
                        ))}
                    </div>
                </div>
                <div class="button-container">
                    <button class="button" onClick={() => this.submit()}>Enregistrer</button>
                </div>
            </ReactModal>
        )
    }
}

export default BoardCreate;