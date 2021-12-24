import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { SongService } from '../services/song.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  urlActiva: string = '';
  regexSongId = new RegExp('^\/(song|artist|genre|album)\/([0-9a-zA-Z]+)$');

  constructor(
    public songService: SongService,
    public activateRoute: ActivatedRoute,
    private router: Router,
    ) { }

  ngOnInit(): void {
    this.songService.getAllAvailableSongs();
    console.log('actualiced navbar');
  }

  changeUrl(kind: string){
    const url = this.router.url;
    let songId = '';
    const match = url.match(this.regexSongId);
    if (match){
      songId = match[2];
    }
    this.router.navigate([kind,songId])
    this.urlActiva = kind;
  }

  

  // changeNavBar(newSelect: string){
  //   this.songService.navBarSelected = newSelect;
  // }

}
