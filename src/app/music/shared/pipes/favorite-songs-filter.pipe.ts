import { Pipe, PipeTransform } from '@angular/core';
import SongModel from 'src/app/models/song';

@Pipe({
  name: 'favoriteSongsFilter'
})
export class FavoriteSongsFilterPipe implements PipeTransform {

  transform(songsList: SongModel[]): SongModel[] {
    return songsList.filter((song: SongModel) => song.favorite);
  }

}
