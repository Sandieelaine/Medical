import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { Member } from 'src/app/models/member.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HelpersService } from 'src/app/services/helpers.service';

@Component({
  selector: 'app-request-card',
  templateUrl: './request-card.page.html',
  styleUrls: ['./request-card.page.scss'],
})
export class RequestCardPage implements OnInit {
  cardRequestForm: FormGroup;
  provinces;
  member:Member = null;
  
  constructor(private fb: FormBuilder, private api: AuthenticationService, private helper: HelpersService, private loadingCtrl: LoadingController) {
    this.cardRequestForm = this.fb.group({
      AddressLine1: ['', [Validators.required]],
      PostalCode: ['', [Validators.required]],
      AddressLine2: ['', Validators.required],
      AddressLine3: ['', Validators.required],
      Province: ['', [Validators.required],]
    });
  }

  ngOnInit() {
    this.member = this.api.getMember();
    this.getOptions();
  }

  getOptions() {
    this.api.getOptionsForDropdowns()
    .subscribe(options => {
      console.log(JSON.parse(options.data));
      const optionsString = JSON.parse(options.data);
      this.provinces = optionsString.Provinces;
    })
  }

  public errorHandling = (control: string, error: string) => {
    return this.cardRequestForm.controls[control].hasError(error);
  }

  requestCard() {
    this.helper.showLoader();
    this.cardRequestForm.value.Province.$$hashKey = "object:364";
    console.log(this.cardRequestForm.value);

    this.api.requestNewCard(this.cardRequestForm.value, this.member.MemberGuid, this.member.access_token)
    .subscribe(res => {
      this.loadingCtrl.dismiss();
      this.helper.presentToast('Your card will be sent to your new address');
    }, err => {
      this.loadingCtrl.dismiss();
      this.helper.presentToast('Failed To Complete Request');
    });

  }

}
