import { Component, Input, OnInit } from '@angular/core';
import SongModel from 'src/app/models/song';
import { SongService } from 'src/app/services/song.service';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss']
})
export class SongListComponent implements OnInit {

  @Input() filter: string = '';
  @Input() sort: string = '';
  page: number = 2;

  constructor(
    private songService: SongService,

  ) { }

  ngOnInit(): void {
  }
  
  get songList(): SongModel[] {
    return this.songService.songsList;
  }

  // Borra la canción
  deleteSong(song: SongModel) {
    this.songService.deleteSong(song._id);
  }

  // Añadir cancion a cola
  addSongToTailList(song: SongModel) {
    this.songService.addTailSong(song);
  }

  // Añadir canción despues de la actual y reproducir
  playSong(song: SongModel) {
    this.songService.addNextTailSong(song, true);
  }

  // Añadir canción despues de la actual
  playNextSong(song: SongModel) {
    this.songService.addNextTailSong(song, false);
  }

  openEditSong(song: SongModel) {
    this.songService.editSong(song);
  }

  toggleFavorite(song: SongModel) {
    this.songService.toggleFavorite(song);
  }

  scrollDown() {
    this.page += 1;
    console.log('scrolled')
  }

}
