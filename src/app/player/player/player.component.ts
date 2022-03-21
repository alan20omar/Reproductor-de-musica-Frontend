import { AfterViewInit, Component, ElementRef, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import SongTail from '../../models/songTail';

import { SongService } from '../../services/song.service';
import { AuthService } from '../../services/auth.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, AfterViewInit {

  @Output() changeActualIndexEvent = new EventEmitter<number>();
  @Output() playNextSongEvent = new EventEmitter<void>();
  regexSongId = new RegExp('^\/(song|artist|genre|album)\/([0-9a-zA-Z]*)$');
  subscritions: Subscription[] = [];
  
  private volumeChanged: Subject<number> = new Subject<number>();

  actualSong: SongTail = {index: -1, isLoading: false, song:{ _id: '', title: 'Reproductor', artist: '', album: '', genre: '', trackNumber: '', favorite: false, imagePath: `${this.apiBaseUrl}/default.png` } }
  
  @ViewChild('player') audioRef!: ElementRef;
  player!: HTMLMediaElement;

  constructor(
    private songService: SongService,
    private authService: AuthService,
    private router: Router,
    private sanitizer: DomSanitizer,
  ) { 
    // Retarda la ejecución de la petición de cambio de volumen
    this.subscritions.push(this.volumeChanged.pipe(debounceTime(400))
      .subscribe((volume: number) => {
        const formData = new FormData();
        formData.append('volume', volume.toString());
        this.authService.patchUser(formData).subscribe({
          next: (data) =>{ },
          error: (error) => { console.log(error) }
        });
      })
    );
  }

  ngOnInit(): void {
    console.log('Player inciciado');
  }

  ngAfterViewInit() {
    this.player = this.audioRef.nativeElement;
  }

  get apiBaseUrl(): string{
    return this.songService.apiBaseUrl;
  }

  reproducirSong(actualSong: SongTail) {
    if (!actualSong) {
      this.resetPlayer();
      return;
    }
    this.actualSong = actualSong;
    // console.log(this.actualSong.song.filePath);
    if (this.actualSong.song.filePath) {
      this.player.load();
    } else {
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
    const match = this.router.url.match(this.regexSongId);
    if (match) this.router.navigate([match[1], this.actualSong.song._id]);
  }

  playNextSong(){
    this.playNextSongEvent.emit();
  }

  // changeActualSong(actualSong: SongTail){
  //   this.actualSong = actualSong;
  // }

  resetPlayer(){
    this.changeActualIndexEvent.emit(-1);
    this.actualSong = { index: -1, isLoading: false, song: { _id: '', title: 'Reproductor', artist: '', album: '', genre: '', trackNumber: '', favorite: false,imagePath: `${this.apiBaseUrl}/default.png` } }
    const match = this.router.url.match(this.regexSongId);
    if (match) this.router.navigate([match[1]]);
  }

  volumeChange(volume: number){
    this.volumeChanged.next(volume);
  }

  setVolume(volume: number){
    this.player.volume = volume;
  }

  ngOnDestroy() {
    // prevent memory leak when component is destroyed
    this.subscritions.forEach( (sub) => {
        sub.unsubscribe();
    });
  }
}
