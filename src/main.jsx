import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
//import './App.css'
import { Servers } from './components/Servers'
import { Welcome } from './components/Welcome'

import { auth, db } from '../firebase.js'
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import { compare, genSaltSync, hashSync } from 'bcryptjs-react'

//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'

let instance = null;
let welcome = null;

const salt = genSaltSync(10);

// const database = firebase.database();


function App(props) {
  if (welcome == null) welcome = new Welcome(props);
  const [current_server, setCurrentServer] = useState("");
  const [current_channels, setCurrentChannel] = useState(new Map());
  const [update, setUpdate] = useState(false);
  const [login, setLogin] = useState(null);

  function Authenticate(servers) {
    console.log(`[DEBUG] authenticated user ${login.username}`);
    setLogin({
      "username": login.username,
      "password": login.password,
      "task": true,
      "auth": true,
      "servers": servers
    });
  }

  function Deauthenticate() {
    console.log(`[DEBUG] deauthenticated user ${login.username}`);
    setLogin(null);
  }

  function Signup() {
    const q_check = query(
      collection(db, ("/Users")),
      where("username", "==", login.username)
    );
    getDocs(q_check)
      .then((snapshot) => {
        if (!snapshot.empty) {
          console.log(`[ERROR] User ${login.username} already exists!!`);
          Deauthenticate();
          return;
        }
        const q_add = query(
          collection(db, ("/Users")),
        );
        addDoc(q_add, {
          "username": login.username,
          "password": hashSync(login.password, salt),
          "servers": []
        })
          .then(() => {
            Login();
          });
      });
  }

  function Login() {
    const q = query(
      collection(db, ("/Users")),
      where("username", "==", login.username),
    );
    getDocs(q)
      .then((snapshot) => {
        if (snapshot.empty) {
          console.log(`[ERROR] username or password for ${login.username} dne!!`);
          Deauthenticate();
          return;
        }
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data()
        }));
        if (items.length > 1) {
          console.log(`[ERROR] there are multiple users with the username ${login.username} somehow!!`);
          Deauthenticate();
        }
        console.log(items);
        if (compare(login.password, items[0].data.password)) {
          console.log(`[DEBUG] password entered for user ${login.username} matches!`);
          Authenticate(items[0].data.servers);
        } else {
          console.log(`[ERROR] incorrect password for user ${login.username}`);
          Deauthenticate();
        }
      });
  }


  useEffect(() => {
    console.log(`[DEBUG] Changed current server to ${current_server}`);
    if (current_channels.get(current_server) == undefined) {
      setCurrentChannel((current_channels) => new Map(current_channels.set(current_server, "")));
    }
  }, [current_server]); 
  
  
  useEffect(() => {
    console.log('[DEBUG] Updated DOM');
  }, [update]);
  useEffect(() => {
    console.log('[DEBUG] Current channel had stuff added');
  }, [current_channels]);


  useEffect(() => {
    if (login == null) {
      console.log('[DEBUG] logout occurred');
      return;
    } else if (login.auth) {
      console.log(`[DEBUG] User ${login.username} successfully logged in`, login);
      if (instance == null) {
        instance = new Servers(props);
        instance.setFirstServerAsCurrent();
      }
      return;
    } else {
      console.log('[DEBUG] Attempting login with info', login);
    }
    if (login.task == "login") Login();
    else if (login.task == "signup") Signup();
    else console.log("[ERROR] weird task was entered:", login.task);
  }, [login]);

  props.children.current_server = current_server;
  props.children.setCurrentServer = setCurrentServer;
  props.children.update = update;
  props.children.setUpdate = setUpdate;
  props.children.login = login;
  props.children.setLogin = setLogin;
  props.children.current_channels = current_channels;
  props.children.setCurrentChannel = setCurrentChannel;

  const [user] = useAuthState(auth);

  return (
    <div className='main'>
      {(login == null || !login.auth || (instance == null)) ? (welcome.render()) : (instance.render())}
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App>{{"current_server": null, "setCurrentServer": () => {}}}</App>
  </StrictMode>,
)