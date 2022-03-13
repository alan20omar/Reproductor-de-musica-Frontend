import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

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

  centerAlertError(mess: string): any{
    return Swal.fire({ title: 'Ocurrio un error', text: mess, icon: 'error', timer: 4000 });
  }

  
}
