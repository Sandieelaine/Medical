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
    this.auth.logMemberIn(form.value.username, form.value.password).subscribe(async res => {
      console.log(res, 'ponse');
        this.loadingCtrl.dismiss();
        this.auth.memberData.next(JSON.parse(res.data));
        console.log('Logged In')
        this.router.navigateByUrl('/pre-home', {replaceUrl: true});

    }, err => {
      console.log(err.error);
      this.loadingCtrl.dismiss();
      if (err.error.length > 40) {
        this.showToast('Failed to login')
      } else if (err.error.length > 40) {
        this.showToast(JSON.parse(err.error).error_description, 5000);
      }
      
    });
  }

  // Login(form: NgForm) {
  //   if (form.invalid) {
  //     return;
  //   }
  //   this.showLoader();
  //   console.log(form.value.username);
  //   this.auth.login(form.value.username, form.value.password).subscribe(user => {
  //     console.log(user);
  //     console.log(user.data, 'user');
  //     this.auth.selectedMember = JSON.parse(user.data);
  //     localStorage.removeItem('memberLocal');
  //     localStorage.setItem('memberLocal', user.data);
  //     this.storage.set('member', user).then(res => {
  //       // window.location.reload();
  //       this.router.navigateByUrl('/pre-home');
  //       this.loadingCtrl.dismiss();
  //     });
  //   }, error => {
  //     alert(error);
  //     console.log(typeof(error.error), 'error');
  //     // const errorMessage = JSON.parse(error.error);
  //     // console.log(errorMessage.error_description);
  //     this.loadingCtrl.dismiss();
  //     this.showToast('error.error_description', 5000);
  //   });
  // }

  async showToast(message: string, duration: number = 5000) {
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
