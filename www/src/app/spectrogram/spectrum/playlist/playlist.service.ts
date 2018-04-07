import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, retry } from 'rxjs/operators';

export interface Playlist {
  fileName: string;
}

@Injectable()
export class PlaylistService {

  songsUrl = 'http://localhost:3000/music/directory.json';
  // songsUrl = 'C:/Arcadia_Fall_2017/Capstone/chrome-music-lab/spectrogram/backend/music/directory.json';

  constructor(private http: HttpClient) { }

  getPlaylist() {
    return this.http.get<Playlist>(this.songsUrl)
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }

  getPlaylist_1() {
    return this.http.get(this.songsUrl);
  }

  getPlaylist_2() {
    // now returns an Observable of Config
    return this.http.get<Playlist>(this.songsUrl);
  }

  getPlaylist_3() {
    return this.http.get<Playlist>(this.songsUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  getPlaylistResponse(): Observable<HttpResponse<Playlist>> {
    return this.http.get<Playlist>(
      this.songsUrl, { observe: 'response' });
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an ErrorObservable with a user-facing error message
    return new ErrorObservable(
      'Something bad happened; please try again later.');
  };

  makeIntentionalError() {
    return this.http.get('not/a/real/url')
      .pipe(
        catchError(this.handleError)
      );
  }

}


/*
Copyright 2017-2018 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
