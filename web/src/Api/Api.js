var axios = require('axios');

const baseUrl = "http://localhost:8000";
const api = "/api/";
const loginUrl = baseUrl + "/oauth/v2/token"
const registerUrl =  baseUrl + api + "user"
const projectUrl =  baseUrl + api + "project"
// const updateUserPseudoUrl =  baseUrl + api + "users/me"
// const getUser = baseUrl + api + 'users/user'
// const modifyUser = baseUrl + api + 'users/modify';
const registerGoogle = baseUrl + api + 'users/google';

const clientId = '4_5ur2o6gw1748wo44o4w48484w4ccsoogkcg8kksg8cookckkck';
const secret = '6bfgaloifgg0g48wswg804sk0w0wcwc8wsccc0o8kggw4c004s';


module.exports = {

    registerGoogle(userMail, userToken, userId) {
        console.log("send api");
        console.log(userMail, userToken);
        if (userMail === null && userMail === undefined && userToken === null && userToken === undefined)
            return;
        console.log("api check");
        return axios.post(registerGoogle, {
            headers: {
              'Content-Type': 'x-www-form-urlencoded'
            },
            'userMail': userMail,
            'userToken': userToken,
            'userId': userId,
        })
        .then((response) => {
            console.log(response);
            return response;
        })
        .catch((error) => {
            console.log(error);
            return error;
        })
    },

    login(username, password) {
        return axios.post(loginUrl, {
            headers: {
                'Content-Type': 'x-www-form-urlencoded',
                'Access-Control-Allow-Origin': '*'
            },
            'username': username,
            'password': password,
            'client_id': clientId,
            'client_secret': secret,
            'grant_type': 'password'
        })
        .then((response) => {
            console.log(response)
            return response.data
        })
        .catch((error) => {
            console.log(error)
            return error
        })
    },

    signUp(username, email, password) {
        console.log(username)
        console.log(email)
        console.log(password)
        console.log(registerUrl)
        return axios.post(registerUrl, {
            'username': username,
            'email': email,
            'password': password
        })
        .then((response) => {
            return this.login(username, password);
        })
        .then((error) => {
            console.log(error)
            return error
        })
    },

    getUser(token) {
        return axios.get(registerUrl, {
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            return error
        })
    },

    getBoards(token) {
        return axios.get(projectUrl, {
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        })
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            return error
        })
    },

    getBoard(token, id) {
        console.log(projectUrl + "/" + id)
        return axios.get(projectUrl + "/" + id, {
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        })
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            return error
        })
    },

    boardCreate(token, name, description) {
        return axios.post(projectUrl, {
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
            'name': name,
            'description': description
        })
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            return error
        })
    },

    getTicket(token, project, ticket) {
        return axios.get(projectUrl + '/' + project + '/ticket/' + ticket, {
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token,
            } 
        })
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            return error
        })
    },

    putUser(token, user) {
        return axios.put(registerUrl, {
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
            favorite: user.favorite.join(',')
        })
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            return error
        })
    },

    postTicket(token, project, name, user, cat) {
        return axios.post(projectUrl + '/' + project + '/ticket', {
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
            name: name,
            description: '',
            user: user,
            category: cat
        })
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            return error
        })
    },

    deleteTask(token, project, ticket) {
        return axios.delete(projectUrl + '/' + project + '/ticket/' + ticket, {
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token,
            } 
        })
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            return error
        })
    }
}
