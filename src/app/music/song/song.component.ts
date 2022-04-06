import { Component, OnInit } from '@angular/core';
import { SongService } from '../../services/song.service';
import SongModel from '../../models/song';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.scss']
})
export class SongComponent implements OnInit {
  
  constructor(
    private songService: SongService,
  ) { }
  
  ngOnInit(): void { 
    
  }
  
  get songList(): SongModel[] {
    // console.log('ejecuta')
    return this.songService.songsList;
  }
}
