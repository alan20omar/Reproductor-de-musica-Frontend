import { Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { debounceTime, Subject, Subscription } from 'rxjs';
import SongModel from 'src/app/models/song';
import { MessagesService } from 'src/app/services/messages.service';
import { SongService } from 'src/app/services/song.service';
import { ProgressBarComponent } from 'src/app/shared/components/progress-bar/progress-bar.component';
import { SongsFilterPipe } from '../../pipes/songs-filter.pipe';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss']
})
export class SongListComponent implements OnInit {

  private inputChanged: Subject<string> = new Subject<string>();
  subscriptions: Subscription[] = [];
  @ViewChild('uploadMessages', { read: ViewContainerRef }) uploadMessagesRef!: ViewContainerRef;
  
  @Input() songList: SongModel[] = [];
  @Input() attrList: string = 'song';
  base: string = '/music';
  filter: string = '';
  sort: string = '';
  page: number = 2;

  constructor(
    private songService: SongService,
    private messService: MessagesService,
    private cfr: ComponentFactoryResolver,
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(this.inputChanged.pipe(debounceTime(200))
      .subscribe((value: string) => {
        this.filter = value;
      }));
  }
  
  // get songList(): SongModel[] {
  //   return this.songService.songsList;
  // }

  addSong(input: HTMLInputElement) {
    if (!input.value || !input.files) {
      this.messService.centerAlert('Por favor añade una canción', 'Archivo no seleccionado', 'warning');
      return;
    }
    // for (let file of input.files){
    //   const compProgressRef: ComponentRef<ProgressBarComponent> = this.createProgressUploadSong(file.name);
    //   this.songService.addNewSong(file, compProgressRef);
    // }
    Array.from(input.files).forEach(file => {
      const compProgressRef: ComponentRef<ProgressBarComponent> = this.createProgressUploadSong(file.name);
      this.songService.addNewSong(file, compProgressRef);
    });
    input.value = '';
    input.files = null;
  }

  // Borra la canción
  deleteSong(song: SongModel) {
    this.songService.deleteSong(song._id);
  }

  // Añadir cancion a cola
  addSongToTailList(song: SongModel) {
    this.songService.addTailSong(song);
  }

  // Añadir canción despues de la actual y reproducir
  playSong(song: SongModel) {
    this.songService.addNextTailSong(song, true);
  }

  // Añadir canción despues de la actual
  playNextSong(song: SongModel) {
    this.songService.addNextTailSong(song, false);
  }

  inputSearchSongChange(input: HTMLInputElement) {
    this.inputChanged.next(input.value);
  }

  clickCleanSearchSong(input: HTMLInputElement) {
    input.value = '';
    this.filter = '';
  }

  changeSortList(sort: string) {
    this.sort = sort;
  }

  playAllSongs() {
    const filterPipe = new SongsFilterPipe();
    this.songService.addNewTailSong(filterPipe.transform(this.songList, this.filter, this.sort));
  }

  playAllRandom() {
    const filterPipe = new SongsFilterPipe();
    this.songService.addNewTailSong(filterPipe.transform(this.songList, this.filter, this.sort).sort(() => (Math.random() > 0.5) ? 1 : -1));
  }

  openEditSong(song: SongModel) {
    this.songService.editSong(song);
  }

  toggleFavorite(song: SongModel) {
    this.songService.toggleFavorite(song);
  }

  scrollDown() {
    this.page += 1;
    console.log('scrolled')
  }

  createProgressUploadSong(name: string): ComponentRef<ProgressBarComponent> {
    const compFactory: ComponentFactory<ProgressBarComponent> = this.cfr.resolveComponentFactory(ProgressBarComponent);
    const compRef: ComponentRef<ProgressBarComponent> = this.uploadMessagesRef.createComponent(compFactory);

    // const compFactory: ComponentFactory<MatProgressBar> = this.cfr.resolveComponentFactory(MatProgressBar);
    // // const compRef = compFactory.create(this.injector);
    // // this.uploadMessagesRef.insert(compRef.hostView);
    // const compRef: ComponentRef<MatProgressBar> = this.uploadMessagesRef.createComponent(compFactory);
    // this.renderer.appendChild(html_messageUpload, compRef.instance._elementRef.nativeElement);
    // compRef.instance.mode = 'buffer';
    // return compRef;

    compRef.instance.title = name;
    return compRef;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

}
