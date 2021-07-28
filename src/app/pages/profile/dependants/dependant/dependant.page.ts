import { RemoveDependantStatus } from './../../../../enums/enums';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FullMember } from 'src/app/models/fullmember.model';
import { Member } from 'src/app/models/member.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dependant',
  templateUrl: './dependant.page.html',
  styleUrls: ['./dependant.page.scss'],
})
export class DependantPage implements OnInit {
  dependant;
  member:Member;
  dependantProfile:FullMember = null;
  DependantImage = null;
  dayToDayBenefits = null;
  DependantIndex = null;
  screenMode = RemoveDependantStatus.DEPENDANT_PROFILE;
  otpForm!: FormGroup;

  constructor(private activatedRoute: ActivatedRoute, private api: AuthenticationService, private alertCtrl: AlertController, private fb: FormBuilder) {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      console.log(paramMap);
      const dependant = paramMap.get('Dependant');
      const DependantIndex = paramMap.get('DependantIndex');
      console.log(dependant);
      this.dependant = dependant;
      this.DependantIndex = DependantIndex;
      console.log(this.DependantIndex);
      console.log(dependant);
    });
  }



  ngOnInit() {
    this.member = this.api.getMember();
    this.getDependantProfile();
    this.loadBenefits();
  }


  getDependantProfile() {
    console.log('fired');
    console.log(this.dependant);
    this.api.getMemberProfile(this.dependant, this.member.access_token).subscribe(profile => {
      this.dependantProfile = JSON.parse(profile.data);
      console.log(this.dependantProfile);
      this.DependantImage = `https://api.gems.gov.za/api/v1/MemberImage/${this.dependant}?counter=0`;
      // console.log(this.profile);
    }, err => {
      // console.log(err);
    });
  }

  loadBenefits() {
    this.api.getMemberDayToDayBenefits(this.dependant, this.member.access_token).subscribe(res => {
      console.log(res);
      console.log(this.dependant);
      let memberDayToDayBenefits = JSON.parse(res.data);
      console.log(memberDayToDayBenefits);
      this.dayToDayBenefits = memberDayToDayBenefits[0].BenefitUsageBeneficiaries.find(x => {
        return x.BeneficiaryNumber === this.DependantIndex
      });
      // this.dayToDayBenefits 
      // console.log(res);
    }, err => {
      // console.log(err);
      this.api.presentToast(err.error, 5000);
    });
  }

  async removeDependant() {
    let confirmRemoval = await this.alertCtrl.create({
      header: 'Remove Dependant',
      message: `Are you sure you want to remove ${this.dependantProfile.FirstName} from your dependants`,
      buttons: [
        {
          text: 'Yes',
          handler: async () => {
            this.initializeForms();
            console.log(this.dependantProfile);
            this.api.genericRequestOTP(this.member)
            .subscribe(res => {
              console.log(res);
              this.screenMode = RemoveDependantStatus.VERIFICATION
            })
            // this.api.removeDependant()
          }
        },
        {
          text: 'No',
        }
      ]
    })
    confirmRemoval.present();
    
  }

  initializeForms() {
    //Screen Mode 2
    this.otpForm = this.fb.group({
      OTPPin: ['', [Validators.required, Validators.minLength(5)]],
    });
  };

  public otpErrorHandling = (control: string, error: string) => {
    if(this.otpForm.touched) {
      return this.otpForm.controls[control].hasError(error);
    }
  };

  submitOTP() {

  }

}
