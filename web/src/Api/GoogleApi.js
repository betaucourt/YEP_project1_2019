import React, {Component} from 'react';
import GoogleRegister from 'react-google-login';
import GoogleLogin from 'react-google-login';

const gogoleId = '868340539791-ttf5vqfac4q2vra5dpemi9u55jng6bv9.apps.googleusercontent.com';

const responseGoogle = (response) => {

    if (!response.error) {
        console.log(response.googleId);
        console.log(response.accessToken);
    }
    console.log(response);
}

const googleHandler = {
    getId: function() {
        return '868340539791-ttf5vqfac4q2vra5dpemi9u55jng6bv9.apps.googleusercontent.com';
    },

    handleOauth: function(response) {
        console.log('toto');
        console.log(response);
    },

}
export default googleHandler
