import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';

import SongModel from '../models/song';
import { last, map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {
  API_BASE_URL: string = 'http://localhost:3000';

  constructor(private httpclient: HttpClient) { }

  // API methods songs data
  getData( url: string ): Observable<SongModel[]>{
    return this.httpclient.get<SongModel[]>(`${this.API_BASE_URL}/${url}`);
  }
  getOneData( url: string ){
    return this.httpclient.get<SongModel>(`${this.API_BASE_URL}/${url}`);
  }
  postSong( url: string, form: FormData ): Observable<HttpEvent<SongModel>>{
    // return this.httpclient.post<SongModel>(`${this.API_BASE_URL}/${url}`, form, { reportProgress: true });
    const req: HttpRequest<FormData> = new HttpRequest('POST', `${this.API_BASE_URL}/${url}`, form, { reportProgress: true })
    return this.httpclient.request(req);
  }
  deleteSong( url: string ){
    return this.httpclient.delete<SongModel>(`${this.API_BASE_URL}/${url}`);
  }
  patchSong( url:string, form: FormData ){
    return this.httpclient.patch<SongModel>(`${this.API_BASE_URL}/${url}`, form);
  }

  // API methods songs file
  getSong( url: string ){
    return this.httpclient.get<Blob>(`${this.API_BASE_URL}/${url}`, { responseType: 'blob' as 'json' });
  }
  getImageSong( url: string ){
    return this.httpclient.get<any>(`${this.API_BASE_URL}/${url}`);
  }


  //Tests
  getTest(){
    const form2 = new FormData();
    form2.append('type','holaAPI');
    return this.httpclient.post<any>('http://127.0.0.1:8000/marcas/info', form2);
  }
  getTest1(){
    return this.httpclient.get<any>('http://127.0.0.1:8000/marcas/info');
  }
  //Tests 
}
