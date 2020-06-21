import React, { Component } from 'react';
import API from '../Api/Api';
import TaskCreate from '../Task/TaskCreate'

import '../App.css'
import './Board.css'

import { IconContext } from "react-icons";
import { MdFavorite } from 'react-icons/md';
import { MdFavoriteBorder } from 'react-icons/md';
import { MdSettings } from 'react-icons/md';
import { MdPowerSettingsNew } from 'react-icons/md';
import { IoIosCloseCircle, IoIosLogOut } from 'react-icons/io';
import { IoIosClose } from 'react-icons/io';
import { IoIosAdd } from 'react-icons/io';
import { IoIosArrowDown } from 'react-icons/io';
import { IoIosArrowUp } from 'react-icons/io';

import defaultAvatar from '../assets/defaultAvatar.jpg'

class Board extends Component {
    constructor(props) {
        super(props);
        if (!localStorage.getItem('access_token')) {
            this.props.history.push('/');
        }
        this.state = {
            user: {
                id: 0,
                name: '',
                avatar: defaultAvatar,
                favorite: [],
            },
            id: 0,
            title: '',
            favorite: false,
            categories: [
                /*{
                    id: 0,
                    name: 'catégorie 1',
                    shown: false,
                    tasks: [
                        {
                            id: 0,
                            name: 'task 1',
                            state: 2,
                            team: [0]
                        },
                        {
                            id: 1,
                            name: 'task 2',
                            state: 1,
                            team: [1]
                        },
                        {
                            id: 2,
                            name: 'task 3',
                            state: 3,
                            team: [1, 2]
                        },
                        {
                            id: 3,
                            name: 'task 4',
                            state: 0,
                            team: [0, 1, 2, 3]
                        }
                    ]
                },
                {
                    id: 1,
                    name: 'catégorie 2',
                    shown: false,
                    tasks: [

                    ]
                }*/
                {
                    id: 0,
                    name: 'Urgent',
                    shown: false,
                    tasks: [],
                    user: {}
                },
                {
                    id: 1,
                    name: 'A faire',
                    shown: false,
                    tasks: [],
                    user: {}
                },
            ],
            team: [
                {
                    id: 0,
                    name: 'user1',
                    avatar: defaultAvatar,
                },
            ],
            chat: [
                {
                    user: 0,
                    msg: ' user1 a rejoint',
                },
                {
                    user: 1,
                    msg: 'user2 a rejoint',
                },
                {
                    user: 0,
                    msg: 'bonjour ceci est un message sur plusieurs lignes, j\'espere que ca passe',
                },
                {
                    user: 0,
                    msg: 'cette fois c\'est pour test les messages multiple',
                },
                {
                    user: 1,
                    msg: 'spam pour overflow',
                },
            ],
            lastUserMsg: -1,
            catForTaskCreate: -1,
            taskCreate: false,
        }
        this.setCreateTask = this.setCreateTask.bind(this);

    }

    componentDidMount() {
        const token = localStorage.getItem('access_token')
        API.getUser(token)
            .then((response) => {
                this.setState({
                    user: {
                        id: response.id,
                        name: response.username,
                        avatar: response.avatar ? response.avatar : defaultAvatar,
                        favorite: response.favorite ? response.favorite : [],
                    },
                    team: [
                        {
                            id: response.id,
                            name: response.username,
                            avatar: response.avatar ? response.avatar : defaultAvatar,
                            favorite: response.favorite ? response.favorite : [],
                        }
                    ]
                })
            })
            .catch((error) => {
                this.logout()
            })
        API.getBoard(token, this.props.match.params.boardId)
            .then((response) => {
                this.setState({
                    id: response.id,
                    title: response.name,
                    team: response.users,
                    description: response.description,
                    favorite: this.state.user.favorite.includes(response.id),
                })
                var cat = this.state.categories
                console.log(response.tickets)
                response.tickets.forEach((item) => {
                    console.log(item.id)
                    API.getTicket(token, this.state.id, item.id)
                    .then((reponse) => {
                        console.log(reponse.Ticket)
                        if (reponse) {
                            console.log(reponse.Ticket._category)
                            cat[reponse.Ticket._category].tasks.push(reponse.Ticket)
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                    })
                })
                this.setState({categories: cat});
            })
            .catch((error) => {
                console.log(error)
            })
        console.log(this.state.categories)
    }

    logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh');
        this.props.history.push('/');
    }

    favorite() {
        var user = this.state.user;
        var array = [];

        console.log(user.favorite)
        if (user.favorite.includes(this.state.id)) {
            user.favorite.forEach((item) => {
                if (item.id !== this.state.id) {
                    array.push(this.state.id);
                }
            });
            user.favorite = array;
        } else {
            user.favorite.push(this.state.id);
        }
        this.setState({user});
        API.putUser(localStorage.getItem('access_token'), user)
    }

    changeShown(id) {
        let categoriesCopy = this.state.categories
        categoriesCopy = categoriesCopy.map((item) => {
            if (item.id === id) {
                item.shown = !item.shown;
            }
            return item;
        })
        this.setState({categories: categoriesCopy})
    }

    addCat() {        
    }

    deleteCategory(id) {
        var shownList = [];
        this.state.categories.forEach(item => {
            if (item.shown) {
                shownList.push(item.id);
            }
        })
//        API.deleteCategory(id);
//        API.getCategories();
        let categoriesCopy = this.state.categories
        categoriesCopy = categoriesCopy.map((item) => {
            item.shown = shownList.includes(item.id);
            return item;
        })
        this.setState({categories: categoriesCopy})
    }

    deleteTask(catId, taskId) {
        var shownList = [];
        this.state.categories.forEach((item, index) => {
            if (item.shown) {
                shownList.push(item.id);
            }
        })
        API.deleteTask(localStorage.getItem('access_token'), this.state.id, taskId)
        .then((response) => {
            let categoriesCopy = this.state.categories
            categoriesCopy = categoriesCopy.map((item) => {
                item.shown = shownList.includes(item.id);
                return item;
            })
            this.setState({categories: categoriesCopy})
            this.force();
        })
    }

    getAvatar(id) {
        this.state.team.forEach((user) => {
            if (user.id === id) {
                return user.avatar;
            }
        })
        return defaultAvatar;
    }

    displayAvatar(id, lastUser) {
        //if (lastUser !== id) {
            var avatar = this.getAvatar(id);
            return <img class="avatar" src={avatar}/>;
        //}
        return <img class="avatar" src={defaultAvatar} hidden/>
    };

    postComment(text) {
        //API.postComment(this.state.user.id, this.state.id, text);
    }

    setCreateTask(state) {
        this.setState({taskCreate: state});
    }

    editCat(id, text) {
        let categoriesCopy = this.state.categories
        categoriesCopy = categoriesCopy.map((item) => {
            if (item.id === id) {
                item.name = text.target.value;
            }
            return item;
        })
        this.setState({categories: categoriesCopy})   
    }

    changeState(id, taskId) {
        let categoriesCopy = this.state.categories
        categoriesCopy = categoriesCopy.map((item) => {
            item.tasks.map((task) => {
                if (task.id === taskId && task.state < 2) {
                    task.state = task.state + 1;
                }
            })
            return item;
        })

        this.setState({categories: categoriesCopy})      
    }


    render() {
        const stateClass = ['pending', 'en-cours', 'finis', 'bloque'];
        const stateLabel = ['Pending', 'En cours', 'Finis', 'Bloqué'];
        const fav = this.state.favorite ? <MdFavorite onClick={() => this.favorite()}/> : <MdFavoriteBorder onClick={() => this.favorite()}/>;
        var lastUserMsg = -1;
        return(
            <body>
                <div class="header">
                    <h1 className="title-epitrello left-header" onClick={() => this.props.history.push('/boards')}>EpiTrello</h1>
                    <div class="mid-header">
                        <IconContext.Provider
                            value={{
                                color: this.state.favorite ? '#F97171' : 'black',
                                className: 'fav-button',
                            }}
                        >
                            {fav}
                        </IconContext.Provider>
                        <p class="board-title">{this.state.title}</p>
                    </div>
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
                <div class="body">
                    {/*<div class="chat">
                        <div class="feed">
                            { this.state.chat.map((msg) => (
                                <div class="message">
                                    <div class="avatar-container">
                                        { this.displayAvatar(msg.user, lastUserMsg) }
                                    </div>
                                    <div class="text-container">
                                        <p class="text">{msg.msg}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div class="chat-input">
                            <input placeholder="Entrez votre message...." onSubmit={(text) => this.postComment(text)}/>
                        </div>
                            </div>*/}
                    <div class="board">
                        {this.state.categories.map((category, index) => (
                            <div class="category">
                                <div class="title">
                                    {
                                        category.shown ? 
                                            <IconContext.Provider
                                                value={{
                                                    color: 'white',
                                                    className: 'arrow-up'
                                                }}
                                            >
                                                <IoIosArrowUp onClick={() => this.changeShown(category.id)}/>
                                            </IconContext.Provider>
                                        :
                                            <IconContext.Provider
                                                value={{
                                                    color: 'white',
                                                    className: 'arrow-down'
                                                }}
                                            >
                                                <IoIosArrowDown onClick={() => this.changeShown(category.id)}/>
                                            </IconContext.Provider>
                                    }
                                    <p class="category-title">{category.name}</p>
                                </div>
                                <div class="category-content">
                                    {category.shown && category.tasks.map((task, index) => (
                                        <div class="task">
                                            <p class="title">{task.name}</p>
                                            <div class="right-part">
                                                <img src={defaultAvatar} class="assigned-user"/>
                                                <div class={'state-container ' + stateClass[task.state]} onClick={() => this.changeState(category.id, task.id)}>
                                                    <p class="state">{stateLabel[task.state]}</p>
                                                </div>
                                                <div class="delete-container">
                                                    <IconContext.Provider
                                                        value={{
                                                            color: 'white',
                                                            className: 'delete'
                                                        }}
                                                    >
                                                        <IoIosClose onClick={() => this.deleteTask(category.id, task.id)}/>
                                                    </IconContext.Provider>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    { category.shown &&
                                        <div class="add-container">
                                            <IconContext.Provider
                                                value={{
                                                    color: 'black',
                                                    className: 'add'
                                                }}
                                            >
                                                <IoIosAdd onClick={() => this.setState({taskCreate: true, catForTaskCreate: category.id})}/>
                                            </IconContext.Provider>
                                        </div>
                                    }
                                </div>
                            </div>
                        ))}
                        {/*<button class="new-category" onClick={() => this.addCat()}>Nouvelle catégorie</button>*/}
                    </div>
                </div>
                <TaskCreate open={this.state.taskCreate} category={this.state.catForTaskCreate} team={this.state.team} close={this.setCreateTask}/>
                {/*<TaskEdit open={this.state.taskEdit}/>
                <CategoryCreate open={this.state.categoryCreate}/>
                <CategoryEdit open={this.state.categoryEdit}/>*/}
            </body>
        );
    }
}

export default Board;