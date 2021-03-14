import React, {useState} from 'react';
import Button from "@material-ui/core/Button";
import {storage, db} from "./firebase";
import firebase from "firebase";
import './ImageUpload.css';


function ImageUpload({username}) {

    const[caption, setCaption]=useState('');
    const[image, setImage]=useState(null);
    const[progress, setProgress]=useState(0);

  const handleChange =(e) =>{
      if(e.target.files[0]){
          setImage(e.target.files[0]);//if we suddenly choose 2 files, it picks the first one
      }
  };

  const handleUpload=()=>{
        const uploadTask=storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_change",
            (snapshot)=>{
                //progress function
                const  progress= Math.round((snapshot.bytesTransferred/snapshot.totalBytes)*10);
                setProgress(progress);
            },
            (error)=>{
                console.log(error);
                alert(error.message);
            },
            () =>{
                //complete function

                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url=>{
                        //post image inside the db
                        db.collection("posts").add({
                            //the newest post will be shown on the top
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(), //allows to see all the posts by correct timings
                            caption: caption,
                            imageUrl: url,
                            username:username

                        });


                        //once we uploaded the image, set it back as we started(new empty form appears
                        setProgress(0);
                        setCaption("");
                        setImage(null);
                    })
            }
        )
  };

    return(
      <div className="imageupload">
          <progress className="imageupload__progress" value={progress} max="100"/>
          <input type="text" placeholder='Enter a caption...' onChange={event => setCaption(event.target.value)} value={caption}/>
          <input type="file" onChange={handleChange}/>
          <Button onClick={handleUpload}>Upload</Button>
      </div>
    );

}

export default ImageUpload;