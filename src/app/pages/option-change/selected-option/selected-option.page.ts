import { FullMember } from 'src/app/models/fullmember.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HelpersService } from 'src/app/services/helpers.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  optionChangeForm: FormGroup;
  provinces;
  cities = [];

  constructor(private activatedRoute: ActivatedRoute, private api: AuthenticationService, private helper: HelpersService, private fb: FormBuilder) {
    this.optionChangeForm = this.fb.group({
      mainMemberFirstName: ['', [Validators.required]],
      mainMemberLastName: ['', Validators.required],
      memberNumber: ['', [Validators.required]],
      mainMemberProvince: ['', Validators.required],
      mainMemberCity: ['', Validators.required],
      mainMemberPractitioner: ['', [Validators.required]]
    });
    
  }

  ngOnInit() {
    this.loadProfile();
    this.getProvinces();
    this.activatedRoute.paramMap.subscribe(paramMap => {
      console.log(paramMap);
      const option = paramMap.get('option');
      const status = paramMap.get('status');
      this.optionTitle = option;
      if (status === 'EVO') {
        this.isEVOOption = true;
      } else if (status === 'nonEVO') {
        this.isEVOOption = false;
      }
      console.log(option, status);
    });
    this.onChanges();
  }

  loadProfile() {
    this.api.getMemberFullProfile()
    .subscribe(profile => {
      const profileData = JSON.parse(profile.data);
      this.profile = profileData;
      this.plan = profileData.Plan.BenefitPlanName.toLowerCase();
      this.optionChangeForm.patchValue({mainMemberFirstName: this.profile.FirstName});
      this.optionChangeForm.patchValue({mainMemberLastName: this.profile.LastName});
      this.optionChangeForm.patchValue({memberNumber: this.profile.MemberNo});
      console.log(this.plan);
    }, err => {

    });
  }

  getProvinces() {
    this.api.getProvinces()
    .subscribe(provinces => {
      this.provinces = JSON.parse(provinces.data);
      console.log(provinces);
    })
  }

  getCities(ID) {
    this.api.getCities(ID)
    .subscribe(cities => {
      this.cities = JSON.parse(cities.data);
      console.log(cities);
    })
  }

  changeToNonEVOOption() {
    this.api.changeOption(this.optionTitle)
    .subscribe(res => {
      this.helper.presentToast(
        'Thank you, a service request has been created to change your Benefit Option from Ruby to Beryl To avoid duplication of work please do not submit these details more than once.',
        5000
      )
    }, err => {
      this.helper.presentToast(
        'Failed To Change Option. Please try again!',
        5000
      )
    })
  }

  changeToEVOOption() {

  }


  onChanges(): void {
    this.optionChangeForm.get('mainMemberProvince').valueChanges.subscribe(val => {
      console.log(val);
      this.getCities(val.ID);
    });
  }

}
