import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';

import './Connection.css'
import '../App.css'

import API from '../Api/Api';
import googleHandler from '../Api/GoogleApi';

import social_img1 from '../assets/connection1.png';
import social_img2 from '../assets/connection2.png';
import social_img3 from '../assets/connection3.png';

const GOOGLE_ID = googleHandler.getId();

const responseGoogle = (response) => {
    console.log(response);
}

class Connection extends Component {

  constructor(props) {
    super(props);
    if (localStorage.getItem('access_token')) {
      this.props.history.push('/boards');
    }
    this.state = {
      images: [
        social_img1,
        social_img2,
        social_img3
       ],
      selectedImage: social_img1,
      value: '',
      email: '',
      password: '',
      error: ''
    };
  }

  componentDidMount() {
    setInterval(() => {
      this.setState(prevState => {
        if (prevState.selectedImage === this.state.images[0]) {
          return {
            selectedImage: this.state.images[1]
          };
        } else if (prevState.selectedImage === this.state.images[1]) {
          return {
            selectedImage: this.state.images[2]
          };
        } else if (prevState.selectedImage === this.state.images[2]) {
          return {
            selectedImage: this.state.images[0]
          };
        }
      });
    }, 5000);
  }

  GoToHome = (Event) => {
      Event.preventDefault();
      this.props.history.push('/')
      return;
  }

  myChangeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({[nam]: val});
  }


  googleLogin = (response) => {
      console.log("login");
      console.log(response);
      console.log(response.profileObj.email);
      console.log(response.accessToken);
      var test = API.registerGoogle(response.profileObj.email, response.accessToken, response.googleId);
      // test.then(data => {
      //     console.log(data.data);
      //     console.log(data.data.User.email);
      //     console.log('email =', data.data.User.email, data.data.User.access_token);
      //     localStorage.setItem('userMail', data.data.User.email);
      //     localStorage.setItem('userName', data.data.User.name);
      //     localStorage.setItem('userToken', data.data.User.access_token);
      //     localStorage.setItem('userGId', data.data.User.googleId);
      //     // this.props.history.push("/logged/activities");
      // })
  }


  Connection = (Event) => {

      if (this.state.email == '')
        this.state.error = 'Erreur : Adresse email obligatoire'

      else if (this.state.password == '')
        this.state.error = 'Erreur : Mot de passe obligatoire'

      API.login(this.state.email, this.state.password)
        .then((response) => {
          console.log(response)
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('refresh', response.refresh_token);
          this.props.history.push('/boards')
        })
        .catch((error) => {
          console.log(error)
        })
  }

  render() {
    return (
      <body>

      <div class="header">
        <h1 class="title-epitrello">EpiTrello</h1>
        <button class='connection-button-signup' onClick={this.GoToHome}>
        Inscription
        </button>
      </div>

      <div class="line">
          <div class="connection-left">
            <img className='connection-img' src={this.state.selectedImage} alt='social netword' />
          </div>

          <div class="connection-right">

            <h2 class="connection-title">Connexion</h2>

            <form class="form">
              <input className='connection-Input-Email' type='email' name='email' placeholder='Adresse email *' onChange={this.myChangeHandler} />
              <input className='connection-Input-Password' type='password' name='password' placeholder='Mot de passe *' onChange={this.myChangeHandler} />
            </form>

            <h2 class="connection-error-text">{this.state.error}</h2>

            <div class="connection-buttons-space">
              <button className='connection-button-signin' onClick={this.Connection}>Se connecter</button>

              <GoogleLogin
                clientId= {googleHandler.getId()}
                render={renderProps => (
                  <button className='connection-button-google-login' onClick={renderProps.onClick} disabled={renderProps.disabled}>Continuer avec Google</button>
                )}
                buttonText='Continuer avec Google'
                onSuccess={this.googleLogin}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
              />
            </div>

          </div>
      </div>

      </body>
    );
  }
}

export default Connection;
