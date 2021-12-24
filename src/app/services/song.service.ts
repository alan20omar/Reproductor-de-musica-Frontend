import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import SongModel from '../models/song';
import { ApiConfigService } from './api-config.service';

@Injectable({
  providedIn: 'root'
})
export class SongService {

  private _navBarSelected: string = 'songs';
  get navBarSelected(): string{
    return this._navBarSelected;
  }
  set navBarSelected(newValue: string){
    this._navBarSelected = newValue;
  }

  private _songsList: SongModel[] = [];
  get songsList(): SongModel[]{
    return this._songsList;
  }
  set songsList(songList: SongModel[]){
    this._songsList = songList;
  }
  pushNewSong(newSong: SongModel): void{
    this._songsList.push(newSong);
  }

  // Observable para añadir cancion a cola
  private _tailSongSource: Subject<SongModel> = new Subject<SongModel>();
  public readonly tailSong$: Observable<SongModel> = this._tailSongSource.asObservable();
  // Observable para quitar de la cola una canción
  private _deleteSongSource: Subject<SongModel> = new Subject<SongModel>();
  public readonly deleteSong$: Observable<SongModel> = this._deleteSongSource.asObservable();
  // Observable para limpiar todas las canciones en cola
  private _deleteAllSongSource: Subject<any> = new Subject<any>();
  public readonly deleteAllSong$: Observable<any> = this._deleteAllSongSource.asObservable();

  constructor(
    private api: ApiConfigService,
    private sanitizer: DomSanitizer
  ) { }
  
  getApiBaseUrl(): string{
    return this.api.API_BASE_URL;
  }

  // Fetch all data songs available
  getAllAvailableSongs(): void{
    this.api.getData('songs/').subscribe((songs) => {
      songs.forEach((song) => {
        if (song.image) {
          song.imagePath = this.generateSafeURL(song.image.imageBuffer.data);
        }else{
          song.imagePath = `${this.getApiBaseUrl()}/default.png`;
        }
      });
      this.songsList = songs;
    });
  }

  // Get file song
  getFileSong(songId: string): Observable<Blob>{
    return this.api.getSong(`songs/${songId}/file`);
  }

  // Add new song
  addNewSong(file: File): void{
    const formData = new FormData();
    formData.append('song', file);
    this.api.postSong(`songs/`, formData).subscribe((newSong: SongModel) => {
      // Asigna una url temporal a la cancion subida 
      newSong.filePath = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
      // Asigna una url temporal a la imagen de la canción
      if (newSong.image) {
        newSong.imagePath = this.generateSafeURL(newSong.image.imageBuffer.data);
      } else {
        newSong.imagePath = `${this.getApiBaseUrl()}/default.png`;
      }
      this.pushNewSong(newSong);
    });
  }

  // Delete a song
  deleteSong(songId: string){
    this.api.deleteSong(`songs/${songId}`).subscribe((deletedSong: SongModel) => {
      // this.songsList = this.songsList.filter(song => song._id != deletedSong._id);
      this.songsList.forEach((song, index) => {
        if (song._id === deletedSong._id) this.songsList.splice(index, 1);
      });
      this.deleteTailSong(deletedSong);
    },(error) =>{
      console.error(error);
      alert(`Ocurrio un error. No se pudo borrar la canción seleccionada`);
    });
  }

  // Cambiar valor del observable (ultima canción añadida a la cola)
  changeTailSong(song: SongModel) {
    this._tailSongSource.next(song);
  }

  // Cambiar valor del observable (quitar una cancion de la cola)
  deleteTailSong(song: SongModel) {
    this._deleteSongSource.next(song);
  }

  // Cambiar valor del observable (quitar todas las canciones de la cola)
  deleteAllTailSong() {
    this._deleteAllSongSource.next();
  }

  // Genera una url temporal a una imagen en bytes 
  generateSafeURL(bufferImage: any) {
    let binary = '';
    let bytes = new Uint8Array(bufferImage);
    let len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64, ' + window.btoa(binary));
  }
}
