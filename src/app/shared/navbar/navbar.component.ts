import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { SongService } from '../../services/song.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  urlActiva: string = '';
  regexSongId = new RegExp('^\/(song|artist|genre|album)\/([0-9a-zA-Z]+)$');
  isLoggedInSubsciption!: Subscription;

  constructor(
    private songService: SongService,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.isLoggedInSubsciption = this.authService.isLoggedIn.subscribe({
      next: (isLoggedIn: boolean) => {
        if (isLoggedIn)
          this.songService.getAllAvailableSongs();
      }
    });
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

  logout(){
    this.authService.logout();
  }

  // changeNavBar(newSelect: string){
  //   this.songService.navBarSelected = newSelect;
  // }
  ngOnDestroy(){
    this.isLoggedInSubsciption.unsubscribe();
  }
}
