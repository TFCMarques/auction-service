import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InsertitemService } from '../insertitem.service';
import { Item } from '../item';

@Component({
  selector: 'app-insertitem',
  templateUrl: './insertitem.component.html',
  styleUrls: ['./insertitem.component.sass']
})
export class InsertitemComponent implements OnInit {
  View: string;	
  errorMessage : string; // string to store error messages
  item: Item; // stores the user info inserted in the form. 
  constructor(private insertitemservice: InsertitemService, private router: Router) { }

  ngOnInit() {
  	 // this is the info that will show on the forms inputs since it is the initial value for the item.
  	this.item = new Item ('Describe what you are selling', 100, 200, ''); 
  }

//Method called when the form is submitted
  onSubmit() {
   this.insertitemservice.submitNewItem(this.item)
   	   .subscribe(
   	   	  result => {
   	   	  	 	console.log ('item inserted succcessfully', result);
   	   	  	 	//item created with success navigate to the auction page
   	   	  	 	this.router.navigate(['/auction']);
   	   	  }, //callback to cath errors thrown bby the Observable in the service
   	   	  error => {
   	   	  	this.errorMessage = <any>error;
   	   	  }
   	   	);

  }

  clearForm() {
  	//clears the user and automatically what is appering in the form
  	this.item = new Item ('',0, 0, ''); 
  }

  clearError(){
  	this.errorMessage="";
  }


}
