import { Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { debounceTime, Subject, Subscription } from 'rxjs';
import SongModel from 'src/app/models/song';
import { MessagesService } from 'src/app/services/messages.service';
import { SongService } from 'src/app/services/song.service';
import { ProgressBarComponent } from 'src/app/shared/components/progress-bar/progress-bar.component';
import { SongsAttrFilterPipe } from '../shared/pipes/songs-attr-filter.pipe';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss']
})
export class AlbumComponent implements OnInit {

  constructor() { }

  ngOnInit(): void { 
    
  }
}
