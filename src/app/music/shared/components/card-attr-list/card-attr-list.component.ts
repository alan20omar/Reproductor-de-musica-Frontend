import { Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { debounceTime, first, Observable, Subject, Subscription } from 'rxjs';
import SongModel from 'src/app/models/song';
import { MessagesService } from 'src/app/services/messages.service';
import { SongService } from 'src/app/services/song.service';
import { ProgressBarComponent } from 'src/app/shared/components/progress-bar/progress-bar.component';
import { SongsAttrFilterPipe } from '../../pipes/songs-attr-filter.pipe';

@Component({
  selector: 'app-card-attr-list',
  templateUrl: './card-attr-list.component.html',
  styleUrls: ['./card-attr-list.component.scss']
})
export class CardAttrListComponent implements OnInit {

  @Input() attr: string = '';
  @ViewChild('uploadMessages', { read: ViewContainerRef }) uploadMessagesRef!: ViewContainerRef;
  private inputChanged: Subject<string> = new Subject<string>();
  subscriptions: Subscription[] = [];
  sort: string = 'a-z';
  filter: string = '';
  page: number = 2;
  attrActiveName: string = '';
  songsList$!: Observable<SongModel[]>;

  constructor(
    private songService: SongService,
    private messService: MessagesService,
    private cfr: ComponentFactoryResolver,
  ) { }
  
  ngOnInit(): void {
    this.songsList$ = this.songService.songsList$;
    this.subscriptions.push(this.inputChanged.pipe(debounceTime(200))
      .subscribe((value: string) => {
        this.filter = value;
      }));
  }

  // get songList$(): SongModel[] {
  //   // console.log('ejecuta')
  //   return this.songService.songsList;
  //   // return this.songService.songsList.filter((song :any) => song[this.attr]);
  //   // return [...this.songService.songsList];
  // }

  addSong(input: HTMLInputElement) {
    if (!input.value || !input.files) {
      this.messService.centerAlert('Por favor añade una canción', 'Archivo no seleccionado', 'warning');
      return;
    }
    Array.from(input.files).forEach(file => {
      const compProgressRef: ComponentRef<ProgressBarComponent> = this.createProgressUploadSong(file.name);
      this.songService.addNewSong(file, compProgressRef);
    });
    input.value = '';
    input.files = null;
  }

  playAllSongs() {
    const filterPipe = new SongsAttrFilterPipe();
    this.songsList$.pipe(first()).subscribe((songsList: SongModel[]) => {
      this.songService.addNewTailSong(filterPipe.transform(songsList, this.attr, '', this.filter, this.sort));
    });
  }

  playAllRandom() {
    const filterPipe = new SongsAttrFilterPipe();
    this.songsList$.pipe(first()).subscribe((songsList: SongModel[]) => {
      this.songService.addNewTailSong(filterPipe.transform(songsList, this.attr, '', this.filter).sort(() => (Math.random() > 0.5) ? 1 : -1));
    });
  }

  changeSortList(sort: string) {
    this.sort = sort;
  }

  inputSearchSongChange(input: HTMLInputElement) {
    this.inputChanged.next(input.value);
  }

  clickCleanSearchSong(input: HTMLInputElement) {
    input.value = '';
    this.filter = '';
  }

  selectAttr(atrr: string) {
    this.attrActiveName = atrr;
  }

  scrollDown() {
    this.page += 1;
    console.log('scrolled',this.attr);
  }

  createProgressUploadSong(name: string): ComponentRef<ProgressBarComponent> {
    const compFactory: ComponentFactory<ProgressBarComponent> = this.cfr.resolveComponentFactory(ProgressBarComponent);
    const compRef: ComponentRef<ProgressBarComponent> = this.uploadMessagesRef.createComponent(compFactory);
    compRef.instance.title = name;
    return compRef;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

}
