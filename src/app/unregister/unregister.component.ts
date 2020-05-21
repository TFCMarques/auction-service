import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UnregisterService } from '../unregister.service';

@Component({
  selector: 'app-unregister',
  templateUrl: './unregister.component.html',
  styleUrls: ['./unregister.component.sass']
})
export class UnregisterComponent implements OnInit {
  View: string;	
  errorMessage : string; // string to store error messages
  
  //pass the relevant services in to the component
  constructor(private unregisterservice: UnregisterService, private router: Router) { }

  ngOnInit() {
  	this.View = "Unregistration";
  	// this is the info that will show on the forms inputs since it is the initial value for the user.
  }

  //Method called when the form is submitted
  unregister (username: string){
   this.unregisterservice.unregisterUser(username)
   	   .subscribe(
   	   	  username => {
   	   	  	 	console.log ('Successfully unregistered: ', username);
   	   	  	 	//registration successfull navigate to login page
   	   	  	 	this.router.navigate(['/signin']); 
   	   	  }, //callback to cath errors thrown bby the Observable in the service
   	   	  error => {
   	   	  	this.errorMessage = <any>error;
   	   	  }
   	   	);
  }

  clearError(){
  	this.errorMessage="";
  }

}
