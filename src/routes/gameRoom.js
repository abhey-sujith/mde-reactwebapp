import { useEffect,useState ,useRef} from "react";
import * as Colyseus from 'colyseus.js'
import { useHistory } from "react-router-dom";

function GameRoom(props) {
    
    const history = useHistory();
    let room_instance= useRef(null)
    const [value, setValue] = useState("");

    useEffect(()=>{ 

      var endpoint = window.location.protocol.replace("http", "ws") + "//" + window.location.hostname;
      if (window.location.port && window.location.port !== "80") { endpoint += ":2567" }
      
      console.log(endpoint);
      let client = new Colyseus.Client(endpoint);

      const onjoin = () => {
        room_instance.current.onMessage("status", (message) => console.log(message));
        room_instance.current.onLeave(() => console.log("Bye, bye!"));

          localStorage.setItem("roomId", room_instance.current.id);
          localStorage.setItem("sessionId", room_instance.current.sessionId);
          localStorage.setItem("name", props.history.location.state.name);
      }

      if(props?.history?.location?.state?.type==='create'){

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
          alert('no room available');
          history.goBack();
        });
      }      
      else if(props?.history?.location?.state?.type==='reconnect'){
        var roomId = localStorage.getItem("roomId");
        var sessionId = localStorage.getItem("sessionId");

        console.log('in reconnnnnect',roomId);
  
        if(roomId && sessionId){
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
          console.log('innnnnnnnnn rrrrr');
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
    };

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