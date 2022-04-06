import { Component, OnInit } from '@angular/core';
import SongModel from 'src/app/models/song';
import { SongService } from 'src/app/services/song.service';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit {

  constructor(
    private songService: SongService,
  ) { }

  ngOnInit(): void {
  }

  get favSongList(): SongModel[] {
    // console.log('ejecuta')
    return this.songService.songsList.filter((song: SongModel) => song.favorite);
  }

}
