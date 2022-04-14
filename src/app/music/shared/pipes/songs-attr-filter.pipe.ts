import { Pipe, PipeTransform } from '@angular/core';
import SongModel from 'src/app/models/song';

@Pipe({
  name: 'songsAttrFilter'
})
export class SongsAttrFilterPipe implements PipeTransform {

  transform(songsList: any[], attr: string = '', attrFilter: string = '', filter: string = '', sort: string = ''): SongModel[] {
    // let songsList: any[] = [...songsLi];
    if (attrFilter) {
      songsList = songsList.filter((song) => song[attr].toLowerCase() === attrFilter.toLowerCase());
    }
    if (filter) {
      songsList = songsList.filter((song) => song[attr].toLowerCase().includes(filter.toLowerCase()));
    }
    if (sort === 'a-z') {
      return [...songsList.sort((a, b) => (a[attr].toLowerCase() > b[attr].toLowerCase()) ? 1 : -1)];
    } else if (sort === 'z-a') {
      return [...songsList.sort((a, b) => (a[attr].toLowerCase() < b[attr].toLowerCase()) ? 1 : -1)];
    }
    return songsList;
  }

}
