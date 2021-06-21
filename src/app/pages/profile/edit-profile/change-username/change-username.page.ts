import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { Member } from 'src/app/models/member.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HelpersService } from 'src/app/services/helpers.service';

@Component({
  selector: 'app-change-username',
  templateUrl: './change-username.page.html',
  styleUrls: ['./change-username.page.scss'],
})
export class ChangeUsernamePage implements OnInit {
  changeUsernameForm:FormGroup;
  member:Member;

  constructor(private fb:FormBuilder, private api:AuthenticationService, private helpers:HelpersService, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.member = this.api.getMember();
    this.initializeForm();
  }

  initializeForm() {
    this.changeUsernameForm = this.fb.group({
      UserName: ['', [Validators.required]],
      ConfirmUsername: ['', [Validators.required]]
    });
  }

  changeUsername() {
    this.helpers.showLoader();
    setTimeout(() => {
      this.loadingCtrl.dismiss();
    }, 2000);
  }

}
