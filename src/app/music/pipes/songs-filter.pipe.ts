import { Pipe, PipeTransform } from '@angular/core';
import SongModel from 'src/app/models/song';

@Pipe({
  name: 'songsFilter'
})
export class SongsFilterPipe implements PipeTransform {

  transform(songsList: SongModel[], filter: string = '', sort: string = ''): SongModel[] {
    if (filter) {
      songsList = songsList.filter((song) => song.title.toLowerCase().includes(filter.toLowerCase()));
    }
    if (sort === 'a-z') {
      songsList = songsList.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase()) ? 1 : -1);
    } else if (sort === 'z-a') {
      songsList = songsList.sort((a, b) => (a.title.toLowerCase() < b.title.toLowerCase()) ? 1 : -1);
    }
    return songsList;
  }

}
