import { Pipe, PipeTransform } from '@angular/core';
import SongTail from 'src/app/models/songTail';

@Pipe({
  name: 'tailSongsFilter'
})
export class SongsFilterPipe implements PipeTransform {

  transform(songsList: SongTail[], filter: string = ''): SongTail[] {
    if (filter) {
      songsList = songsList.filter((st) => st.song.title.toLowerCase().includes(filter.toLowerCase()));
    }
    return songsList;
  }

}
