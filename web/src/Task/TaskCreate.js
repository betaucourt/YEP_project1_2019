import React, { Component } from 'react';
import ReactModal from 'react-modal';
import API from '../Api/Api';

import './TaskCreate.css'

import { IconContext } from "react-icons";
import { IoIosClose } from 'react-icons/io';
import { IoIosAdd } from 'react-icons/io';

import defaultAvatar from '../assets/defaultAvatar.jpg'

class TaskCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            state: 0,
            team: this.props.team,
            checklist: [
                {
                    name: 'check 1',
                    finished: false,
                },
                {
                    name: 'check 2',
                    finished: true,
                }
            ]
        }
    }

    getAvatar(id) {
        var asset = defaultAvatar;
        this.props.team.forEach((user) => {
            if (user.id === id) {
                asset = user.avatar
            }
        })
        return <img src={asset} class='avatar' onClick={() => this.removeMember(id)}/>;
    }

    addMember(id) {
        /*let teamCopy = this.state.team
        if (teamCopy.includes(id) === false) {
            teamCopy.push(id)
        }
        this.setState({team: teamCopy})*/
    }

    removeMember(id) {
        /*let teamCopy = []
        this.state.team.forEach(user => {
            if (user != id) {
                teamCopy.push(id)
            }
        })
        this.setState({team: teamCopy})*/
    }

    addCheck() {
        var stateCopy = this.state.checklist;
        stateCopy.push({name: '', finished: false})
        this.setState({checklist: stateCopy});
    }

    editCheck(id, text) {
        let checkCopy = this.state.checklist
        checkCopy[id].name = text.target.value;
        this.setState({checklist: checkCopy})
    }

    removeCheck(id) {
        let checkCopy = this.state.checklist
        checkCopy.splice(id, 1);
        this.setState({checklist: checkCopy})
    }

    submit() {
        console.log(this.props.category)
        console.log(this.state.name)
        console.log(this.state.team[0].id)
        API.postTicket(localStorage.getItem('access_token'), this.props.category, this.state.name, this.state.team[0].id, this.props.category)
        .then((response) => {        
            this.props.close();  
        })
    }

    changeState(id) {
        let checkCopy = this.state.checklist
        checkCopy[id].finished = !checkCopy[id].finished
        this.setState({checklist: checkCopy})
    }

    render() {
        return(
            <ReactModal
                isOpen={this.props.open}
                contentLabel="Create a task"
                id="task-create-modal"
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
                    <input placeholder="Nom de la tâche" class="name" onChange={(text) => this.setState({name: text.target.value})} value={this.state.name}/>
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
                        {this.props.team.map((user) => (
                            <img src={user.avatar} class='avatar' onClick={() => this.addMember(user.id)}/>
                        ))}
                    </div>
                </div>

                {/*<div class="checklist">
                    <p>Checklist : </p>
                    { this.state.checklist.map((item, index) => (
                        <div class="checklist-item">
                            <input placeholder="Nom de l'étape" value={item.name} onChange={(text) => this.editCheck(index, text)}/>
                            <div class={item.finished ? "check-state finished" : "check-state"} onClick={() => this.changeState(index)}/>
                            <IconContext.Provider
                                value={{
                                    className: 'delete'
                                }}
                            >
                                <IoIosClose onClick={() => this.removeCheck(index)}/>
                            </IconContext.Provider>
                        </div>
                    ))}
                    <div class="add-container">
                        <IconContext.Provider
                            value={{
                                color: 'black',
                                className: 'add'
                            }}
                        >
                            <IoIosAdd onClick={() => this.addCheck()}/>
                        </IconContext.Provider>
                    </div>
                        </div>*/}
                <div class="button-container">
                    <button class="button" onClick={() => this.submit()}>Enregistrer</button>
                </div>
            </ReactModal>
        )
    }
}

export default TaskCreate;