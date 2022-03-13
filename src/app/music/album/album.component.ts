import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss']
})
export class AlbumComponent implements OnInit {

  // Toggle paswords inputs
  // isChangePass: boolean = false;
  newImage!: SafeUrl;
  updateUserForm!: FormGroup;

  user = {
    firstName: 'first name',
    lastName: 'last name',
    email: 'email@email.com',
    photo: 'https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    location: {
      pais: "México",
      cp: "53428",
      estado: "México",
      municipioAlcaldia: "Naucalpan",
      colonia: "Las huertas",
      calle: "Av. San juan",
      entreCalle1: "calle spo",
      entreCalle2: "Av. Las palmas 1",
      numeroExterior: "sn",
      numeroInterior: "sn",
      destinatario: "Alan",
      telefono: "5553467982",
      detallesDeEntrega: "Porton rojo, timbre 4, cuidado con el perro xd",
    }
  }

  constructor(private sanitizer: DomSanitizer, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.updateUserForm = this.formBuilder.group({
      firstName: [this.user.firstName, Validators.required],
      lastName: [this.user.lastName, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]],
      photo: [],
      //location
      destinatario: [this.user.location.destinatario, Validators.required],
      telefono: [this.user.location.telefono, [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      pais: [{ value: this.user.location.pais, disabled: true }, Validators.required],
      cp: [this.user.location.cp, [Validators.required, Validators.pattern(/^[0-9]{5}$/)]],
      estado: [this.user.location.estado, Validators.required],
      municipioAlcaldia: [this.user.location.municipioAlcaldia, Validators.required],
      colonia: [this.user.location.colonia, Validators.required],
      calle: [this.user.location.calle, Validators.required],
      entreCalle1: [this.user.location.entreCalle1],
      entreCalle2: [this.user.location.entreCalle2],
      numeroExterior: [this.user.location.numeroExterior],
      numeroInterior: [this.user.location.numeroInterior],
      detallesDeEntrega: [this.user.location.detallesDeEntrega],
    });
  }

  changePerfilImage(inputHtml: HTMLInputElement) {
    if (inputHtml.files && inputHtml.files[0]) {
      this.newImage = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(inputHtml.files[0]));
      this.updateUserForm.patchValue({ photo: inputHtml.files[0] })
    }
  }

  sendData() {
    if (this.updateUserForm.invalid) {
      alert('No se aceptan campos invalidos');
      return;
    }
    // Convertir el form group en form data
    let formData = new FormData();
    formData = this.toFormData(this.updateUserForm.value);
    alert('Formulario correcto');
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
