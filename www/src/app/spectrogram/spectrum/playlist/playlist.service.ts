import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpRequest} from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, last, map, retry, tap } from 'rxjs/operators';
import {Song} from "./song";
import {HandleError, HttpErrorHandler} from "../../../../services/http-error-handler.service";
import {of} from "rxjs/observable/of";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin':'*',
    'Authorization': 'my-auth-token'
  })
};

@Injectable()
export class PlaylistService {

  directory = 'https://fa-16a3c.appspot.com';
  uploadUrl = 'https://fa-16a3c.appspot.com/uploads';
  handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('PlaylistService');
  }

  getSongs (): Observable<Song[]> {
    return this.http.get<Song[]>(this.directory)
      .pipe(
        catchError(this.handleError('getSongs', []))
      );
  }
  upload(file: any) {
    if (!file) { return; }

    return this.http.post(this.uploadUrl, file).pipe(
      last(), // return last (completed) message to caller
      catchError(this.handleUploadError(file))
    );
  }
  private handleUploadError(file: File) {
    const userMessage = `${file.name} upload failed.`;

    return (error: HttpErrorResponse) => {
      console.error(error);

      const message = (error.error instanceof Error) ?
        error.error.message :
        `server returned code ${error.status} with body "${error.error}"`;

      console.log(`${userMessage} ${message}`);

      return of(userMessage);
    };
  }


}

