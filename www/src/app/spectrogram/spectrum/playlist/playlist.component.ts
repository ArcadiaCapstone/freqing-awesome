import {Component, OnInit} from '@angular/core';
import {PlaylistService } from './playlist.service';
import {Song} from './song';
import Toolkit from "../../core/runtime";

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  providers: [ PlaylistService ],
  styleUrls: ['./playlist.component.scss']
})

export class PlaylistComponent implements OnInit {
  songs: Song[];
  message: any;

  constructor(private playlistService: PlaylistService) { }

  ngOnInit() {
    this.getPlaylist();
    Toolkit.spectrogram.setPlaylistSrc();
  }

  getPlaylist(): void {
    this.playlistService.getSongs()
      .subscribe(songs => this.songs = songs);
  }

  playSong(src) {
    Toolkit.spectrogram.stop();
    Toolkit.spectrogram.play(src);
    console.log('Playlist Source = ', src);
    Toolkit.spectrogram.startRender();
  }
  pauseSong() {
    Toolkit.stop();
    Toolkit.stopRender();
  }

  onPicked(input: HTMLInputElement) {
    const file = input.files[0];
    if (file) {
      const formData: FormData = new FormData();

      formData.append('file', file, file.name);

      this.playlistService.upload(formData).subscribe(
        msg => {
          input.value = null;
          this.message = msg;
          this.getPlaylist();
        },
      );
    }
  }



}
