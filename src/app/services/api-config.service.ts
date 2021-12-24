import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import SongModel from '../models/song';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {

  API_BASE_URL: string = 'http://localhost:3000';

  constructor(private httpclient: HttpClient) { }

  // API methods songs data
  getData( url: string ){
    return this.httpclient.get<SongModel[]>(`${this.API_BASE_URL}/${url}`);
  }
  postSong( url: string, form: FormData ){
    return this.httpclient.post<SongModel>(`${this.API_BASE_URL}/${url}`, form);
  }
  deleteSong( url: string ){
    return this.httpclient.delete<SongModel>(`${this.API_BASE_URL}/${url}`);
  }

  // API methods songs file
  getSong( url: string ){
    return this.httpclient.get<Blob>(`${this.API_BASE_URL}/${url}`, { responseType: 'blob' as 'json' });
  }

}
