import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import SongModel from 'src/app/models/song';
import { SongService } from 'src/app/services/song.service';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit {
  songsList$!: Observable<SongModel[]>;
  constructor(
    private songService: SongService,
  ) { }

  ngOnInit(): void {
    this.songsList$ = this.songService.songsList$;
  }

}
