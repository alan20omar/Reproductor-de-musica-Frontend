import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import SongModel from 'src/app/models/song';
import { SongService } from 'src/app/services/song.service';

@Directive({
  selector: '[appSetImage]'
})
export class SetImageDirective {

  @Input() appSong?: SongModel;

  constructor(
    private element: ElementRef,
    private songService: SongService,
  ) { }

  @HostListener('error')
  onErrorSetImage() {
    // console.log('directiva:', this.element.nativeElement)
    if (this.appSong)
      this.songService.setImagePath(this.appSong);
    else
      this.element.nativeElement.src = `${this.songService.apiBaseUrl}/default.png`;
  }

}
