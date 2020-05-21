
import {throwError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

import { SignInService } from './signin.service';
import {Item} from './item';
import {Useronline} from './useronline';

@Injectable()
export class AuctionService {
 
  constructor(private http: HttpClient, private signInService: SignInService) { }

    getItems() {
        // add authorization header with jwt token
        let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.signInService.token.token }); // insert tokern in the requests
        let options = { headers: headers };
 
        // get users from api
        return this.http.get<Item[]>('/api/items', options)
              .pipe(
                catchError(this.handleError) // handle error function will return an empty Item[] anf log the error
              );
    }

   getUsers() {
        // add authorization header with jwt token
        let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.signInService.token.token }); // insert tokern in the requests
        const options = { headers: headers };
 
        // get users from api
        return this.http.get<Useronline[]>('/api/users', options)
              .pipe(
                catchError(this.handleError) // handle error function will return an empty Item[] anf log the error
              );
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
