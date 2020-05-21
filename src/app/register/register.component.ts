import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterService } from '../register.service';
import { User } from '../user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit {
  View: string;	
  errorMessage : string; // string to store error messages
  user: User; // stores the user info inserted in the form. 
  
  //pass the relevant services in to the component
  constructor(private registerservice: RegisterService, private router: Router) { }

  ngOnInit() {
  	this.View = "Registration";
  	// this is the info that will show on the forms inputs since it is the initial value for the user.
  	this.user = new User ('name','john.doe@somedomain.com', 'user', 'pass' ); 
  }

  //Method called when the form is submitted
  onSubmit() {
   this.registerservice.submitNewUser(this.user)
   	   .subscribe(
   	   	  user => {
   	   	  	 	console.log ('registration succcessfull',user);
   	   	  	 	//registration successfull navigate to login page
   	   	  	 	this.router.navigate(['/signin']); 
   	   	  }, //callback to cath errors thrown bby the Observable in the service
   	   	  error => {
   	   	  	this.errorMessage = <any>error;
   	   	  }
   	   	);
  }

  clearForm() {
  	//clears the user and automatically what is appering in the form
  	this.user = new User ('','', '', ''); 
  }

  clearError(){
  	this.errorMessage="";
  }

}
