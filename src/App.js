import React from 'react';
import './App.css';
import Post from "./Post";
import {useState, useEffect} from "react";
import {db, auth} from './firebase';
import {Modal} from '@material-ui/core';
import {makeStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import ImageUpload from "./ImageUpload";
import InstagramEmbed from 'react-instagram-embed';


function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));


function App() {

    const classes=useStyles();
    const [posts, setPosts]=useState([]);
    const [open, setOpen]=useState(false);
    const [modalStyle]= React.useState(getModalStyle);

    const [username, setUsername]=useState('');
    const [email, setEmail]=useState('');
    const [password, setPassword]=useState('');
    const [user, setUser]=useState(null);
    const [openSignIn,setOpenSignIn]=useState(false);



    useEffect(() => {
       const unsubscribe= auth.onAuthStateChanged((authUser) =>{
            if(authUser){
                //user has logged in
                console.log(authUser);
                setUser(authUser);

                if(authUser.displayName){
                    // dont update username
                }else {
                    //if we just created someone...
                    return authUser.updateProfile({
                        displayName: username
                    });
                }
            } else {
                //user has logged out
                setUser(null);
            }
        });

        return()=>{
            //perform some clean up actions
            unsubscribe();
        }

    }, [user, username]);

    useEffect(()=>{//orderby-new post will appear in the top
        db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot =>{
            setPosts(snapshot.docs.map(doc => ({
                id: doc.id,
                post: doc.data()
            })));
        })
    },[]); //rendering posts(all the data) on the page from database


    const signUp = (event) =>{
        event.preventDefault();
        auth.createUserWithEmailAndPassword(email, password)
            .then((authUser)=> {
                return authUser.user.updateProfile({
                    displayName:username
                })
            })
            .catch((error) => alert(error.message))
    };

    const signIn =(event) => {
        event.preventDefault();

        auth.signInWithEmailAndPassword(email,password)
            .catch((error)=>alert(error.message))

        setOpenSignIn(false);
    };


    return (
    <div className="app">


        <Modal
            open={open}
            onClose={() => setOpen(false)}
        >
            <div style={modalStyle} className={classes.paper}>
                <form className="app__signup">
                <center>
                    <img
                        className="app__headerImage"
                        height="40px;"
                        src="https://toogreen.ca/instagreen/img/instagreen.svg"
                        alt=""
                    />
                </center>
                    <Input
                        type="text"
                        placeholder="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <Input
                        placeholder="email"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Input
                        placeholder="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button type="submit" onClick={signUp} >Sign Up</Button>
                </form>
            </div>

        </Modal>
        <Modal
            open={openSignIn}
            onClose={() => setOpenSignIn(false)}
        >
            <div style={modalStyle} className={classes.paper}>
                <form className="app__signup">
                    <center>
                        <img
                            className="app__headerImage"
                            height="40px;"
                            src="https://toogreen.ca/instagreen/img/instagreen.svg"
                            alt=""
                        />
                    </center>

                    <Input
                        placeholder="email"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Input
                        placeholder="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button type="submit" onClick={signIn} >Sign In</Button>
                </form>
            </div>

        </Modal>
      <div className="app__header">
          <img
              className="app__headerImage"
              src="https://toogreen.ca/instagreen/img/instagreen.svg"
              alt=""
          />
          { user?(
              <Button onClick={() => auth.signOut()}>Logout</Button> //if user is signed in(exists) to sign out
          ):(
              <div className="app__loginContainer">
                  <Button onClick={() => setOpen(true)} >Sign In</Button>
                  <Button onClick={() => setOpen(true)} >Sign Up</Button>
              </div>
          )}

      </div>
        <div className="app__posts">
            <div className="app__postsLeft">
                {
                    posts.map(({id,post}) => (
                        <Post key={id} postId={id} username={post.username} user={user} caption={post.caption} imageUrl={post.imageUrl}/>
                    ))
                }
            </div>
            <div className="app__postsRight">
                <InstagramEmbed
                    url='https://instagr.am/p/Zw9o4/'
                    maxWidth={320}
                    hideCaption={false}
                    containerTagName="div"
                    protocol=""
                    injectScript
                    onLoading={() => {}}
                    onSuccess={() => {}}
                    onAfterRender={() => {}}
                    onFailure={() => {}}
                />
            </div>


        </div>
        {user?.displayName ? (
            <ImageUpload username={user.displayName}/>
        ): (
            <h3>Sorry you need to login to upload</h3>
        )}


    </div>
  );
}

export default App;
