import { Component } from '@angular/core';
import { Playlist, PlaylistService } from './playlist.service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  providers: [ PlaylistService ],
  styles: ['.error {color: red;}']
})
export class PlaylistComponent {
  error: any;
  headers: string[];
  playlist: Playlist;

  constructor(private playlistService: PlaylistService) {}

  clear() {
    this.playlist = undefined;
    this.error = undefined;
    this.headers = ['mp3'];
  }

  showPlaylist() {
    this.playlistService.getPlaylist()
      .subscribe(
        data => this.playlist = { ...data }, // success path
        error => this.error = error // error path
      );
  }

  showPlaylist_v1() {
    this.playlistService.getPlaylist_1()
      .subscribe(data => this.playlist = {
        fileName: data['fileName']
      });
    console.log(this.playlist.fileName);
  }

  showPlaylist_v2() {
    this.playlistService.getPlaylist()
    // clone the data object, using its known Config shape
      .subscribe(data => this.playlist = { ...data });
  }

  showPlaylistResponse() {
    this.playlistService.getPlaylistResponse()
    // resp is of type `HttpResponse<Config>`
      .subscribe(resp => {
        // display its headers
        const keys = resp.headers.keys();
        this.headers = keys.map(key =>
          `${key}: ${resp.headers.get(key)}`);

        // access the body directly, which is typed as `Config`.
        this.playlist = { ... resp.body };
      });
  }
  makeError() {
    this.playlistService.makeIntentionalError().subscribe(null, error => this.error = error );
  }
}


/*
Copyright 2017-2018 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
