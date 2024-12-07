import { auth } from "/firebase.js";
//import {  } from "firebase/auth";
import React, { useEffect, Component } from "react";
import "./Welcome.css";


export class Welcome extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.is_on_login_screen_flag = true;
    }
    logIn(e) {
        // console.log(e);
        e.preventDefault();
        if (e.target[0].value.trim() == "" || e.target[1].value.trim() == "") {
            console.log("[ERROR] actually fill in the input fields you silly goose");
            return;
        }
        const login_info = {
            "username": e.target[0].value,
            "password": e.target[1].value,
            "task": "login",
            "auth": false,
            "servers": []
        };
        this.props.children.setLogin(login_info);
    }
    signUp(e) {
        e.preventDefault();
        if (e.target[0].value.trim() == "" || e.target[1].value.trim() == "") {
            console.log("[ERROR] actually fill in the input fields you silly goose");
            return;
        }
        const login_info = {
            "username": e.target[0].value,
            "password": e.target[1].value,
            "task": "signup",
            "auth": false,
            "servers": []
        };
        this.props.children.setLogin(login_info);
    }
    switchToSignupScreen() { this.is_on_login_screen_flag = false; this.props.children.setUpdate(!this.props.children.update); }
    switchToLoginScreen() { this.is_on_login_screen_flag = true; this.props.children.setUpdate(!this.props.children.update); }
    signOut() {
        this.props.children.setLogin(null);
    }

    getLoginScreen() {
        return (<div className="welcome">
            <h1>Login</h1>
            <p>Please enter your login information or something.</p>
            <form onSubmit={(e) => {this.logIn(e)}}>
                <label for="username">Username:</label><br/>
                <input type="text" className="welcome_input" id="username_input" name="username" placeholder="username"/><br/>
                <label for="password">Password:</label><br/>
                <input type="text" className="welcome_input" id="password_input" name="password" placeholder="password"/>
                <div className="welcome_buttons">
                    <button className="welcome_button" type="submit">
                        Login
                    </button>
                    <button className="welcome_button" type="button" onClick={() => this.switchToSignupScreen()}>
                        Signup
                    </button>
                </div>
            </form> 
        </div>);
    }
    getSignupScreen() {
        return (<div className="welcome">
            <h1>Signup</h1>
            <p>Please enter your information or something.</p>
            <form onSubmit={(e) => {this.signUp(e)}}>
                <label for="username">Username:</label><br/>
                <input type="text" className="welcome_input" id="username_input" name="username" placeholder="username"/><br/>
                <label for="password">Password:</label><br/>
                <input type="text" className="welcome_input" id="password_input" name="password" placeholder="password"/>
                <div className="welcome_buttons">
                    <button className="welcome_button" type="submit">
                        Signup
                    </button>
                    <button className="welcome_button" type="button" onClick={() => this.switchToLoginScreen()}>
                        Login
                    </button>
                </div>
            </form> 

        </div>);
    }

    render() {
        return (<>{(this.is_on_login_screen_flag) ? this.getLoginScreen() : (this.getSignupScreen())}</>); 
    }
}

export default Welcome;