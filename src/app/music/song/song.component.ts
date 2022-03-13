import { AfterViewInit, Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, ElementRef, Injector, Input, OnInit, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { SongService } from '../../services/song.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import Swal from 'sweetalert2';
import SongModel from '../../models/song';

import { MessagesService } from '../../services/messages.service';

import { ProgressBarComponent } from '../../shared/progress-bar/progress-bar.component';
import { SongsFilterPipe } from '../pipes/songs-filter.pipe';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.scss']
})
export class SongComponent implements OnInit, AfterViewInit {

  sort: string = '';
  filter: string = '';
  private inputChanged: Subject<string> = new Subject<string>();
  subscriptionInputChange: Subscription;
  // @ViewChild('cleanSearchSong') cleanSearchSongRef!: ElementRef;
  // cleanSearchSong!: HTMLLabelElement;
  @ViewChild('uploadMessages', { read: ViewContainerRef }) uploadMessagesRef!: ViewContainerRef;
  
  constructor(
    private songService: SongService,
    private messService: MessagesService,
    public router: Router,
    private cfr: ComponentFactoryResolver,
  ) { 
    this.subscriptionInputChange = this.inputChanged.pipe(debounceTime(200))
    .subscribe((value: string) => {
      this.searchSong(value);
    });
  }
  
  ngOnInit(): void {
    // TEST
    // this.songService.getTest1();
    // this.songService.getTest();
    // TEST
    // swal.fire(`Ocurrio un error`, 'No se pudo borrar la canción seleccionada', 'error');
  }
  
  ngAfterViewInit() {
    // this.cleanSearchSong = this.cleanSearchSongRef.nativeElement;
    // this.uploadMessages = this.uploadMessagesRef.nativeElement;
  }
  
  get songList(): SongModel[]{
    return this.songService.songsList;
  }
  
  get apiBaseUrl(): string {
    return this.songService.getApiBaseUrl();
  }

  createProgressUploadSong(name: string): ComponentRef<ProgressBarComponent>{
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

  addSong(input: HTMLInputElement){
    if (input.value == '' || !input.files){
      Swal.fire({ title: 'Archivo no seleccionado', text: 'Por favor añade una canción', icon: 'warning', timer: 4000 });
      return;
    }
    for (let file of input.files){
      const compProgressRef = this.createProgressUploadSong(file.name);
      this.songService.addNewSong(file, compProgressRef);
    }
    input.value = '';
  }


  getImagePath(song: SongModel){
    this.songService.setImagePath(song);
  }

  playSong(song: SongModel){
    this.songService.addNextTailSong(song, true);
  }

  playNextSong(song: SongModel){
    this.songService.addNextTailSong(song, false);
  }

  deleteSong(song: SongModel){
    this.songService.deleteSong(song._id);
  }

  // Añadir cancion a cola
  addSongToTailList(song: SongModel){
    this.songService.addTailSong(song);
  }

  playAllSongs(){
    this.songService.deleteAllTailSong();
    const filterPipe = new SongsFilterPipe();
    for (let song of filterPipe.transform(this.songList, this.filter, this.sort)){
      this.addSongToTailList(song);
    }
  }

  playAllRandom(){
    this.songService.deleteAllTailSong();
    const filterPipe = new SongsFilterPipe();
    for (let song of filterPipe.transform(this.songList, this.filter, this.sort).sort(() => (Math.random() > 0.5) ? 1 : -1) ) {
      this.addSongToTailList(song);
    }
  }

  searchSong(value: string){
    this.filter = value;
  }

  inputSearchSongChange(input: HTMLInputElement){
    this.inputChanged.next(input.value);
  }

  clickCleanSearchSong(input: HTMLInputElement){
    input.value = '';
    this.filter = '';
  }

  changeSortList(sort: string){
    this.sort = sort;
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

  // isActive(id: string){
  //   return this.router.IsActiveMatchOptions('/song/{{song.id}}' | UrlTree, true)
  // }
  
  ngOnDestroy(){
    this.subscriptionInputChange.unsubscribe();
  }
}
