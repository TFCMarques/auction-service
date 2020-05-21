import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../socket.service';
import { AuctionService } from '../auction.service';
import { SignInService } from '../signin.service';
import { Item } from '../item';
import { Useronline } from '../useronline';

@Component({
  selector: 'app-auction',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.sass']
})
export class AuctionComponent implements OnInit {
  items: Item[]; //array of items to store the items. 
  messages: string[]; //array of message strings
  showBid: boolean;  //boolean to control if the show bid form is placed in the DOM
  view: string;
  selectedItem: Item; //Selected Item 
  newitem; //Object that contains the Observable subscription for the New Item Websocket event
  itemsold; //Object that contains the Observable subscription for the Item Sold Websocket event
  updateItems; //Object that contains the Observable subscription for the updateitems events
  receivedUpdateBid: Item;
  userName: string;
  errorMessage: string; //string to store error messages received in the interaction with the api


  constructor(private router: Router, private socketservice: SocketService, private auctionservice: AuctionService,
    private signinservice: SignInService) {
  }

  ngOnInit() {
    this.view = "Auction";
    //gets the username from the Token object in the signin service
    this.userName = this.signinservice.token.username;
    this.messages = [];
    this.items = [];
    this.messages.push("Hello " + this.userName + "! Welcome to the RIT II auction site.");


    // Get initial item data from the the server api using http call in the auctionservice
    this.auctionservice.getItems()

      .subscribe(items => {
        let receiveddata = items as Item[]; // cast the received data as an array of items (must be sent like that from server)
        this.items = receiveddata;
      },
        error => this.errorMessage = <any>error);

    //subscribe to the incoming websocket events 

    //example how to subscribe to the server side regular (each second) items:update event
    this.updateItems = this.socketservice.getEvent("items:update")
      .subscribe(
        data => {
          let receiveddata = data as Item[];
          if (this.items) {
            this.items = receiveddata;
          }
        }
      );

    //subscribe to the new item event that must be sent from the server when a client publishes a new item
    this.newitem = this.socketservice.getEvent("new:item")
      .subscribe(
        data => {
          let receiveddata = data as Item;
          this.items.push(receiveddata);
        }
      );

    //subscribe to the item sold event sent by the server for each item that ends. 
    this.itemsold = this.socketservice.getEvent("item:sold")
      .subscribe(
        data => {
          let receiveddata = data as Item[];
          receiveddata.forEach((soldItem) => {
            this.items.filter(aux => aux !== soldItem);
            if (soldItem.wininguser !== "") {
              this.messages.push("Item " + soldItem.description + " sold to: " + soldItem.wininguser + ". Price paid: " + soldItem.currentbid);
            } else {
              this.messages.push("Item " + soldItem.description + " biding time expired with no buyers.");
            }
          });
        }
      );

    //subscription to any other events must be performed here inside the ngOnInit function

  }

  logout() {
    //perform any needed logout logic here 
    this.socketservice.disconnect();
    //navigate back to the log in page
    this.router.navigate(['/signin']);
    //call the logout function in the signInService to clear the token in the browser
    this.signinservice.logout();

  }

  //function called when an item is selected in the view
  selectBidItem(item: Item) {
    console.log("Selected item = ", item);
    this.selectedItem = item;
    this.showBid = true; // makes the bid form appear
  }

  // function called when the submit bid button is pressed
  submitBid(bid: number) {
    console.log("submitted bid = ", bid);
    //send an event using the websocket for this use the socketservice 
    this.socketservice.sendEvent("send:bid", { item: this.selectedItem, bid: bid });
    // example :  this.socketservice.sendEvent('eventname',eventdata);
  }

  //function called when the cancel bid button is pressed. 
  cancelBid() {
    this.showBid = false; // makes the bid form appear dissapear 
  }

  // function to clear the alert box that display errors returned by the api form the DOM
  clearError() {
    this.errorMessage = "";
  }

  private convertStringToNumber(value): number {
    return +value;
  }

}
