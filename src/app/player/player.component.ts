import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, ParamMap, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import SongModel from '../models/song';
import { SongService } from '../services/song.service';

class SongTail{
  index!: number;
  song!: SongModel;
}

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, AfterViewInit {

  regexSongId = new RegExp('^\/(song|artist|genre|album)\/([0-9a-zA-Z]+|)$');
    
  subscriptionAddSong: Subscription;
  subscriptionDeleteSong: Subscription;
  subscriptionDeleteAllSong: Subscription;
  subscriptionInputChange!: Subscription;
  
  private inputChanged: Subject<string> = new Subject<string>();
  // Lista que se muestra en pantalla
  playerTail: SongTail[] = [];
  // Lista que almacena todas las canciones en cola mientras hay un filtro activo
  playerTailTemp: SongTail[] = [];
  indexActualSong: number = -1;
  pathActualSong!: SafeUrl;
  pathActualImage: SafeUrl = `${this.getApiBaseUrl()}/default.png`;
  titleActualSong: string = 'Reproductor';
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
  ) { 
    this.subscriptionAddSong = this.songService.tailSong$.subscribe((song: SongModel) => {
      let playerTail: SongTail[] = []
      if (this.filter != '') {
        playerTail = this.playerTailTemp;
        if (song.title.toLowerCase().includes(this.filter.toLocaleLowerCase())) this.playerTail.push({
          index: playerTail.length,
          song: song
        });
      } else {
        playerTail = this.playerTail;
      }
      playerTail.push({
        index: playerTail.length,
        song: song
      });
      if (!playerTail[this.indexActualSong]) this.playNextSong();
    });
    this.subscriptionDeleteSong = this.songService.deleteSong$.subscribe((song: SongModel) => {
      const filterTemp = this.filter;
      if (filterTemp != '') {
        this.searchSong('');
      }
      if (this.playerTail[this.indexActualSong]){
        const actualIndex = this.indexActualSong;
        const actualIdSong = this.playerTail[this.indexActualSong].song._id;
        let changeSongFlag = false;
        this.playerTail = this.playerTail.filter((s, index) => {
          if (s.song._id == song._id) {
            if (actualIdSong == s.song._id) changeSongFlag = true;
            if (index <= actualIndex) this.indexActualSong -= 1;
          };
          return s.song._id != song._id;
        });
        if (changeSongFlag) this.playNextSong();
      }else{
        this.playerTail = this.playerTail.filter((s) => s.song._id != song._id );
      }
      this.resetPlayerTailIndexes();
      if (filterTemp != '') {
        this.searchSong(filterTemp);
      }
    });
    // Borra todas las canciones en cola
    this.subscriptionDeleteAllSong = this.songService.deleteAllSong$.subscribe(() => {
      const filterTemp = this.filter;
      if (filterTemp != '') this.searchSong('');
      this.deleteAllTailSongs();
      if (filterTemp != '') this.searchSong(filterTemp);
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

  reproducirSong(index: number){
    this.indexActualSong = index;
    // Select playerTail with all songs
    let song!: SongModel;
    if (this.filter != ''){
      song = this.playerTailTemp[this.indexActualSong].song;
    }else{
      song = this.playerTail[this.indexActualSong].song;
    }
    if (song.filePath){
      this.pathActualSong = song.filePath;
      this.titleActualSong = song.title;
      this.pathActualImage = song.imagePath;
      this.player.load()
    }else{
      this.songService.getFileSong(song._id).subscribe((file: Blob) => {
        // Asigna una url temporal a la cancion obtenida del servidor
        song.filePath = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
        this.pathActualSong = song.filePath;
        this.titleActualSong = song.title;
        this.pathActualImage = song.imagePath;
      },(error) => {
        alert(`Ocurrio un error al intentar reproducir ${song.title}`);
      });
    }
    const match = this.router.url.match(this.regexSongId)
    if (match) this.router.navigate([match[1], song._id]);
  }

  resetPlayer(){
    this.pathActualSong = '#';
    this.pathActualImage = `${this.getApiBaseUrl()}/default.png`;
    this.titleActualSong = 'Reproductor';
    this.indexActualSong = -1;
    const match = this.router.url.match(this.regexSongId)
    if (match) this.router.navigate([match[1]]);
  }

  resetPlayerTailIndexes(){
    this.playerTail.forEach((song,index)=>{song.index = index});
  }

  clickCleanSearchSong(input: HTMLInputElement) {
    input.value = '';
    this.cleanSearchSong.classList.add('d-none');
    this.searchSong('');
  }

  playNextSong(){
    // Select playerTail with all songs
    let playerTail: SongTail[] = []
    if (this.filter != '') {
      playerTail = this.playerTailTemp;
    } else {
      playerTail = this.playerTail;
    }
    this.indexActualSong += 1;
    if (playerTail.length <= this.indexActualSong){
      this.indexActualSong = 0;
    }
    if (!playerTail[this.indexActualSong]){
      this.resetPlayer();
      return;
    }
    this.reproducirSong(this.indexActualSong);
  }

  randomizeTailSongs() {
    if (this.filter != '') this.cleanSearchSong.click();
    if (this.playerTail.length <= 0) {
      alert('No hay canciones en la cola');
      return;
    }
    this.playerTail = this.playerTail.sort((song) => (Math.random() > 0.5) ? 1 : -1);
    this.resetPlayerTailIndexes();
    this.reproducirSong(0);
  }

  deleteSongTail(index: number){
    const filterTemp = this.filter;
    if (filterTemp != '') {
      this.searchSong('');
    }
    this.playerTail.splice(index,1);
    if ( index == this.indexActualSong ){
      this.indexActualSong -= 1;
      this.playNextSong();
    } else if ( index < this.indexActualSong ){
      this.indexActualSong -= 1;
    }
    this.resetPlayerTailIndexes();
    if (filterTemp != '') {
      this.searchSong(filterTemp);
    }
  }

  deleteAllTailSongs(){
    const filterTemp = this.filter;
    if (filterTemp != '' && this.playerTail[this.playerTail.length - 1]) {
      // const lastIndex: number = this.playerTail[this.playerTail.length-1].index;
      let changeSongFlag = false;
      this.playerTail.forEach((song) => {
        const index = song.index;
        this.searchSong('');
        this.playerTail.splice(index, 1);
        if (index == this.indexActualSong) {
          changeSongFlag = true;
          this.indexActualSong -= 1;
        } else if (index < this.indexActualSong) {
          this.indexActualSong -= 1;
        }
        this.resetPlayerTailIndexes();
        this.searchSong(filterTemp);
      });
      // this.indexActualSong = lastIndex;
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
        this.playerTail = [...this.playerTailTemp].filter((song) => song.song.title.toLowerCase().includes(value.toLowerCase()));
      }else{
        this.playerTail = this.playerTailTemp;
        this.playerTailTemp = [];
      }
    }
    this.filter = value;
  }

  ngOnDestroy() {
    // prevent memory leak when component is destroyed
    this.subscriptionAddSong.unsubscribe();
    this.subscriptionDeleteSong.unsubscribe();
    this.subscriptionDeleteAllSong.unsubscribe();
    this.subscriptionInputChange.unsubscribe();
  }
}
