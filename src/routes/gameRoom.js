import { useEffect,useState ,useRef} from "react";
import * as Colyseus from 'colyseus.js'
import { useHistory } from "react-router-dom";

function GameRoom(props) {
    
    const history = useHistory();
    let room_instance= useRef(null)
    const [value, setValue] = useState("");

    // on entering connect to the client
    useEffect(()=>{ 

      // final endpoint - ws://localhost:2567
      var endpoint = window.location.protocol.replace("http", "ws") + "//" + window.location.hostname;
      if (window.location.port && window.location.port !== "80") { endpoint += ":2567" }
      
      console.log(endpoint);
      //connect to endpoint using client
      let client = new Colyseus.Client(endpoint);

      // function runs when connection is established either by create/join/reconnect
      // used also to add additional functions like onMessage/onLeave to the room
      // store the connected session to local storage so that reconnection can be tried
      const onjoin = () => {
        room_instance.current.onMessage("status", (message) => console.log(message));
        room_instance.current.onLeave(() => console.log("Bye, bye!"));

          localStorage.setItem("roomId", room_instance.current.id);
          localStorage.setItem("sessionId", room_instance.current.sessionId);
          localStorage.setItem("name", props.history.location.state.name);
      }

      // type can contain 3 things (create/join/reconnect)
      if(props?.history?.location?.state?.type==='create'){

        // create a new room 
        client.create("my_room").then(room => {
          room_instance.current=room;
          onjoin();

          console.log("created room");
          room.onStateChange.once(function(state) {
              console.log("initial room state:", state);
          });
    
          // new room state
          room.onStateChange(function(state) {
              // this signal is triggered on each patch
          });
    
          // listen to patches coming from the server
          room.onMessage("messages", (message) =>{
            setValue(message);
          });
         
        }).catch((e)=>{

          console.log('error');
          console.log(e);
          alert('could not create');
          history.goBack();
        });
      }
      else if(props?.history?.location?.state?.type==='join'){

      // join a room by id
        client.joinById(props.history.location.state.roomid).then(room => {
          room_instance.current=room;
          onjoin();

          console.log("joined room");
          room.onStateChange.once(function(state) {
              console.log("initial room state:", state);
          });
    
          // new room state
          room.onStateChange(function(state) {
              // this signal is triggered on each patch
          });
    
          // listen to patches coming from the server
          room.onMessage("messages", (message) =>{
            setValue(message);
          });
         
        }).catch((e)=>{
          //todo: redirect
          console.log('error');
          console.log(e);
          alert(e);
          history.goBack();
        });
      }      
      else if(props?.history?.location?.state?.type==='reconnect'){
        var roomId = localStorage.getItem("roomId");
        var sessionId = localStorage.getItem("sessionId");

        console.log('in reconnnnnect',roomId);
  
        if(roomId && sessionId){
          //try reconnecting to the room
          client.reconnect(roomId, sessionId).then(room => {
            room_instance.current = room;
            console.log(room);
            onjoin();
            console.log("Reconnected successfully!");

          // new room state
          room.onStateChange(function(state) {
            // this signal is triggered on each patch
        });
  
        // listen to patches coming from the server
        room.onMessage("messages", (message) =>{
          setValue(message);
        });
        }).catch(e => {
            console.error("Error", e);

          localStorage.removeItem("roomId");
          localStorage.removeItem("sessionId");
          localStorage.removeItem("name");
          alert('could not reconnect');
            history.replace('/',{});
        });
        }else{
          localStorage.removeItem("roomId");
          localStorage.removeItem("sessionId");
          localStorage.removeItem("name");
          alert('could not reconnect');
          history.replace('/',{});
        }
      }
      else{
        //redirect to home
        history.replace('/');
      }
    },[])

    // if reload is pressed the pop up is shown to cancel
    useEffect(() => {
      window.addEventListener("beforeunload", alertUser);
      return () => {
        window.removeEventListener("beforeunload", alertUser);
        room_instance?.current?.leave(false);
      };
    }, []);

    const alertUser = (e) => {
      e.preventDefault();
      e.returnValue = '';
      console.log(e);
      console.log(room_instance.current.id,room_instance.current.sessionId);
      // history.replace('/',{})
    };

    // functiion to leave the room
    const leave = () => {
      if (room_instance.current) {
        room_instance.current.connection.close();

      } else {
        console.warn("Not connected.");
      }
    }

    return (
      <div className="App">
        <header className="App-header">
        <h1>Game Screen Room</h1>
        <h2>{(room_instance?.current?.id?("Room id :- "+room_instance.current.id):null)}</h2>
        </header>
      </div>
    );
  }

  export default GameRoom;