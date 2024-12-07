import { Categories } from "./Categories";
import "./Servers.css"
import {Component, useRef, useEffect, useState} from 'react'

export class Server extends Component {
    constructor(props, server_name) {
        super(props);
        this.props = props;
        this.server_name = server_name;
        this.categories = new Categories(props);
    }
    render(props) {
        return (
            <div className='server'>
                {this.categories.render()}
            </div>
        )
    }
    changeCurrentServer(e) {
        this.props.children.setCurrentServer(e.target.innerText);
    }
    renderServerSelectInfo() {
        return (
            <button className='server_select_info' onClick={(e) => this.changeCurrentServer(e)}>
                {this.server_name}
            </button>
        )
    }
}

export class Servers extends Component {
    constructor(props) {
        super(props);
        this.servers = new Map();
        for (let i of props.children.login.servers) {
            this.servers.set(i, new Server(props, i));
        }
        this.props = props;
    }
    addServer(server) {
        // this.servers.push(server);
    }
    setFirstServerAsCurrent() {
        this.props.children.setCurrentServer(this.servers.keys().next().value);
    }
    createServer(server_name) {
        this.servers.set(server_name, new Server(props, server_name));
    }
    getServerSelectInfo() {
        const server_select_info = [];
        for (const [server_name, server] of this.servers) server_select_info.push(server.renderServerSelectInfo());
        return server_select_info;
    }
    render(props) {
        const server = this.servers.get(this.props.children.current_server);
        if (server == undefined) {
            return (<></>);
        }
        return (
            <>
            <div className='servers'>
                {this.getServerSelectInfo()}
            </div>
            {this.servers.get(this.props.children.current_server).render()}
            </>
        )
    }
}
