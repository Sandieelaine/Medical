import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loader;

  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private storage: Storage,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
    ) { }

  ngOnInit() {
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.showLoader();
    console.log(form.value.username);
    this.auth.login(form.value.username, form.value.password).subscribe(user => {
      console.log(user.data, 'user');
      this.auth.selectedMember = JSON.parse(user.data);
      this.storage.set('member', user).then(res => {
        // window.location.reload();
        this.router.navigateByUrl('/pre-home');
        this.loader.dismiss();
      });
    }, error => {
      console.log(typeof(error.error), 'error');
      const errorMessage = JSON.parse(error.error);
      console.log(errorMessage.error_description);
      this.loader.dismiss();
      this.showToast(errorMessage.error_description, 5000);
    });
  }

  async showToast(message: string, duration: number) {
    let toast =  await this.toastCtrl.create({
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

}
