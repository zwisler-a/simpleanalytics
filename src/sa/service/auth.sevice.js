import { REDIRECT_URL } from '../env/env.js';

export class AuthService {
    static getInstance() {
        if (this._instance) return this._instance;
        return (this._instance = new AuthService());
    }

    constructor() {
        this._urls = {
            getToken: 'https://auth.zwisler.dev/api/auth/getToken?signInToken=',
            login: 'https://auth.zwisler.dev/api/auth/login?redirect=' + encodeURIComponent(REDIRECT_URL) + '&realmId=' + '33e39538-2f5a-4f57-8745-e34def1381f3'
        };
    }

    getToken(loginToken) {
        return fetch(this._urls.getToken + loginToken)
            .then(res => res.json())
            .then(res => {
                if (res.error) return (window.location = this._urls.login);
                this._token = res.data;
                window.history.replaceState({}, document.title, '/');
                return this._token;
            });
    }

    async checkLogin() {
        const queryToken = this._getParameterByName('token');
        if (queryToken) return this.getToken(queryToken);
        window.location = this._urls.login;
        return new Promise();
    }

    _getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
}
