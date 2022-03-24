import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor() { }

  bottomRightAlertSuccess(mess: string): any{
    const upload_alert = Swal.mixin({
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
    return upload_alert.fire({ icon: 'success', title: mess });
  }

  centerAlert(mess: string, title: string = 'Ocurrio un error', type: SweetAlertIcon = 'error'): any{
    return Swal.fire({ text: mess, title: title, icon: type, timer: 4000 });
  }

}
