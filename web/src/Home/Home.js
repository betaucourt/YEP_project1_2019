import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';

import './Home.css'
import '../App.css'

import API from '../Api/Api';
import googleHandler from '../Api/GoogleApi';

import social_img1 from '../assets/home1.png';
import social_img2 from '../assets/home2.png';
import social_img3 from '../assets/home3.png';

const emailRegex = /^\S+@\S+\.\S+$/;

const GOOGLE_ID = googleHandler.getId();

const responseGoogle = (response) => {
    console.log(response);
}

class Home extends Component {

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
      email_confirmation:'',
      password: '',
      password_confirmation:'',
      full_name: '',
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

  GoToConnection = (Event) => {
      Event.preventDefault();
      this.props.history.push('/connection')
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

  Inscription = (Event) => {

      if (this.state.email == '')
        this.state.error = 'Erreur : Adresse email obligatoire'

      else if (this.state.email_confirmation == '')
        this.state.error = 'Erreur : Adresse email de confirmation obligatoire'

      else if (this.state.password == '')
        this.state.error = 'Erreur : Mot de passe obligatoire'

      else if (this.state.password_confirmation == '')
        this.state.error = 'Erreur : Mot de passe de confirmation obligatoire'

      else if (this.state.full_name == '')
        this.state.error = 'Erreur : Nom complet obligatoire'

      else if (emailRegex.test(this.state.email) == false)
        this.state.error = 'Erreur : Adresse email invalide'

      else if (this.state.email != this.state.email_confirmation)
        this.state.error = 'Erreur : Vos adresses email ne sont pas identiques'

      else if (this.state.password != this.state.password_confirmation)
        this.state.error = 'Erreur : Vos mots de passe ne sont pas identiques'

      API.signUp(this.state.full_name, this.state.email, this.state.password)
        .then((response) => {
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('refresh', response.refresh_token);
          this.props.history.push('/boards')
        })
        .catch((error) => {
          this.state.error = 'Erreur : Veuillez recommencer'
        })
  }

  render() {
    return (
      <body>

      <div class="header">
        <h1 class="title-epitrello">EpiTrello</h1>
        <button class='home-button-signin' onClick={this.GoToConnection}>
        Connexion
        </button>
      </div>

      <div class="line">
          <div class="inscription-left">
            <h2 class="inscription-title">Inscription</h2>

            <form class="form">
              <input className='Home-Input-Email' type='email' name='email' placeholder='Adresse email *' onChange={this.myChangeHandler} />
              <input className='Home-Input-Email' type='email' name='email_confirmation' placeholder="Confirmation de l'adresse email *" onChange={this.myChangeHandler} />
              <input className='Home-Input-Password' type='password' name='password' placeholder='Mot de passe *' onChange={this.myChangeHandler} />
              <input className='Home-Input-Password' type='password' name='password_confirmation' placeholder='Confirmation du mot de passe *' onChange={this.myChangeHandler} />
              <input className='Home-Input-Name' type='name' name='full_name' placeholder='Nom complet *' onChange={this.myChangeHandler} />
            </form>

            <h2 class="home-error-text">{this.state.error}</h2>

            <div class="home-buttons-space">
              <button className='home-button-signup' onClick={this.Inscription}>S'inscrire</button>

              <GoogleLogin
                clientId= {googleHandler.getId()}
                render={renderProps => (
                  <button className='button-google-login' onClick={renderProps.onClick} disabled={renderProps.disabled}>S'inscrire avec Google</button>
                )}
                buttonText='Continuer avec Google'
                onSuccess={this.googleLogin}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
              />
            </div>

          </div>
          <div class="inscription-right">
            <img className='home-img' src={this.state.selectedImage} alt='social netword' />
          </div>
      </div>

      </body>
    );
  }
}

export default Home;
