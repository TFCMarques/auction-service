import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
//import Router module
import { RouterModule } from '@angular/router';
//import SocketIoModule 
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { AppComponent } from './app.component';
import { AgmCoreModule } from '@agm/core';

import { AuctionComponent } from './auction/auction.component';
import { InsertitemComponent } from './insertitem/insertitem.component';
import { UnregisterComponent } from './unregister/unregister.component';
import { RegisterComponent } from './register/register.component';
import { SigninComponent } from './signin/signin.component';
import { AuthGuard } from './auth.guard';
import { SocketService } from './socket.service';
import {SignInService} from './signin.service';
import {AuctionService} from './auction.service';
import {RegisterService} from './register.service';
import {UnregisterService} from './unregister.service';
import {InsertitemService} from './insertitem.service';

                              //the socket cannot start at bootstrap since the jwt token is still not available
//const config: SocketIoConfig = { url: 'https://localhost:3000', options: {autoConnect : false} };
const config: SocketIoConfig = { url: window.location.origin, options: {autoConnect : false} };

// Define the routes
const ROUTES = [
  {
    path: '',
    redirectTo: 'signin',
    pathMatch: 'full'
  },
  {
    path: 'signin',
    component: SigninComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'insertitem',
    component: InsertitemComponent, 
    canActivate: [AuthGuard]         //can only route here after sucessfull login
  },
  {
    path: 'auction',
    component: AuctionComponent,
    canActivate: [AuthGuard]        //can only route here after sucessfull login
  },
  {
    path: 'unregister',
    component: UnregisterComponent
  }
];


@NgModule({
  declarations: [
    AppComponent,
    AuctionComponent,
    InsertitemComponent,
    UnregisterComponent,
    RegisterComponent,
    SigninComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    SocketIoModule.forRoot(config),
    RouterModule.forRoot(ROUTES) // Add routes to the app
  ],
  providers: [
     SignInService,
     SocketService,
     AuctionService,
     RegisterService,
     UnregisterService,
     InsertitemService,
     AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
