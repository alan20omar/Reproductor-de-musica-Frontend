import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import SongModel from '../models/song';
import { SongService } from '../services/song.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.scss']
})
export class SongComponent implements OnInit, AfterViewInit {

  // @Input() isTailList: Boolean = false;
  // songsList: SongModel[] = [];
  sort: string = '';
  filter: string = '';
  private inputChanged: Subject<string> = new Subject<string>();
  subscriptionInputChange: Subscription;
  @ViewChild('cleanSearchSong') cleanSearchSongRef!: ElementRef;
  cleanSearchSong!: HTMLLabelElement;
  
  constructor(
    private songService: SongService,
    private activateRoute: ActivatedRoute,
    public router: Router,
    private sanitizer: DomSanitizer
  ) { 
    this.subscriptionInputChange = this.inputChanged.pipe(debounceTime(200))
      .subscribe((value: string) => {
        this.searchSong(value);
      });
  }

  ngOnInit(): void {
    
  }

  ngAfterViewInit() {
    this.cleanSearchSong = this.cleanSearchSongRef.nativeElement;
  }

  getApiBaseUrl(): string {
    return this.songService.getApiBaseUrl();
  }

  addSong(event: HTMLInputElement){
    if (event.value == '' || !event.files){
      alert('Seleccione un archivo por favor.');
      return;
    }
    for (let file of event.files){
      this.songService.addNewSong(file);
    }
    event.value = '';
  }

  getSongList(sort: string = '', filter: string = ''): SongModel[]{
    let listSongs: SongModel[] = [...this.songService.songsList];
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

  deleteSong(song: SongModel){
    this.songService.deleteSong(song._id);
  }

  addSongToTailList(song: SongModel){
    // Añadir cancion a cola
    this.songService.changeTailSong(song);
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
    this.songService.getAllAvailableSongs();
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

  // isActive(id: string){
  //   return this.router.IsActiveMatchOptions('/song/{{song.id}}' | UrlTree, true)
  // }
  
  ngOnDestroy(){
    this.subscriptionInputChange.unsubscribe();
  }
}
