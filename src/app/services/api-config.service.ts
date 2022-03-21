import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest, HttpXsrfTokenExtractor } from '@angular/common/http';

import SongModel from '../models/song';
import { last, map, Observable, tap } from 'rxjs';

import SongImageModel from '../models/songImage';
import UserModel from '../models/user';
import LoginUserModel from '../models/loginUser';
import ResLoginModel from '../models/resLogin';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {
  API_BASE_URL: string = 'http://localhost:3000';
  constructor(
    private httpclient: HttpClient,
    private cookieExtractor: HttpXsrfTokenExtractor
  ) { }

  // API auth
  postLogin(url: string, data: LoginUserModel): Observable<ResLoginModel>{
    return this.httpclient.post<ResLoginModel>(`${this.API_BASE_URL}/${url}`, data);
  }

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
    return this.httpclient.get<SongImageModel>(`${this.API_BASE_URL}/${url}`);
  }

  // API methods user
  getUser(url: string): Observable<UserModel>{
    return this.httpclient.get<UserModel>(`${this.API_BASE_URL}/${url}`);
  }
  postUser(url: string, form: FormData): Observable<any>{
    return this.httpclient.post<any>(`${this.API_BASE_URL}/${url}`, form);
  }
  patchUser(url: string, form: FormData): Observable<any>{
    return this.httpclient.patch<any>(`${this.API_BASE_URL}/${url}`, form);
  }


  //Tests
  getTest(){
    const xsrf: string = this.cookieExtractor.getToken()!;
    console.log(xsrf)
    const form2 = new FormData();
    form2.append('type','holaAPI');
    return this.httpclient.post<any>('http://127.0.0.1:8000/marcas/info', form2);
  }
  getTest1(){
    // const xsrf: string = this.cookieExtractor.getToken()!;
    // console.log(xsrf)
    return this.httpclient.get<any>('http://127.0.0.1:8000/csrfToken');
  }
  //Tests 
}
