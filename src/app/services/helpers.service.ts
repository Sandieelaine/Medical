import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {
  public loader;

  constructor(public toastController: ToastController, public loadingCtrl: LoadingController) { }

  async presentToast(message, duration = 5000) {
    const toast = await this.toastController.create({
      message,
      duration
    });
    toast.present();
  }

  async showLoader() {
    this.loader = await this.loadingCtrl.create({
      spinner: 'lines',
      message: 'Loading',
      cssClass: 'login-spinner'
    });
    this.loader.present();
  }

  confirmedValidator(controlName: string, matchingControlName: string){
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];
        if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
            return;
        }
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ confirmedValidator: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}

  
}
