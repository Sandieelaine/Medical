import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { Member, MemberContactInformation } from 'src/app/models/member.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HelpersService } from 'src/app/services/helpers.service';

@Component({
  selector: 'app-contact-information',
  templateUrl: './contact-information.page.html',
  styleUrls: ['./contact-information.page.scss'],
})
export class ContactInformationPage implements OnInit {
  MemberContactInfoForm:FormGroup;
  member:Member = null;
  memberContactInformation:MemberContactInformation;

  constructor(private api: AuthenticationService, private fb: FormBuilder, private helpers:HelpersService, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.member = this.api.getMember();
    this.getMemberContactInformation();
    this.initializeMemberContactInfo();
  }

  get contactinfoControllers() {
    return this.MemberContactInfoForm.controls;
  }

  getMemberContactInformation = () => {
    // this.showLoadingIndicator();
    this.api.getMemberContactInformation(this.member.MemberGuid, this.member.access_token)
      .subscribe(res => {
        // this.loadingCtrl.dismiss();
        console.log(res);
        this.memberContactInformation = JSON.parse(res.data);
        // console.log(res);
      }, err => {
        // this.loadingCtrl.dismiss();
        console.log(err);
      });
  };

  initializeMemberContactInfo = () => {
    this.MemberContactInfoForm = this.fb.group({
      BeneficiaryID: [''],
      WorkNumber: ['', [Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(10)]],
      CellphoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(10)]],
      TelNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(10)]],
      FaxNumber: ['', [Validators.pattern('^[0-9]*$'), Validators.minLength(8)]],
      IncomeTaxNumber: '',
      EmailAddress: ['', [Validators.required, Validators.email]],
      ResidentialAddress: this.fb.group({
        AddressLine1: '',
        AddressLine2: '',
        AddressLine3: '',
        Province: '',
        PostalCode: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
      }),
      PostalAddress: this.fb.group({
        AddressLine1: '',
        AddressLine2: '',
        AddressLine3: '',
        Province: '',
        PostalCode: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
      })
    });
  };

  updateMemberContactInformation = (form: any) => {
    this.MemberContactInfoForm.value.BeneficiaryID = this.member.MemberGuid;
    const payload = this.MemberContactInfoForm.value;
    this.showLoadingIndicator();
    this.api.updateMemberContactInformation(payload, this.member.MemberGuid, this.member.access_token)
      .subscribe(
        res => {
          this.loadingCtrl.dismiss();
          this.helpers.presentToast('Profile updated successfully. Thank you, a service request has been created to update your delivery address. To avoid duplication of work please do not submit these details more than once. Your updated details will be available within 48 hours.');

        }, err => {
          this.loadingCtrl.dismiss();
          console.error(`%c ${err.error.toString()}`, `background: #222; color: #bada55`);
          this.helpers.presentToast('Please review all highlighted fields.');
        }
      );
  };

  public memberContactInfoFormErrorHandling = (control: string, error: string) => {
    return this.MemberContactInfoForm.controls[control].hasError(error);
  };

  // Used for MAT-SELECT to check set the current value
  public objectComparisonFunction(title: any, value: any): boolean {
    // console.log(title.ID)
    return title.ID === value.ID;
  }


  public errorHandling = (control: string, error: string) => {
    // console.log(this.contactInfo_controllers)
    // if(this.contactInfo_controllers.controls) {

    // console.log(this.contactInfo_controllers)
    // console.log(this.MemberContactInfoForm.controls)
    // return this.MemberContactInfoForm.controls[control].hasError(error);
  };


  public errorHandling2 = (formGroupName: string, control: string, error: string) => {
    const formgroup = this.contactinfoControllers[formGroupName];
    // console.log(formgroup['controls'].control)
    // if(this.contactInfo_controllers.controls) {

    // console.log(this.contactInfo_controllers)
    // console.log(this.MemberContactInfoForm.controls)
    // return this.MemberContactInfoForm.controls[control].hasError(error);
  };

  showLoadingIndicator() {
    this.helpers.showLoader();
  }


}
