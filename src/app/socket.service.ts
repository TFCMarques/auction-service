import { Injectable } from '@angular/core';
import { SignInService } from './signin.service';
import { Subject ,  Observable } from 'rxjs';
import { Socket } from 'ngx-socket-io';

@Injectable()
export class SocketService {
	//private url = 'https://localhost:3000';
	private url = window.location.origin;
 
 //constructor receives IO object and SignInService to check for authentication token
  constructor(private signInService: SignInService, private socket: Socket) { }
  
  connect (){             //add the jwt token to the options 
    this.socket.ioSocket.io.opts.query = { token: this.signInService.token.token}
  	this.socket.connect();
    console.log('Websocket connected');
  }

  disconnect(){
  	 this.socket.disconnect();
  }

  // sends a new event with name EventName and data Data
  sendEvent (EventName,Data){
  						 // newUser:username' is the name of the event in the server. 	
  		this.socket.emit(EventName , Data);
  }

 // configures an observable to emit a value every time we receive a event with name
  getEvent(Eventname){
  	 let observable = new Observable (observer =>{
  	 	this.socket.on(Eventname, (data) => {
  	 		observer.next(data);
  	 	});
  	 })
  	 return observable;
  }

}