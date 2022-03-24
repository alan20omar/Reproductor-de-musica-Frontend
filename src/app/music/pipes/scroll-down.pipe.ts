import { Pipe, PipeTransform } from '@angular/core';
import { SongService } from 'src/app/services/song.service';
import SongModel from '../../models/song';

@Pipe({
  name: 'scrollDown'
})
export class ScrollDownPipe implements PipeTransform {

  constructor(private songService: SongService){}

  transform(array: SongModel[], num: number): SongModel[] {
    console.log('scrollpipe')
    const result: SongModel[] = array.slice(0, num * 5);
    result.forEach( (song: SongModel) => {
      if (!song.imagePath){
        this.songService.setImagePath(song);
      }
    });
    return result;
  }

}
