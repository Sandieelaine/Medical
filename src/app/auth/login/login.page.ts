import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loader;
  loginForm:FormGroup;
  text;

  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private storage: Storage,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder
    ) {
      
    }

  ngOnInit() {
    this.initializeForm();
    this.activatedRoute.paramMap.subscribe(paramMap => {
      console.log(paramMap);
      const username = paramMap.get('username');
      console.log(username);
      if (username) {
        this.loginForm.patchValue({UserName: username});
      }
      
    });
  }

  initializeForm() {
    this.loginForm = this.fb.group({
      UserName: ['', [Validators.required, Validators.minLength(5)]],
      Password: ['', [Validators.required, Validators.pattern('(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\\w+\\s+]).{8,}$')]]
    })
  }

  onLogin() {
    this.showLoader();
    const username = this.loginForm.value.UserName;
    const password = this.loginForm.value.Password;
    console.log(username);
    this.auth.logMemberIn(username, password).subscribe(async res => {
      console.log(res, 'ponse');
      this.checkAndCloseLoader();
        // this.loadingCtrl.dismiss();
        this.auth.loggedInMember = JSON.parse(res.data);
        this.auth.memberData.next(JSON.parse(res.data));
        console.log('Logged In')
        this.router.navigateByUrl('/pre-home', {replaceUrl: true});

    }, err => {
      this.checkAndCloseLoader();
      // this.loadingCtrl.dismiss();
      console.log(err.error);
      // this.loadingCtrl.dismiss();
        this.showToast(JSON.parse(err.error).error_description, 5000);

      
    });
  }

  async checkAndCloseLoader() {
    // Use getTop function to find the loader and dismiss only if loader is present.
    const loader = await this.loadingCtrl.getTop();
    // if loader present then dismiss
     if(loader !== undefined) { 
       await this.loadingCtrl.dismiss();
     }
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
      spinner: 'circular',
      message: 'Loading',
      cssClass: 'login-spinner'
    });
    this.loader.present();
  }

  public errorHandling = (control: string, error: string) => {
    if(this.loginForm.get(control).touched) {
      return this.loginForm.controls[control].hasError(error);
    } 
  };

}
