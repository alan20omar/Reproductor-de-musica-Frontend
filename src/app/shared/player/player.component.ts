import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import SongModel from '../../models/song';
import NextSong from '../../models/nextSong';
import SongTail from '../../models/songTail';

import { SongService } from '../../services/song.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { MessagesService } from '../../services/messages.service';

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
  subscriptionVolumeChange!: Subscription;
  
  private inputChanged: Subject<string> = new Subject<string>();
  private volumeChanged: Subject<number> = new Subject<number>();
  // Lista que se muestra en pantalla
  playerTail: SongTail[] = [];
  // Lista que almacena todas las canciones en cola mientras hay un filtro activo
  // playerTailTemp: SongTail[] = [];
  indexActualSong: number = -1;
  actualSong: SongTail = {index: -1, isLoading: false, song:{ _id: '', title: 'Reproductor', artist: '', album: '', genre: '', trackNumber: '', favorite: false, imagePath: `${this.apiBaseUrl}/default.png` } }
  filter: string = '';
  @ViewChild('player') audioRef!: ElementRef;
  player!: HTMLMediaElement;
  @ViewChild('cleanSearchSongPlayer') cleanSearchSongRef!: ElementRef;
  cleanSearchSong!: HTMLLabelElement;

  constructor(
    private songService: SongService,
    private authService: AuthService,
    private messService: MessagesService,
    private sanitizer: DomSanitizer,
    private router: Router,
    public dialog: MatDialog,
  ) { 
    // Añade una cancion a la cola
    this.subscriptionAddSong = this.songService.addTailSong$.subscribe(( song: SongModel ) => {
      this.playerTail.push({
        song,
        index: this.playerTail.length,
        isLoading: false
      });
      if (!this.playerTail[this.actualSong.index]) this.playNextSong();
      this.saveTailList(); // Guarda la lista en la base de datos.
    });
    // Añade una canción delante de la que se esta reproduciendo ahora
    this.subscriptionAddNextSong = this.songService.addNextSong$.subscribe(( nextSong: NextSong )=>{
      if ( this.playerTail[this.actualSong.index] ){
        this.playerTail.splice(this.actualSong.index+1, 0, { index: 0, song: nextSong.song, isLoading: false });
        this.resetPlayerTailIndexes(this.playerTail);
      }else{
        this.playerTail.push({ index: 0, song: nextSong.song, isLoading: false });
      }
      if (nextSong.playNext) this.playNextSong();
      this.saveTailList(); // Guarda la lista en la base de datos.
    });
    // Elimina todas las canciones que coincidan con el id de la cancion pasada
    this.subscriptionDeleteSong = this.songService.deleteSongTail$.subscribe(( song: SongModel ) => {
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
      this.saveTailList(); // Guarda la lista en la base de datos.
    });
    // Borra todas las canciones en cola
    this.subscriptionDeleteAllSong = this.songService.deleteAllSong$.subscribe(() => {
      this.deleteAllTailSongs( true );
      this.saveTailList(); // Guarda la lista en la base de datos.
    });
    // Retarda la ejecución del filtro de la lista de canciones en cola
    this.subscriptionInputChange = this.inputChanged.pipe(debounceTime(200))
      .subscribe((value: string) => {
        this.filter = value;
      });
    // Retarda la ejecución de la petición de cambio de volumen
    this.subscriptionVolumeChange = this.volumeChanged.pipe(debounceTime(400))
      .subscribe((volume: number) => {
        const formData = new FormData();
        formData.append('volume', volume.toString());
        this.songService.patchUser(formData).subscribe({
          next: (data) =>{ },
          error: (error) => { console.log(error) }
        });
      });
  }

  ngOnInit(): void {
    console.log('Player inciciado');
    this.authService.getUser().subscribe({
      next: (user) => {
        this.player.volume = user.volume;
        if (user.play_queue) {
          user.play_queue.forEach((songId: string) => {
            const song: SongModel = this.songService.songsList.filter((song) => song._id === songId)[0];
            this.playerTail.push({ index: 0, song: song, isLoading: false });
          })
          this.resetPlayerTailIndexes(this.playerTail);
          if (user.actual_index_song || user.actual_index_song === 0) {
            // console.log(this.playerTail[user.actual_index_song])
            if (this.playerTail[user.actual_index_song]) {
              this.reproducirSong(this.playerTail[user.actual_index_song]);
            }
          }
          // console.log(this.playerTail)
        }
      },
      error: (error) => { console.error('Ocurrio un error: ' + error.error); }
    });
  }

  ngAfterViewInit() {
    this.player = this.audioRef.nativeElement;
    this.cleanSearchSong = this.cleanSearchSongRef.nativeElement;
  }

  get apiBaseUrl(): string{
    return this.songService.getApiBaseUrl();
  }

  reproducirSong(actualSong: SongTail){
    this.actualSong = actualSong;
    this.indexActualSong = actualSong.index;
    // console.log(this.actualSong.song.filePath);
    if (this.actualSong.song.filePath){
      this.player.load()
    }else{
      console.log('descargo file')
      actualSong.isLoading = true;
      this.songService.getFileSong(this.actualSong.song._id).subscribe({
        next: (file: Blob) => {
          this.actualSong.song.filePath = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
        }, 
        error: (error) => {
          alert(`Ocurrio un error al intentar reproducir ${this.actualSong.song.title}`);
          console.error(error);
        },
        complete: () => {
          actualSong.isLoading = false;
        }
      });
    }
    this.saveActualSong(); // Guarda la cancion actial en la base de datos
    const match = this.router.url.match(this.regexSongId);
    if (match) this.router.navigate([match[1], this.actualSong.song._id]);
  }

  playNextSong() {
    this.actualSong = this.playerTail[this.indexActualSong + 1];
    // this.indexActualSong += 1;
    if (this.playerTail.length <= this.indexActualSong + 1) {
      this.actualSong = this.playerTail[0];
      console.log('cambio a 0')
    }
    if (!this.actualSong) {
      this.resetPlayer();
      return;
    }
    // this.resetPlayerTailIndexes(this.playerTail);
    this.reproducirSong(this.actualSong);
  }

  resetPlayer(){
    this.indexActualSong = -1;
    this.actualSong = { index: -1, isLoading: false, song: { _id: '', title: 'Reproductor', artist: '', album: '', genre: '', trackNumber: '', favorite: false,imagePath: `${this.apiBaseUrl}/default.png` } }
    const match = this.router.url.match(this.regexSongId);
    if (match) this.router.navigate([match[1]]);
  }

  resetPlayerTailIndexes(playerTail: SongTail[] = this.playerTail){
    playerTail.forEach((song,index)=>{song.index = index});
  }

  clickCleanSearchSong(input: HTMLInputElement) {
    input.value = '';
    this.filter = '';
  }

  randomizeTailSongs() {
    if (this.filter) this.cleanSearchSong.click();
    if (this.playerTail.length <= 0) {
      alert('No hay canciones en la cola');
      return;
    }
    this.playerTail = this.playerTail.sort((song) => (Math.random() > 0.5) ? 1 : -1);
    this.resetPlayerTailIndexes(this.playerTail);
    this.reproducirSong(this.playerTail[0]);
  }

  deleteSongTail(index: number){
    this.playerTail.splice(index, 1);
    this.resetPlayerTailIndexes();
    if ( index === this.actualSong.index ){
      this.indexActualSong -= 1;
      this.playNextSong();
    } else if (index < this.actualSong.index ){
      this.indexActualSong -= 1;
      this.saveActualSong(); // Guarda la cancion actual en la base de datos
    }
    this.saveTailList(); // Guarda la lista en la base de datos.
  }

  deleteAllTailSongs(delateAll: boolean = false){
    if (delateAll || !this.filter ){
      this.playerTail = [];
      this.resetPlayer();
    } else {
      const actualIndex = this.actualSong.index;
      const actualIdSong = this.actualSong.song._id;
      let changeSongFlag = false;
      this.playerTail = this.playerTail.filter((s, index) => {
        if ( s.song.title.toLowerCase().includes(this.filter.toLowerCase()) ) {
          if (actualIdSong == s.song._id) changeSongFlag = true;
          if (index <= actualIndex) {
            this.indexActualSong -= 1;
          }
        };
        return !s.song.title.toLowerCase().includes(this.filter.toLowerCase());
      });
      this.resetPlayerTailIndexes(this.playerTail);
      if (changeSongFlag) this.playNextSong(); else this.saveActualSong(); // Guarda la cancion actual en la base de datos
    }
    this.saveTailList(); // Guarda la lista en la base de datos.
  }

  inputSearchSongChange(input: HTMLInputElement){
    this.inputChanged.next(input.value);
  }

  // Filtra las canciones en cola
  // searchSong(filter: string){
  //   this.filter = filter;
  // }
  
  deleteSong(song: SongModel){
    this.songService.deleteSong(song._id);
  }

  openEditSong(song: SongModel) {
    this.songService.editSong(song);
  }

  volumeChange(audio: HTMLAudioElement){
    this.volumeChanged.next(audio.volume);
  }

  toggleFavorite(song: SongModel){
    const formData = new FormData();
    formData.append('favorite', String(!song.favorite));
    this.songService.patchSong(song._id, formData).subscribe({
      next: (patchSong: SongModel) =>{
        song.favorite = patchSong.favorite;
        this.messService.bottomRightAlertSuccess(`<strong>${song.title}</strong> editado correctamente`);
      },
      error: (error) => {
        console.error(error);
        alert(`Ocurrio un error. No se pudo actualizar la canción seleccionada`);
      }
    });
  }

  saveTailList(){
    const tailSave: string[] = [];
    this.playerTail.forEach((song) => {
      tailSave.push(song.song._id);
    });
    const formData = new FormData();
    formData.append('play_queue', tailSave.toString());
    this.songService.patchUser(formData).subscribe({
      next: (data) => { },
      error: (error) => { console.log(error) }
    });
  }

  saveActualSong(){
    const formData = new FormData();
    formData.append('actual_index_song', this.indexActualSong.toString());
    this.songService.patchUser(formData).subscribe({
      next: (data) => { },
      error: (error) => { console.log(error) }
    });
  }

  ngOnDestroy() {
    // prevent memory leak when component is destroyed
    this.subscriptionAddSong.unsubscribe();
    this.subscriptionAddNextSong.unsubscribe();
    this.subscriptionDeleteSong.unsubscribe();
    this.subscriptionDeleteAllSong.unsubscribe();
    this.subscriptionInputChange.unsubscribe();
    this.subscriptionVolumeChange.unsubscribe();
  }
}
