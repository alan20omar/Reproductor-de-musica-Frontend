import { ComponentRef, Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';

import SongModel from '../models/song';
import NextSong from '../models/nextSong';

import { ApiConfigService } from './api-config.service';
import swal from 'sweetalert2';
import Swal from 'sweetalert2';
import { HttpEvent, HttpEventType } from '@angular/common/http';

import { MatProgressBar } from '@angular/material/progress-bar';
import { ProgressBarComponent } from '../shared/progress-bar/progress-bar.component';

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
  private _addTailSongSource: Subject<SongModel> = new Subject<SongModel>();
  public readonly addTailSong$: Observable<SongModel> = this._addTailSongSource.asObservable();
  // Observable para quitar de la cola una canción
  private _deleteSongTailSource: Subject<SongModel> = new Subject<SongModel>();
  public readonly deleteSongTail$: Observable<SongModel> = this._deleteSongTailSource.asObservable();
  // Observable para limpiar todas las canciones en cola
  private _deleteAllSongSource: Subject<void> = new Subject<void>();
  public readonly deleteAllSong$: Observable<void> = this._deleteAllSongSource.asObservable();
  // Observable para añadir una cancion delante de la actual
  private _addNextSongSource: Subject<NextSong> = new Subject<NextSong>();
  public readonly addNextSong$: Observable<NextSong> = this._addNextSongSource.asObservable();

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
      this.songsList = songs;
      songs.forEach((song) => {
        this.setImagePath(song);
      });
    });
  }

  // Fetch one data song by id
  getOneSong(songId: string): Observable<SongModel>{
    return this.api.getOneData(`songs/${songId}`);
  }

  // Get file song
  getFileSong(songId: string): Observable<Blob>{
    return this.api.getSong(`songs/${songId}/file`);
  }
  // Add new song (upload file and add to songslist)
  addNewSong(file: File, compProgressRef: ComponentRef<ProgressBarComponent>): void {
    const upload_alert = Swal.mixin({
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
    const formData = new FormData();
    formData.append('song', file);
    const sub = this.api.postSong(`songs/`, formData).subscribe({
      next: (event: HttpEvent<SongModel>) => {
        // Cancelar solicitud
        // sub.unsubscribe()
        if (event.type == HttpEventType.UploadProgress) {
          if (event.total) {
            compProgressRef.instance.changeProgressBarValue((event.loaded / event.total) * 100)
          }
        }
        else if (event.type === HttpEventType.Response) {
          if (!event.body) {
            // alerta
            return;
          }
          const newSong: SongModel = event.body;
          // Asigna una url temporal a la cancion subida 
          newSong.filePath = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
          // Asigna una url temporal a la imagen de la canción
          this.setImagePath(newSong);
          this.pushNewSong(newSong);
          compProgressRef.destroy();
          upload_alert.fire({icon: 'success', title: `${newSong.title} subido correctamente`});
        }
      },
      error: (error) =>{
        console.error(error);
        Swal.fire({ title: 'Ocurrio un error', text: 'No se pudo subir la canción seleccionada', icon: 'error', timer: 1500 });
      }
    });
  }

  // Delete a song
  deleteSong(songId: string){
    this.api.deleteSong(`songs/${songId}`).subscribe({
      next: (deletedSong: SongModel) => {
        this.songsList = this.songsList.filter(song => song._id != deletedSong._id);
        // this.songsList.forEach((song, index) => {
        //   if (song._id === deletedSong._id) this.songsList.splice(index, 1);
        // });
        this.deleteTailSong(deletedSong);
      },
      error: (error) =>{
        console.error(error);
        Swal.fire({title: 'Ocurrio un error', text: 'No se pudo borrar la canción seleccionada', icon: 'error', timer: 4000});
      }
    });
  }

  // Patch a song
  patchSong(songId: string, form: FormData): Observable<SongModel>{
    return this.api.patchSong(`songs/${songId}`, form);
  }

  // Cambiar valor del observable (ultima canción añadida a la cola)
  addTailSong(song: SongModel) {
    this._addTailSongSource.next(song);
  }

  // Cambiar valor del observable (quitar una cancion de la cola)
  deleteTailSong(song: SongModel) {
    this._deleteSongTailSource.next(song);
  }

  // Cambiar valor del observable (quitar todas las canciones de la cola)
  deleteAllTailSong() {
    this._deleteAllSongSource.next();
  }

  // Cambiar valor del observable (añadir cancion despues de la actual)
  addNextTailSong(song: SongModel, playNext:boolean){
    this._addNextSongSource.next({song: song, playNext: playNext});
  }

  // Establecer una url temporal a la imagen de la cancion
  setImagePath(song: SongModel){
    this.setImagePathObserver(song).subscribe((s: any) => {
      if (s.image) {
        song.imagePath = this.generateSafeURL(s.image.imageBuffer.data);
      } else {
        song.imagePath = `${this.getApiBaseUrl()}/default.png`;
      }
    });
  }

  // Observer get a song image
  setImagePathObserver(song: SongModel): Observable<any>{
    return this.api.getImageSong(`songs/${song._id}/image`);
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



  //// TESTS
  getTest(){
    this.api.getTest().subscribe((data)=>{
      console.log(data);
    })
  }
  getTest1(){
    this.api.getTest1().subscribe((data)=>{
      console.log(data)
    })
  }
  //// TESTS
}
