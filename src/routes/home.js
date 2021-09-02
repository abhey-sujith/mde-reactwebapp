import {
    useHistory
  } from 'react-router-dom';
import { useEffect,useState } from "react";
import TextField from '@material-ui/core/TextField';


function Home(props) {

    let history = useHistory();

    const [value1, setValue1] = useState("");
    const [name, setName] = useState("");
    const [helperTextName, setHelperTextName] = useState("");
    const [errorNameField, setErrorNameField] = useState(false);
    const [helperTextRoomId, setHelperTextRoomId] = useState("");
    const [errorRoomId, setErrorRoomId] = useState(false);
    const [roomId, setRoomId] = useState(null);
    const [localStorageName, setLocalStorageName] = useState("");


    useEffect(()=>{
        var rId = localStorage.getItem("roomId");
        var n = localStorage.getItem("name");
        if(rId){
            setRoomId(rId)
            setLocalStorageName(n)
        }
    },[])

    const onJoinButtonPressed = (e) => {
        console.log('You clicked submit.',value1);
        if(value1===""){
            setHelperTextRoomId("Enter the room id to join")
            setErrorRoomId(true)
            if(name===""){
                setHelperTextName("")
                setErrorNameField(true)
            }
            e.preventDefault();
        }
      }


    const handleFormSubmit =(e) =>{
    e.preventDefault();
    console.log('You clicked submit2.');


    if (value1){
        history.push("/gameroom",{type:'join',roomid:value1, name:name.trim()});
    }else{
        history.push("/gameroom",{
            type: "create" ,
            name:name.trim()
                });
    }
    
    }

    const onReconnectPressed =(e) => {
    e.preventDefault();
    console.log('You clicked submit3.');
    history.push("/gameroom",{
        type: "reconnect" ,
        name:localStorageName
            });
    }


    return (
      <div className="App">
        <div className="App-header">

            <form autoComplete="off" onSubmit={handleFormSubmit}>
            
            <h1>Enter Name</h1>

            <TextField 
            error ={errorNameField}
            required
            helperText={helperTextName} 
            id="outlined-basic" 
            label="Name" variant="outlined" 
            value={name} 
            onChange={(v)=>{
                if(!(/[^a-zA-Z ]/).test(v.target.value)){
                setName(v.target.value.toUpperCase())
                if (v.target.value.length < 60) {
                    setHelperTextName("")
                    setErrorNameField(false)
                } 
                else {
                    setHelperTextName("")
                    setErrorNameField(true)
                }
            }}
            }/>

            <h1>Create Room</h1>

            <button type="submit">Create</button>


            <h1>Join</h1>

            <TextField 
            error ={errorRoomId}
            helperText={helperTextRoomId} 
            id="outlined-basic" 
            label="Room id" 
            variant="outlined" 
            value={value1} 
            onChange={(v)=>{
                if(!(/[^a-zA-Z]/).test(v.target.value)){
                    setValue1(v.target.value.toUpperCase())
                    if (v.target.value.length >= 4 && v.target.value.length <5) {
                        setHelperTextRoomId("")
                        setErrorRoomId(false)
                    } 
                    else {
                        setHelperTextRoomId("")
                        setErrorRoomId(true)
                    }
            }
            }}/>

            <button type ='submit' onClick={onJoinButtonPressed}>Join</button>

            </form>

            {roomId?<form onSubmit={onReconnectPressed}>
            <h1>{("Reconnect to Room " +roomId +" as "+localStorageName)}</h1>
            <button type="submit">Create</button>
            </form>:null}
     
        </div>
      </div>
    );
  }

  export default Home;