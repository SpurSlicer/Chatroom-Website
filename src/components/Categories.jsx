import './Categories.css'
import {Component, useRef, useEffect, useState} from 'react'
import {Messages} from './Messages'


export class Channel extends Component {
    constructor(props) {
        super(props);
        this.name = "test"+Math.random();
        this.messages = new Messages(props);
        this.props = props;
    }
    getName() { return this.name };
    changeName(name) { 
        this.name = name;
    }
    renderDisplayInfo() {
        return (
            <button className="channel_name" onClick={(e) => {this.props.children.setCurrentServer(this)}}>{this.name}</button>
        )
    }
    render(props) {
        return (
            <div className='current_messages'>
                {this.messages.render()}
            </div>
        )
    }
}


export class Category extends Component {
    constructor(props) {
        super(props);
        this.name = "test"+Math.random();
        this.channels = [new Channel(props), new Channel(props)];
    }
    setText(text) { 
        this.text = text;
    }
    getChannelDisplayInfo() {
        const channel_display_infos = [];
        for (const channel of this.channels) {
            channel_display_infos.push(channel.renderDisplayInfo());
        }
        return channel_display_infos;
    }
    getFirstChannel() {
        return this.channels[0].getName();
    }
    renderDisplayInfo() {
        return (
            <div className='category'>
                <label className='category_name'>I am a label</label>
                {this.getChannelDisplayInfo()}
            </div>
        )
    }
    render() {
        return (<></>)
    }
}


export class Categories extends Component {
    constructor(props) {
        super(props);
        this.categories = [new Category(props)]
        this.props = props;
    }
    getFirstChannel() {
        return this.categories[0].getFirstChannel();
    }
    renderChannel() {
        
    }
    getCategoryDisplayInfo() {
        const category_display_infos = [];
        for (const category of this.categories) {
            category_display_infos.push(category.renderDisplayInfo());
        }
        return category_display_infos;
    }
    render() {
        if (this.props.children.current_channels.get(this.props.children.current_server) == "") {
            const new_map = new Map(this.props.children.current_channels.set(this.props.children.current_server, this.getFirstChannel()));
            this.props.children.setCurrentChannel(new_map);
        }
        return (
            <>
            <div className='categories'>
                {this.getCategoryDisplayInfo()}
            </div>
                {/* {this.props.children.current_server.render()} */}
            </>
        )
    }
}