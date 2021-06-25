import { FullMember } from 'src/app/models/fullmember.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HelpersService } from 'src/app/services/helpers.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Member } from 'src/app/models/member.model';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-selected-option',
  templateUrl: './selected-option.page.html',
  styleUrls: ['./selected-option.page.scss'],
})
export class SelectedOptionPage implements OnInit {
  optionTitle: string = '';
  isEVOOption:boolean;
  profile: FullMember;
  plan: string;
  loader;

  optionChangeForm: FormGroup;
  provinces;
  provinces_dependants = [];
  cities = [];
  cities_dependants = [];
  gps = [];
  gps_dependants =[]
  dependants;
  member:Member = null;
  optionChangePayload;

  constructor(private activatedRoute: ActivatedRoute, private api: AuthenticationService, private helper: HelpersService, private fb: FormBuilder, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private router: Router) {
    this.optionChangeForm = this.fb.group({
      mainMemberFirstName: ['', [Validators.required]],
      mainMemberLastName: ['', Validators.required],
      memberNumber: ['', [Validators.required]],
      mainMemberProvince: ['', Validators.required],
      mainMemberCity: ['', Validators.required],
      mainMemberPractitioner: ['', [Validators.required]],
      Doyouwanttoapplythispractitionertoall: ['', [Validators.required]],
      proposedBenefitOption: ['', [Validators.required]],
      Dependants: this.fb.array([]),
      BeneficiaryNumber: ['', [Validators.required]],
      PracticeNumber: ['', [Validators.required]],
    });
    this.optionChangeForm.patchValue({Doyouwanttoapplythispractitionertoall: true});
    
  }

  ngOnInit() {
    this.api.trackView('/', 'Option Change Selected Option');
    this.member = this.api.getMember();
    this.loadProfile();
    this.getProvinces();
    this.activatedRoute.paramMap.subscribe(paramMap => {
      console.log(paramMap);
      const option = paramMap.get('option');
      const status = paramMap.get('status');
      this.optionTitle = option;
      this.optionChangeForm.patchValue({proposedBenefitOption: this.optionTitle});
      if (status === 'EVO') {
        this.isEVOOption = true;
      } else if (status === 'nonEVO') {
        this.isEVOOption = false;
      }
      console.log(option, status);
    });
    this.onChanges();
    this.onCityChange();
    this.onGPChange();
    this.onIsDoctorForAllChange();
  }

  loadProfile() {
    this.api.getMemberProfile(this.member.MemberGuid, this.member.access_token)
    .subscribe(profile => {
      const profileData = JSON.parse(profile.data);
      this.profile = profileData;
      
      // if (this.optionChangeForm.value.Doyouwanttoapplythispractitionertoall === false && this.profile.Dependants && this.profile.Dependants.length > 0) {   
      //   this.optionChangeForm.addControl('Dependants', this.fb.array([]));
      //   for (var dependant of this.profile.Dependants) {
      //     console.log(dependant.FirstName);
      //     this.addDependant(dependant.FullName, dependant.BeneficiaryCode);
      //   }
      // }
      this.plan = profileData.Plan.BenefitPlanName.toLowerCase();
      this.optionChangeForm.patchValue({mainMemberFirstName: profileData.FirstName});
      this.optionChangeForm.patchValue({mainMemberLastName: profileData.LastName});
      this.optionChangeForm.patchValue({memberNumber: profileData.MemberNo});
      this.optionChangeForm.patchValue({BeneficiaryNumber: profileData.BeneficiaryCode});
      this.optionChangeForm.controls['mainMemberFirstName'].disable();
      this.optionChangeForm.controls['mainMemberLastName'].disable();
      this.optionChangeForm.controls['memberNumber'].disable();
      console.log(this.plan);
    }, err => {

    });
  }

  getProvinces() {
    this.api.getProvinces()
    .subscribe(provinces => {
      this.provinces = JSON.parse(provinces.data);
      this.provinces_dependants = JSON.parse(provinces.data);
      console.log(provinces);
    })
  }

  getCities(ID) {
    console.log('runs');
    this.api.getCities(ID)
    .subscribe(cities => {
      this.cities = JSON.parse(cities.data);
      this.cities_dependants = JSON.parse(cities.data);
      console.log(cities);
    })
  }

  getGPs(provinceID, cityID) {
    if (provinceID && cityID) {
      this.api.getGeneralPractitioners(provinceID, cityID)
    .subscribe(gps => {
      this.gps = JSON.parse(gps.data);
      this.gps_dependants = JSON.parse(gps.data);
      console.log(gps);
    })
    }
    
  }

  changeToNonEVOOption() {
    this.showLoader();
    this.api.changeOption(this.optionTitle, this.member.MemberGuid, this.member.access_token)
    .subscribe(res => {
      this.loader.dismiss();
      this.helper.presentToast(
        'Thank you, a service request has been created to change your Benefit Option. To avoid duplication of work please do not submit these details more than once.',
        // 'Thank you, a service request has been created to change your Benefit Option from Ruby to Beryl To avoid duplication of work please do not submit these details more than once.',
        5000
      )
    }, err => {
      this.loader.dismiss();
      this.helper.presentToast(
        'Failed To Change Option. Please try again!',
        5000
      )
    })
  }

  changeToEVOOption() {
    console.log(this.optionTitle);
    this.optionChangePayload = this.optionChangeForm.getRawValue();
    this.optionChangePayload.mainMemberProvince = this.optionChangeForm.value.mainMemberProvince.Description;
    this.optionChangePayload.mainMemberCity = this.optionChangeForm.value.mainMemberCity.Description;
    this.optionChangePayload.mainMemberPractitioner = this.optionChangeForm.value.mainMemberPractitioner.Description;

    if (this.optionChangePayload.Dependants.length > 0 && this.optionChangeForm.value.Doyouwanttoapplythispractitionertoall === false) {
      for (var dependant of this.optionChangePayload.Dependants) {
        console.log(dependant);
        dependant.DependantsPractitioner = dependant.DependantsPractitioner.Description;
        dependant.DependantProvince = dependant.DependantProvince.Description;
        dependant.DependantCity = dependant.DependantCity.Description;
      }
    }


    if (this.optionChangeForm.value.Doyouwanttoapplythispractitionertoall === true) {
      for (var DEP of this.profile.Dependants) {
        console.log(dependant);
        let modifiedDEP = {
          DependantsPractitioner: this.optionChangePayload.mainMemberPractitioner,
          DependantProvince: this.optionChangePayload.mainMemberProvince,
          DependantCity: this.optionChangePayload.mainMemberCity,
          PracticeNumber: this.optionChangeForm.value.PracticeNumber,
          BeneficiaryNumber: DEP.BeneficiaryCode,
          FullName: DEP.FullName
        };
        this.optionChangePayload.Dependants.push(modifiedDEP);
      }
    }

    

    // var key = "Cow";
    // delete thisIsObject[key];

    // delete this.optionChangePayload.Dependants;
    
    
    //console.log(this.optionChangeForm.status)
    //console.log(this.optionChangeForm.getRawValue());
    console.log(this.optionChangePayload);
    console.log(this.optionTitle);

    let selectedOption;
    if (this.optionTitle === 'Tanzanite One') {
      selectedOption = 'TanzaniteChangeOptionInfo';
    } else if (this.optionTitle === 'Emerald Value') {
      selectedOption = 'EVOChangeOptionInfo';
    } else {
      return;
    }

    console.log(selectedOption);
    console.log(this.optionChangePayload);

    this.showLoader();

    this.api.changeToEVOOption(this.optionChangePayload, selectedOption, this.member.MemberGuid, this.member.access_token)
    .subscribe(res => {
      this.checkAndCloseLoader();
      console.log(res);
      this.helper.presentToast(`Thank you, a service request has been created to change your Benefit Option from ${this.plan} to ${this.optionTitle}. To avoid duplication of work please do not submit these details more than once.`);
    }, err => {
      this.checkAndCloseLoader();
      console.log(err);
      this.helper.presentToast('Failed To Change Option. Please Try Again');
    });
  }


  onChanges(): void {
    this.optionChangeForm.get('mainMemberProvince').valueChanges.subscribe(val => {
      console.log(val);
      this.optionChangeForm.patchValue({mainMemberCity: ''});
      this.getCities(val.ID);
    });
  }

  onCityChange(): void {
    this.optionChangeForm.get('mainMemberCity').valueChanges.subscribe(val => {
      console.log(val);
      this.optionChangeForm.patchValue({mainMemberPractitioner: ''});
      this.getGPs(this.optionChangeForm.value.mainMemberProvince.ID, val.ID);
    });
  }

  onGPChange() {
    this.optionChangeForm.get('mainMemberPractitioner').valueChanges.subscribe(val => {
      console.log(val);
      this.optionChangeForm.patchValue({PracticeNumber: val.PracticeNumber});
    });
  }

  onIsDoctorForAllChange(): void {
    this.optionChangeForm.get('Doyouwanttoapplythispractitionertoall').valueChanges.subscribe(val => {
      console.log(val);
      if (val) {
        if (this.profile.Dependants.length > 0) {
          console.log('Teah');
          const control = <FormArray>this.optionChangeForm.controls['Dependants'];
            for(let i = control.length-1; i >= 0; i--) {
                control.removeAt(i)
          }
        }
      } else if (val === false) {
        this.optionChangeForm.addControl('Dependants', this.fb.array([]));
        for (var dependant of this.profile.Dependants) {
          console.log(dependant.FirstName);
          this.addDependant(dependant.FullName, dependant.BeneficiaryCode);
        }
      }
      // this.optionChangeForm.patchValue({mainMemberPractitioner: ''});
    });
  }

  onDependantChanges(): void {
    this.optionChangeForm.get('Dependants').valueChanges.subscribe(val => {
      console.log(val, 33);
      // this.optionChangeForm.patchValue({DependantProvince: ''});
      this.getCities(val.ID);
    });
  }

  onDependantCityChange(): void {
    this.optionChangeForm.get('DependantCity').valueChanges.subscribe(val => {
      console.log(val);
      this.optionChangeForm.patchValue({mainMemberPractitioner: ''});
      this.getGPs(this.optionChangeForm.value.DependantCity.ID, val.ID);
    });
  }

  

  createDependant(FullName, BeneficiaryNumber): FormGroup {
    return this.fb.group({
      FullName: [{value: FullName, disabled: true}, Validators.required],
      BeneficiaryNumber: [{value: BeneficiaryNumber, disabled: true}, Validators.required],
      DependantsPractitioner: ['', Validators.required],
      PracticeNumber: [''],
      DependantProvince: ['', Validators.required],
      DependantCity: ['', Validators.required],
    });
  }

  addDependant(FullName, BeneficiaryNumber): void {
    this.dependants = this.optionChangeForm.get('Dependants') as FormArray;
    console.log(this.dependants);
    this.dependants.push(this.createDependant(FullName, BeneficiaryNumber));
  }

  changeDependantProvince(data, index) {
    console.log(data, index, 'running');
    let item = this.dependants.at(index);
    console.log(item.value.DependantProvince.ID);
      this.api.getCities(item.value.DependantProvince.ID)
      .subscribe(cities => {
        this.cities_dependants = JSON.parse(cities.data);
        console.log(cities);
  })
}

changeDependantCity(data, index) {
  console.log(data, index, 'running');
  let item = this.dependants.at(index);
  console.log(data);
  console.log(item.value.DependantProvince.ID, item.value.DependantCity.ID);
    this.api.getGeneralPractitioners(item.value.DependantProvince.ID, item.value.DependantCity.ID)
    .subscribe(gps => {
      this.gps_dependants = JSON.parse(gps.data);
      console.log(gps);
})
}

selectDependantPractitioner(data, index) {
  console.log(data, index, 'running');
  let item = this.dependants.at(index);
  item.patchValue({PracticeNumber: item.value.DependantsPractitioner.PracticeNumber})
  console.log(data);
  console.log(item.value);
}


async checkAndCloseLoader() {
  // Use getTop function to find the loader and dismiss only if loader is present.
  const loader = await this.loadingCtrl.getTop();
  // if loader present then dismiss
   if(loader !== undefined) { 
     await this.loadingCtrl.dismiss();
   }
 }

 async showLoader() {
  let loaderFunc = await this.loadingCtrl.create({
    spinner: 'circular',
    message: 'Loading',
    cssClass: 'login-spinner',
    duration: 3000
  });
  await loaderFunc.present();
}

async showAlert() {
    let tourAlert = await this.alertCtrl.create({
      header: 'Important Notice',
      // tslint:disable-next-line: max-line-length
      subHeader: `Your current option is <span class="font-bold">${this.plan}</span>, you are now
      about to change your
      membership option for 2021 to <span class="font-bold">${this.optionTitle}</span>.
    Please note: if you are found to have used your personal medical savings account (PMSA)
      on the Ruby option, such
      use may result in you being indebted to the Scheme for any claims funded by the Scheme in excess of your PMSA
      contributions.
    Please note: When changing from any other benefit option to EVO or Tanzanite One, you and
      your dependants are
      each required to nominate a GP.`,
      buttons: [
        {
          text: 'Decline',
          handler: async () => {
            this.router.navigateByUrl('/tabs/tabs/home');
          }
        },
        {
          text: 'Accept',
          handler: () => {
            
            return false;
          }
        }
      ]
    });
    await tourAlert.present();
}


  

}
