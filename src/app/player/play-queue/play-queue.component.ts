import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { debounceTime, Subject, Subscription } from 'rxjs';
import NextSong from 'src/app/models/nextSong';
import SongModel from 'src/app/models/song';
import SongTail from 'src/app/models/songTail';
import UserModel from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { MessagesService } from 'src/app/services/messages.service';
import { SongService } from 'src/app/services/song.service';
import { PlayerComponent } from '../player/player.component';

@Component({
  selector: 'app-play-queue',
  templateUrl: './play-queue.component.html',
  styleUrls: ['./play-queue.component.scss']
})
export class PlayQueueComponent implements OnInit, AfterViewInit {

  playerTail: SongTail[] = [];
  subscritions: Subscription[] = [];
  private inputChanged: Subject<string> = new Subject<string>();
  filter: string = '';
  page: number = 2;
  indexActualSong: number = -1;

  @ViewChild('cleanSearchSongPlayer') cleanSearchSongRef!: ElementRef;
  cleanSearchSong!: HTMLLabelElement;
  @ViewChild('player') playerComponent!: PlayerComponent;

  constructor( 
    private authService: AuthService,
    private songService: SongService,
    private messService: MessagesService,
  ) { }

  ngOnInit(): void {
    // console.log('cola de canciones iniciada')
    // Añade una cancion a la cola
    this.subscritions.push(this.songService.addTailSong$.subscribe((song: SongModel) => {
      this.playerTail.push({
        song,
        index: this.playerTail.length,
        isLoading: false
      });
      if (!this.playerTail[this.indexActualSong]) this.playNextSong();
      this.saveTailList(); // Guarda la lista en la base de datos.
    }));
    // Añade una canción delante de la que se esta reproduciendo ahora
    this.subscritions.push(this.songService.addNextSong$.subscribe((nextSong: NextSong) => {
      if (this.playerTail[this.indexActualSong]) {
        this.playerTail.splice(this.indexActualSong + 1, 0, { index: 0, song: nextSong.song, isLoading: false });
        this.resetPlayerTailIndexes(this.playerTail);
      } else {
        this.playerTail.push({ index: 0, song: nextSong.song, isLoading: false });
      }
      if (nextSong.playNext) this.playNextSong();
      this.saveTailList(); // Guarda la lista en la base de datos.
    }));
    // Elimina todas las canciones que coincidan con el id de la cancion pasada
    this.subscritions.push(this.songService.deleteSongTail$.subscribe((song: SongModel) => {
      if (this.playerTail[this.indexActualSong]) {
        const actualIndex = this.indexActualSong;
        const actualIdSong = this.playerComponent.actualSong.song._id;
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
      } else {
        this.playerTail = this.playerTail.filter((s) => s.song._id != song._id);
        this.resetPlayerTailIndexes(this.playerTail);
      }
      this.saveTailList(); // Guarda la lista en la base de datos.
    }));
    // Borra todas las canciones en cola
    this.subscritions.push(this.songService.deleteAllSong$.subscribe(() => {
      this.deleteAllTailSongs(true);
      this.saveTailList(); // Guarda la lista en la base de datos.
    }));
    // Retarda la ejecución del filtro de la lista de canciones en cola
    this.subscritions.push(this.inputChanged.pipe(debounceTime(200))
      .subscribe((value: string) => {
        this.filter = value;
      })
    );
  }

  ngAfterViewInit(): void {
    this.cleanSearchSong = this.cleanSearchSongRef.nativeElement;
    this.authService.getUser().subscribe({
      next: (user: UserModel) => {
        const pt: SongTail[] = [];
        this.playerComponent.setVolume(user.volume);
        if (user.play_queue) {
          user.play_queue.forEach((songId: string) => {
            const song: SongModel = this.songService.songsList.filter((song) => song._id === songId)[0];
            pt.push({ index: 0, song: song, isLoading: false });
          })
          this.resetPlayerTailIndexes(pt);
          if (user.actual_index_song || user.actual_index_song === 0) {
            // console.log(pt[user.actual_index_song])
            if (pt[user.actual_index_song]) {
              this.reproducirSong(pt[user.actual_index_song]);
            }
          }
          this.playerTail = pt;
          // console.log(this.playerTail)
        }
      },
      error: (error) => { console.error('Ocurrio un error: ' + error.error); }
    });
  }

  reproducirSong(actualSong: SongTail) {
    if (!actualSong) {
      this.playerComponent.resetPlayer();
      return;
    }
    this.indexActualSong = actualSong.index;
    this.playerComponent.reproducirSong(actualSong);
    this.saveActualSong(); // Guarda la cancion actual en la base de datos
  }

  playNextSong() {
    let nextSong = this.playerTail[this.indexActualSong + 1];
    // this.indexActualSong += 1;
    if (this.playerTail.length <= this.indexActualSong + 1) {
      nextSong = this.playerTail[0];
      console.log('cambio a 0')
    }
    this.reproducirSong(nextSong);
  }

  resetPlayerTailIndexes(playerTail: SongTail[] = this.playerTail) {
    playerTail.forEach((song, index) => { song.index = index });
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

  deleteSongTail(index: number) {
    console.log('hola')
    this.playerTail.splice(index, 1);
    this.resetPlayerTailIndexes();
    if (index === this.indexActualSong) {
      this.indexActualSong -= 1;
      this.playNextSong();
    } else if (index < this.indexActualSong) {
      this.indexActualSong -= 1;
      this.saveActualSong(); // Guarda la cancion actual en la base de datos
    }
    this.saveTailList(); // Guarda la lista en la base de datos.
  }

  deleteAllTailSongs(delateAll: boolean = false) {
    if (delateAll || !this.filter) {
      this.playerTail = [];
      this.playerComponent.resetPlayer();
    } else {
      const actualIndex = this.indexActualSong;
      const actualIdSong = this.playerComponent.actualSong.song._id;
      let changeSongFlag = false;
      this.playerTail = this.playerTail.filter((s, index) => {
        if (s.song.title.toLowerCase().includes(this.filter.toLowerCase())) {
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

  deleteSong(song: SongModel) {
    this.songService.deleteSong(song._id);
  }

  openEditSong(song: SongModel) {
    this.songService.editSong(song);
  }

  toggleFavorite(song: SongModel) {
    const formData = new FormData();
    formData.append('favorite', String(!song.favorite));
    this.songService.patchSong(song._id, formData).subscribe({
      next: (patchSong: SongModel) => {
        song.favorite = patchSong.favorite;
        this.messService.bottomRightAlertSuccess(`<strong>${song.title}</strong> editado correctamente`);
      },
      error: (error) => {
        console.error(error);
        alert(`Ocurrio un error. No se pudo actualizar la canción seleccionada`);
      }
    });
  }

  inputSearchSongChange(input: HTMLInputElement) {
    this.inputChanged.next(input.value);
  }

  changeActualIndex(index: number){
    this.indexActualSong = index;
    this.saveActualSong();
  }

  saveTailList() {
    const tailSave: string[] = [];
    this.playerTail.forEach((song) => {
      tailSave.push(song.song._id);
    });
    const formData = new FormData();
    formData.append('play_queue', tailSave.toString());
    this.authService.patchUser(formData).subscribe({
      next: (data) => { },
      error: (error) => { console.log(error) }
    });
  }
  
  saveActualSong() {
    const formData = new FormData();
    formData.append('actual_index_song', this.indexActualSong.toString());
    this.authService.patchUser(formData).subscribe({
      next: (data) => { },
      error: (error) => { console.log(error) }
    });
  }

  scrollDown() {
    this.page += 1;
    console.log('scrolled player')
  }

  ngOndestroy(){
    this.subscritions.forEach( (sub) => {
      sub.unsubscribe();
    });
  }
}
