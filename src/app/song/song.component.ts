import { AfterViewInit, Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, ElementRef, Injector, Input, OnInit, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import SongModel from '../models/song';
import { SongService } from '../services/song.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { EditSongComponent } from '../shared/edit-song/edit-song.component';
import swal from 'sweetalert2';
import Swal from 'sweetalert2';

import { MatProgressBar } from '@angular/material/progress-bar';
import { icon } from '@fortawesome/fontawesome-svg-core';
import { ProgressBarComponent } from '../shared/progress-bar/progress-bar.component';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.scss']
})
export class SongComponent implements OnInit, AfterViewInit {

  // Sweet alert
  upload_alert = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });

// Toast.fire({
//     icon: 'success',
//     title: 'Signed in successfully'
// })

  // @Input() isTailList: Boolean = false;
  // songsList: SongModel[] = [];
  sort: string = '';
  filter: string = '';
  private inputChanged: Subject<string> = new Subject<string>();
  subscriptionInputChange: Subscription;
  @ViewChild('cleanSearchSong') cleanSearchSongRef!: ElementRef;
  cleanSearchSong!: HTMLLabelElement;
  @ViewChild('uploadMessages', { read: ViewContainerRef }) uploadMessagesRef!: ViewContainerRef;

  titularAlerta: string = '';
  
  constructor(
    private songService: SongService,
    private activateRoute: ActivatedRoute,
    public router: Router,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog,
    private renderer: Renderer2,
    private injector: Injector,
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
    this.cleanSearchSong = this.cleanSearchSongRef.nativeElement;
    // this.uploadMessages = this.uploadMessagesRef.nativeElement;
  }

  getApiBaseUrl(): string {
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

  getSongList(sort: string = '', filter: string = ''): SongModel[]{
    let listSongs: SongModel[] = this.songService.songsList;
    if (filter != ''){
      listSongs = listSongs.filter((song) => song.title.toLowerCase().includes(filter.toLowerCase()));
    }
    if (sort === 'a-z'){
      return listSongs.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase()) ? 1 : -1);
    }else if (sort === 'z-a'){
      return listSongs.sort((a, b) => (a.title.toLowerCase() < b.title.toLowerCase()) ? 1 : -1);
    }
    return listSongs
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
    for (let song of this.getSongList(this.sort)){
      this.addSongToTailList(song);
    }
  }

  playAllRandom(){
    this.songService.deleteAllTailSong();
    for ( let song of [...this.getSongList()].sort(() => (Math.random() > 0.5) ? 1 : -1) ) {
      this.addSongToTailList(song);
    }
    // this.songService.getAllAvailableSongs();
  }

  searchSong(value: string){
    this.filter = value;
  }

  inputSearchSongChange(input: HTMLInputElement){
    this.inputChanged.next(input.value);
    if (input.value != '') {
      this.cleanSearchSong.classList.remove('d-none');
    } else {
      this.cleanSearchSong.classList.add('d-none');
    }
  }

  clickCleanSearchSong(input: HTMLInputElement){
    input.value = '';
    this.filter = '';
    this.cleanSearchSong.classList.add('d-none');
  }

  changeSortList(sort: string){
    this.sort = sort;
  }

  openEditSong(song: SongModel) {
    this.songService.getOneSong(song._id).subscribe((songBase: SongModel) => {
      this.songService.setImagePath(songBase);
      const dialogRef = this.dialog.open(EditSongComponent, {
        width: '80%',
        maxWidth: '700px',
        data: songBase,
      });
      dialogRef.afterClosed().subscribe((updatedSong: SongModel) => {
        if (updatedSong){
          this.songService.setImagePathObserver(updatedSong).subscribe((s: any) => {
            if (s.image)
              updatedSong.imagePath = this.songService.generateSafeURL(s.image.imageBuffer.data);
            else
              updatedSong.imagePath = `${this.getApiBaseUrl()}/default.png`;
            Object.assign(song, updatedSong);
          });
        }
        // else{
        // alert('Ocurrio un error')
        // }
      });
    });
  }

  // isActive(id: string){
  //   return this.router.IsActiveMatchOptions('/song/{{song.id}}' | UrlTree, true)
  // }
  
  ngOnDestroy(){
    this.subscriptionInputChange.unsubscribe();
  }
}
