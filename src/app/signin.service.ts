
import {throwError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import {Token} from './token';



@Injectable()
export class SignInService {
	public token: Token; //to store the jwt authentication token to re-send to the server if needed
 	private signinUrl = '/api/authenticate'; //URL to API authenticate service
  //constructor receives Http object from angular 2 for api calls. 
  constructor(private http: HttpClient) { 
  	//set token if saved in local storage
  	var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) this.token = currentUser;
  }


  // Submit User name and Password obtain token object from server that has the username and the jwt token

  login (username: string, password: string) {
     
      return this.http.post<Token>(this.signinUrl, { username: username, password: password  })
              .pipe(
                        catchError(this.handleError)
                      );
  }
  
  // store token object in the service for other services to use when authentication is needed. 
  setToken (token: Token): void {
    this.token = token;
    localStorage.setItem('currentUser', JSON.stringify({username: token.username, token:token.token}));

  }

  logout (): void {
  	//clear token remove user from local storage to log user out
  	this.token = null;
  	localStorage.removeItem ('currentUser');
  }

 /**
   * Handle Http operation that failed.
   */
   private handleError (error: HttpErrorResponse) {
    let errMsg:string;
    if (error.error instanceof ErrorEvent) {
    // A client-side or network error occurred. Handle it accordingly.
      errMsg = error.error.message ? error.error.message : error.toString()
      console.error(errMsg);
    } else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong,
      errMsg = error.status + ' - ' + error.statusText;
      console.error(errMsg);
    }
    return throwError(errMsg);
    }; 

}
