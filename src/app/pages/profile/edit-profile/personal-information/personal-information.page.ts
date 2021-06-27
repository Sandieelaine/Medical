import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FullMember } from 'src/app/models/fullmember.model';
import { Member, MemberDropdownOptions } from 'src/app/models/member.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HelpersService } from 'src/app/services/helpers.service';
import { Plugins, CameraResultType } from '@capacitor/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
const { Camera } = Plugins;

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.page.html',
  styleUrls: ['./personal-information.page.scss'],
})
export class PersonalInformationPage implements OnInit {
  member:Member = null;
  profile: FullMember = null;
  MemberImage = null;
  personalInformationForm: FormGroup;
  base64String;
  loader;
  GUID;

  memberDropdownOptions!: MemberDropdownOptions;
  provincesArray!: MemberDropdownOptions['Provinces'];
  TitleArray!: MemberDropdownOptions['TitleOptions'];
  maritalStatusArray!: MemberDropdownOptions['MaritalStatusOptions'];
  genderArray!: MemberDropdownOptions['GenderOptions'];

  constructor(private api: AuthenticationService, private fb: FormBuilder, private helper: HelpersService, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.member = this.api.getMember();
    this.activatedRoute.paramMap
    .subscribe(paramMap => {
      this.GUID = paramMap.get('guid');
      console.log(this.GUID)
    });
    this.getMemberProfile();
    this.getOptionsFromCRM();
    this.initializePersonalInfo();
  }

  getMemberProfile() {
    this.helper.presentLoadingIndicator();
    this.api.getMemberProfile(this.GUID, this.member.access_token).subscribe(profile => {
      this.helper.hideLoadingIndicator();
      this.profile = JSON.parse(profile.data);
      this.MemberImage = `https://api.gems.gov.za/api/v1/MemberImage/${this.profile.BeneficiaryID}?counter=0`;
      // console.log(this.profile);
    }, err => {
      this.helper.hideLoadingIndicator();
      // console.log(err);
    });
  }

  initializePersonalInfo = () => {
    this.personalInformationForm = this.fb.group({
      isChangePlanAvailable: [true],
      optionChangeEvoOnly: [false],
      ProgramName: null,
      MemberStateCode: [''],
      BeneficiaryID: [''],
      MemberIDNo: ['', [Validators.minLength(13), Validators.maxLength(13)]],
      Gender: '',
      DOB: '',
      Employer: null,
      Dependants: [],
      EmailAddress: ['', [Validators.email]],
      FirstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+')]],
      LastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+')]],
      MemberTitle: ['', [Validators.required]],
      MemberMaritalStatus: ['', [Validators.required]],
      // MemberTitle: this.fb.control({
      //   ID: '',
      //   Description: '',
      //   $$hashKey: '',
      // }),
      // MemberMaritalStatus:
      //   this.fb.group({
      //     ID: '',
      //     Description: '',
      //     $$hashKey: '',
      //   }),

    });
  };

  updateMemberPersonalInfo = (form: any) => {
    this.helper.presentLoadingIndicator();
    // this.personalInformationForm.value.BeneficiaryID = this.memberGUID;

    const payload = this.personalInformationForm.value;
    this.api.updateMemberPersonalInfo(payload, this.GUID, this.member.access_token)
      .subscribe(
        res => {
          this.helper.hideLoadingIndicator();
          this.helper.presentToast('Profile updated successfully. Thank you, a service request has been created to update your delivery address. To avoid duplication of work please do not submit these details more than once. Your updated details will be available within 48 hours.');

        }, err => {
          this.helper.hideLoadingIndicator();
          console.error(`%c ${err.error.toString()}`, `background: #222; color: #bada55`);
          this.helper.presentToast('Please review all highlighted fields.');
        }
      );
  };

  public personalInformationFormErrorHandling = (control: string, error: string) => {
    if(this.personalInformationForm.dirty && this.personalInformationForm.touched) {
      return this.personalInformationForm.controls[control].hasError(error);
    }
  };

  getOptionsFromCRM() {
    // Fetch Dropdown items from CRM
    this.api.getBeneficiaryOptions().subscribe(res => {
      this.memberDropdownOptions = JSON.parse(res.data);
      this.provincesArray = this.memberDropdownOptions.Provinces;
      this.TitleArray = this.memberDropdownOptions.TitleOptions;
      this.maritalStatusArray = this.memberDropdownOptions.MaritalStatusOptions;
      this.genderArray = this.memberDropdownOptions.GenderOptions;
      console.log(this.memberDropdownOptions);
    });
  }

  // Used for to check set the current value on ION-SELECT
  public objectComparisonFunction(title: any, value: any): boolean {
    // console.log(title.ID)
    return title.ID === value.ID;
  }

  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
      });
      console.log(image);
      this.base64String = 'data:image/png;base64,' + image.base64String;
      this.areYouSure();
    } catch (error) {
      console.log(error, 'hi');
    }
    


    
    
    // this.MemberImage = 'data:image/jpeg;base64,' + image.base64String;
    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    // var imageUrl = image.webPath;
    // Can be set to the src of an image now
    // imageElement.src = imageUrl;
  }

  async areYouSure() {
      let tourAlert = await this.alertCtrl.create({
        header: 'Home Page',
        subHeader: 'Get quick access to your claims, downloads, help and more on this page.',
        buttons: [
          {
            text: 'Skip',
            handler: async () => {
            }
          },
          {
            text: 'Continue',
            handler: () => {
              const payload = {
                Base64ImageString: this.base64String,
                MemberName: this.profile.FullName
              };
              console.log(payload);
          
              this.api.updateMemberImage(payload, this.GUID, this.member.access_token)
              .subscribe(res => {
                console.log(res.data);
                this.helper.presentToast('Image succesfully updated');
                this.MemberImage = this.base64String;
              }, err => {
                console.log(err);
                this.helper.presentToast('Image update failed');
              })
            }
          }
        ]
      });
      await tourAlert.present();
  }

  showLoadingIndicator() {
    this.helper.showLoader();
  }

    

}
