import { throwError, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class UnregisterService {
    private unregisterUrl = "/api/unregister"

    constructor(private http: HttpClient) {
    }

    // Http POST call to the api to submit the new user data returns a boolean observer to indicate success
    unregisterUser(username: string) {

        return this.http.post(this.unregisterUrl, {username: username})
            .pipe(
                catchError(this.handleError)
            );
    }

    /**
      * Handle Http operation that failed.
      */
    private handleError(error: HttpErrorResponse) {
        let errMsg: string;
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