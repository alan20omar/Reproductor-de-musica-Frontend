import { Pipe, PipeTransform } from '@angular/core';
import SongModel from 'src/app/models/song';

@Pipe({
  name: 'songsAttrFilter'
})
export class SongsAttrFilterPipe implements PipeTransform {

  transform(songsLi: SongModel[], attr: string = '', filter: string = '', sort: string = ''): SongModel[] {
    let songsList: any[] = [...songsLi];
    if (filter) {
      songsList = songsList.filter((song) => song[attr].toLowerCase().includes(filter.toLowerCase()));
    }
    if (sort === 'a-z') {
      songsList.sort((a, b) => (a[attr].toLowerCase() > b[attr].toLowerCase()) ? 1 : -1);
    } else if (sort === 'z-a') {
      songsList.sort((a, b) => (a[attr].toLowerCase() < b[attr].toLowerCase()) ? 1 : -1);
    }
    return songsList;
  }

}