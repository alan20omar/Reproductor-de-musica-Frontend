import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import SongModel from 'src/app/models/song';
import { SongService } from 'src/app/services/song.service';

@Component({
  selector: 'app-edit-song',
  templateUrl: './edit-song.component.html',
  styleUrls: ['./edit-song.component.scss']
})
export class EditSongComponent implements OnInit {

  newImage!: SafeUrl;
  updateSongForm!: FormGroup;
  imageInvalid: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private songService: SongService,
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<EditSongComponent>,
    @Inject(MAT_DIALOG_DATA) public song: SongModel
  ) { }

  ngOnInit(): void {
    this.updateSongForm = this.formBuilder.group({
      title: [this.song.title, Validators.required],
      artist: [this.song.artist,],
      album: [this.song.album,],
      genre: [this.song.genre],
      trackNumber: [this.song.trackNumber, [Validators.pattern( /^([0-9]{0,5}|[0-9]{1,3}\/[0-9]{1}|[0-9]{2}\/[0-9]{2}|[0-9]{1}\/[0-9]{1,3})$/ )]],
      image: []
    });
  }

  get titleErrors(){
    return this.updateSongForm.get('title')?.errors;
  }
  get artistErrors(){
    return this.updateSongForm.get('artist')?.errors;
  }
  get albumErrors(){
    return this.updateSongForm.get('album')?.errors;
  }
  get genreErrors(){
    return this.updateSongForm.get('genre')?.errors;
  }
  get trackNumberErrors(){
    return this.updateSongForm.get('trackNumber')?.errors;
  }

  getApiBaseUrl(): string {
    return this.songService.getApiBaseUrl();
  }

  claseErrorMess(){
    this.imageInvalid = false;
  }

  changeImageSong(inputHtml: HTMLInputElement) {
    if (inputHtml.files && inputHtml.files[0]) {
      if (inputHtml.files[0].size/1024/1024 > 2){
        this.imageInvalid = true;
        return;
      }
      this.newImage = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(inputHtml.files[0]));
      this.updateSongForm.patchValue({ image: inputHtml.files[0] })
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  editSong(){
    if (!this.updateSongForm.valid){
      alert('No se aceptan campos invalidos');
      return;
    }
    let formData = new FormData();
    formData = this.toFormData(this.updateSongForm.value);
    // console.log(formData)
    // this.songService.loginUser(formData);
    this.songService.patchSong(this.song._id, formData).subscribe({
      next: (updatedSong: SongModel) => {
        this.dialogRef.close(updatedSong);
      },
      error: (error) => {
        console.error(error);
        alert(`Ocurrio un error. No se pudo actualizar la canción seleccionada`);
      }
    });
  }

  toFormData(formValue: any) {
    const formData = new FormData();
    for (const key of Object.keys(formValue)) {
      const value = formValue[key];
      formData.append(key, value);
    }
    return formData;
  }
}
