import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, ParamMap, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import SongModel from '../models/song';
import NextSong from '../models/nextSong';
import SongTail from '../models/songTail';

import { SongService } from '../services/song.service';
import { EditSongComponent } from '../shared/edit-song/edit-song.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, AfterViewInit {

  regexSongId = new RegExp('^\/(song|artist|genre|album)(\/[0-9a-zA-Z]+|)$');
    
  subscriptionAddSong: Subscription;
  subscriptionAddNextSong: Subscription;
  subscriptionDeleteSong: Subscription;
  subscriptionDeleteAllSong: Subscription;
  subscriptionInputChange!: Subscription;
  
  private inputChanged: Subject<string> = new Subject<string>();
  // Lista que se muestra en pantalla
  playerTail: SongTail[] = [];
  // Lista que almacena todas las canciones en cola mientras hay un filtro activo
  playerTailTemp: SongTail[] = [];
  indexActualSong: number = -1;
  // pathActualSong!: SafeUrl;
  // pathActualImage?: SafeUrl = `${this.getApiBaseUrl()}/default.png`;
  // titleActualSong: string = 'Reproductor';
  actualSong: SongTail = {index: -1, isLoading: false, song:{ _id: '', title: 'Reproductor', artist: '', album: '', genre: '', trackNumber: '', imagePath: `${this.getApiBaseUrl()}/default.png` } }
  filter: string = '';
  @ViewChild('player') audioRef!: ElementRef;
  player!: HTMLMediaElement;
  @ViewChild('cleanSearchSongPlayer') cleanSearchSongRef!: ElementRef;
  cleanSearchSong!: HTMLLabelElement;

  constructor(
    private songService: SongService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private activateRoute: ActivatedRoute,
    public dialog: MatDialog,
  ) { 
    // Añade una cancion a la cola
    this.subscriptionAddSong = this.songService.addTailSong$.subscribe((song: SongModel) => {
      let playerTail: SongTail[] = [];
      if (this.filter != '') {
        playerTail = this.playerTailTemp;
        if (song.title.toLowerCase().includes(this.filter.toLocaleLowerCase())) this.playerTail.push({
          index: playerTail.length,
          song: song,
          isLoading: false
        });
      } else {
        playerTail = this.playerTail;
      }
      playerTail.push({
        index: playerTail.length,
        song: song,
        isLoading: false
      });
      if (!playerTail[this.actualSong.index]) this.playNextSong();
    });
    // Añade una canción delante de la que se esta reproduciendo ahora
    this.subscriptionAddNextSong = this.songService.addNextSong$.subscribe((nextSong: NextSong)=>{
      const filterTemp = this.filter;
      if (filterTemp != '') this.searchSong(''); // Reinicia el filtro si es que hay
      if (this.playerTail[this.actualSong.index]){
        this.playerTail.splice(this.actualSong.index+1, 0, { index: 0, song: nextSong.song, isLoading: false });
      }else{
        this.playerTail.splice(0, 0, { index: 0, song: nextSong.song, isLoading: false });
      }
      this.resetPlayerTailIndexes(this.playerTail);
      if (filterTemp != '') this.searchSong(filterTemp); // Retoma el filtro si es que habia
      if (nextSong.playNext) this.playNextSong();
    });
    // Elimina todas las canciones que coincidan con el id de la cancion pasada
    this.subscriptionDeleteSong = this.songService.deleteSongTail$.subscribe((song: SongModel) => {
      const filterTemp = this.filter;
      if (filterTemp != '') this.searchSong(''); // Reinicia el filtro si es que hay
      if (this.playerTail[this.actualSong.index]){
        const actualIndex = this.actualSong.index;
        const actualIdSong = this.actualSong.song._id;
        let changeSongFlag = false;
        this.playerTail = this.playerTail.filter((s, index) => {
          if (s.song._id == song._id) {
            if (actualIdSong == s.song._id) changeSongFlag = true;
            if (index <= actualIndex) {
              this.indexActualSong -= 1;
            }
          };
          return s.song._id != song._id;
        });
        this.resetPlayerTailIndexes(this.playerTail);
        if (changeSongFlag) this.playNextSong();
      }else{
        this.playerTail = this.playerTail.filter((s) => s.song._id != song._id );
        this.resetPlayerTailIndexes(this.playerTail);
      }
      if (filterTemp != '') this.searchSong(filterTemp); // Retoma el filtro si es que habia
    });
    // Borra todas las canciones en cola
    this.subscriptionDeleteAllSong = this.songService.deleteAllSong$.subscribe(() => {
      const filterTemp = this.filter;
      if (filterTemp != '') this.searchSong(''); // Reinicia el filtro si es que hay
      this.deleteAllTailSongs();
      if (filterTemp != '') this.searchSong(filterTemp); // Retoma el filtro si es que habia
    });
    // Retarda la ejecución del filtro de la lista de canciones en cola
    this.subscriptionInputChange = this.inputChanged.pipe(debounceTime(200))
      .subscribe((value: string) => {
        this.searchSong(value);
      });
  }

  ngOnInit(): void {
    console.log('Player inciciado');
  }

  ngAfterViewInit() {
    this.player = this.audioRef.nativeElement;
    this.cleanSearchSong = this.cleanSearchSongRef.nativeElement;
  }

  // getPlayerTail(){
  //   console.log(this.songService.songsList.filter((song: SongModel) => { this.playerTail.includes(song._id) }))
  //   console.log(this.playerTail)
  //   this.playerTailSongs = this.songService.songsList.filter((song: SongModel) => this.playerTail.includes(song._id));
  // }

  getApiBaseUrl(): string{
    return this.songService.getApiBaseUrl();
  }

  reproducirSong(actualSong: SongTail){
    if (!(this.actualSong === actualSong))
      this.actualSong.song.filePath = undefined;
    this.actualSong = actualSong;
    this.indexActualSong = actualSong.index;
    if (this.actualSong.song.filePath){
      this.player.load()
    }else{
      console.log('descargo file')
      // this.actualSong.song.filePath = `${this.getApiBaseUrl()}/songs/${this.actualSong.song._id}`;
      actualSong.isLoading = true;
      this.songService.getFileSong(this.actualSong.song._id).subscribe({
        next: (file: Blob) => {
          this.actualSong.song.filePath = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
        }, 
        error: (error) => {
          this.playNextSong();
          console.error(error);
          alert(`Ocurrio un error al intentar reproducir ${this.actualSong.song.title}`);
        },
        complete: () => {
          actualSong.isLoading = false;
        }
      });
    }
    const match = this.router.url.match(this.regexSongId)
    if (match) this.router.navigate([match[1], this.actualSong.song._id]);
  }

  playNextSong() {
    // Select playerTail with all songs
    let playerTail: SongTail[] = []
    if (this.filter != '') {
      playerTail = this.playerTailTemp;
    } else {
      playerTail = this.playerTail;
    }
    this.actualSong = playerTail[this.indexActualSong + 1];
    this.indexActualSong += 1;
    if (playerTail.length <= this.indexActualSong) {
      this.actualSong = this.playerTail[0];
      console.log('cambio a 0')
    }
    if (!this.actualSong) {
      this.resetPlayer();
      return;
    }
    this.resetPlayerTailIndexes(playerTail);
    this.reproducirSong(this.actualSong);
  }

  resetPlayer(){
    this.indexActualSong = -1;
    this.actualSong = { index: -1, isLoading: false, song: { _id: '', title: 'Reproductor', artist: '', album: '', genre: '', trackNumber: '', imagePath: `${this.getApiBaseUrl()}/default.png` } }
    const match = this.router.url.match(this.regexSongId)
    if (match) this.router.navigate([match[1]]);
  }

  resetPlayerTailIndexes(playerTail: SongTail[]){
    playerTail.forEach((song,index)=>{song.index = index});
  }

  clickCleanSearchSong(input: HTMLInputElement) {
    input.value = '';
    this.cleanSearchSong.classList.add('d-none');
    this.searchSong('');
  }

  randomizeTailSongs() {
    if (this.filter != '') this.cleanSearchSong.click();
    if (this.playerTail.length <= 0) {
      alert('No hay canciones en la cola');
      return;
    }
    this.playerTail = this.playerTail.sort((song) => (Math.random() > 0.5) ? 1 : -1);
    this.resetPlayerTailIndexes(this.playerTail);
    this.reproducirSong(this.playerTail[0]);
  }

  deleteSongTail(index: number){
    const filterTemp = this.filter;
    if (filterTemp != '') this.searchSong(''); // Reinicia el filtro si es que hay
    this.playerTail.splice(index,1);
    if ( index == this.actualSong.index ){
      this.indexActualSong -= 1;
      this.playNextSong();
    } else if (index < this.actualSong.index ){
      this.indexActualSong -= 1;
      this.resetPlayerTailIndexes(this.playerTail);
    }
    if (filterTemp != '') this.searchSong(filterTemp); // Retoma el filtro si es que habia
  }

  deleteAllTailSongs(){
    const filterTemp = this.filter;
    if (filterTemp != '' && this.playerTail[this.playerTail.length - 1]) {
      // const lastIndex: number = this.playerTail[this.playerTail.length-1].index;
      let changeSongFlag = false;
      this.playerTail.forEach((song) => {
        const index = song.index;
        this.searchSong(''); // Reinicia el filtro si es que hay
        this.playerTail.splice(index, 1);
        if (index == this.actualSong.index) {
          changeSongFlag = true;
          this.indexActualSong -= 1;
        } else if (index < this.actualSong.index) {
          this.indexActualSong -= 1;
        }
        this.resetPlayerTailIndexes(this.playerTail);
        this.searchSong(filterTemp); // Retoma el filtro si es que habia
      });
      if (changeSongFlag) this.playNextSong();
    }else{
      this.playerTail = [];
      this.resetPlayer();
    }
  }

  inputSearchSongChange(input: HTMLInputElement){
    this.inputChanged.next(input.value);
    if (input.value != '') {
      this.cleanSearchSong.classList.remove('d-none');
    } else {
      this.cleanSearchSong.classList.add('d-none');
    }
  }

  // Filtra las canciones en cola
  searchSong(value: string){
    if (this.playerTail.length != 0 || this.playerTailTemp.length != 0){
      if (value != '') {
        if (this.filter == '') this.playerTailTemp = this.playerTail;
        this.playerTail = this.playerTailTemp.filter((song) => song.song.title.toLowerCase().includes(value.toLowerCase()));
      }else{
        this.playerTail = this.playerTailTemp;
        this.playerTailTemp = [];
      }
    }
    this.filter = value;
  }
  
  deleteSong(song: SongModel){
    this.songService.deleteSong(song._id);
  }

  openEditSong(song: SongModel){
    const dialogRef = this.dialog.open(EditSongComponent, {
      width: '250px',
      data: song,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  ngOnDestroy() {
    // prevent memory leak when component is destroyed
    this.subscriptionAddSong.unsubscribe();
    this.subscriptionAddNextSong.unsubscribe();
    this.subscriptionDeleteSong.unsubscribe();
    this.subscriptionDeleteAllSong.unsubscribe();
    this.subscriptionInputChange.unsubscribe();
  }
}
