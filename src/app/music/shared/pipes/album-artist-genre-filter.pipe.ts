import { Pipe, PipeTransform } from '@angular/core';
import SongModel from 'src/app/models/song';

@Pipe({
  name: 'albumArtistGenreFilter'
})
export class AlbumArtistGenreFilterPipe implements PipeTransform {

  transform(songLi: SongModel[], attr: string, filter: string = '', sort: string = ''): any[] {
    let songList: any[] = [...songLi];
    if (filter) {
      songList = songList.filter((song) => song[attr].toLowerCase().includes(filter.toLowerCase()));
    }
    let attrObj = songList.reduce((group, product) => {
      if (!group[product[attr]]) {
        group[product[attr]] = [] as SongModel[];
      }
      group[product[attr]].push(product);
      return group;
    }, Object.create(null));
    if (sort === 'a-z') {
      // attrObj.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase()) ? 1 : -1);
      attrObj = Object.entries(attrObj).sort((a, b) => (a[0].toLowerCase() > b[0].toLowerCase()) ? 1 : -1);
    } else if (sort === 'z-a') {
      // attrObj.sort((a, b) => (a.title.toLowerCase() < b.title.toLowerCase()) ? 1 : -1);
      attrObj = Object.entries(attrObj).sort((a, b) => (a[0].toLowerCase() < b[0].toLowerCase()) ? 1 : -1);
    } else {
      attrObj = Object.entries(attrObj);
    }
    // console.log(attrObj);
    return attrObj;
  }
}
