import { Component, OnInit } from '@angular/core';
import { SongService } from '../../services/song.service';
import SongModel from '../../models/song';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.scss']
})
export class SongComponent implements OnInit {
  songsList$!: Observable<SongModel[]>;
  constructor(
    private songService: SongService,
  ) { }
  
  ngOnInit(): void { 
    this.songsList$ = this.songService.songsList$;
  }

}
