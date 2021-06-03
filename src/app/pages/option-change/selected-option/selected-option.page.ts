import { FullMember } from 'src/app/models/fullmember.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HelpersService } from 'src/app/services/helpers.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  gps = [];
  dependants;

  constructor(private activatedRoute: ActivatedRoute, private api: AuthenticationService, private helper: HelpersService, private fb: FormBuilder) {
    this.optionChangeForm = this.fb.group({
      mainMemberFirstName: [{value: '', disabled: true}, [Validators.required]],
      mainMemberLastName: [{value: '', disabled: true}, Validators.required],
      memberNumber: [{value: '', disabled: true}, [Validators.required]],
      mainMemberProvince: ['', Validators.required],
      mainMemberCity: ['', Validators.required],
      mainMemberPractitioner: ['', [Validators.required]],
      Doyouwanttoapplythispractitionertoall: ['', [Validators.required]],
      // Dependants: this.fb.array([])
    });
    this.optionChangeForm.patchValue({Doyouwanttoapplythispractitionertoall: true});
    
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
    this.onCityChange();
  }

  loadProfile() {
    this.api.getMemberFullProfile()
    .subscribe(profile => {
      const profileData = JSON.parse(profile.data);
      this.profile = profileData;
      if (this.profile.Dependants && this.profile.Dependants.length > 0) {
        this.optionChangeForm.addControl('Dependants', this.fb.array([]));
        for (var dependant of this.profile.Dependants) {
          console.log(dependant.FirstName);
          this.addDependant(dependant.FullName, dependant.BeneficiaryCode);
        }
      }
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

  getGPs(provinceID, cityID) {
    this.api.getGeneralPractitioners(provinceID, cityID)
    .subscribe(gps => {
      this.gps = JSON.parse(gps.data);
      console.log(gps);
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
    console.log(this.optionChangeForm.value);
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

  onDependantChanges(): void {
    this.optionChangeForm.get('DependantProvince').valueChanges.subscribe(val => {
      console.log(val);
      this.optionChangeForm.patchValue({DependantProvince: ''});
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
      DependantsPractitioner: '',
      PracticeNumber: '',
      DependantProvince: '',
      DependantCity: ''
    });
  }

  addDependant(FullName, BeneficiaryNumber): void {
    this.dependants = this.optionChangeForm.get('Dependants') as FormArray;
    console.log(this.dependants);
    this.dependants.push(this.createDependant(FullName, BeneficiaryNumber));
  }

  

}