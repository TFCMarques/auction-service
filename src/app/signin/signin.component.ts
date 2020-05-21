import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SignInService } from '../signin.service';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.sass']
})

export class SigninComponent implements OnInit {
  errorMessage : string; // string to store error messages
  View : string; //string that is written in the main menu. 
 
  constructor(private signinservice: SignInService, private router: Router, private socketservice: SocketService ) { }

  ngOnInit() {
  	this.View= "Sign In";
  }

  login (username: string, password: string ){
  	if (!username || !password)	{return; } // if user name and password are filled then subscribe to the Http service 
  	this.signinservice.login(username,password)
  	    .subscribe(
  	    	result => {                  
  	    	   // if the Http POST call made is successfull the result is a Token object
  	    	    this.signinservice.setToken(result); // store the received jwt token in the sign in service for future use in authentication 
  	    	  	this.socketservice.connect();	// connect the websocket since we already have the token
              //send a new user event to the server so that the server can store the socket ID mapped to the usernames
              this.socketservice.sendEvent('newUser:username',{username: username});   		  
              console.log('navigating to auction')
  	    		 //login successful navigate to acution page
  	    		  this.router.navigate(['/auction']);
  	    	},	
  	    	error => {
  	    		this.errorMessage = <any>error;	
  	    	}	
  	    );
  }

  clearError(){
  	this.errorMessage="";
  }

  logout(){
  	//perform any needed logout logic here 
  	this.socketservice.disconnect();
  	this.router.navigate(['/signin']);
  	this.signinservice.logout();
  }

}

