
import {throwError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { SignInService } from './signin.service';
import {Item} from './item';

@Injectable()
export class InsertitemService {
	private newitemUrl = "/api/newitem"

  constructor(private http: HttpClient, private signInService: SignInService) { } 

  // Http POST call to the api to submit the new user data returns a boolean observer to indicate success
  submitNewItem (item: Item) {
  
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.signInService.token }); // insert tokern in the requests
    let options = { headers: headers };
               
    return this.http.post<Item>(this.newitemUrl, item, options)
           .pipe(
             catchError(this.handleError)
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
