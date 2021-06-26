import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MemberCommunicationPreferences, StandardCommunicationPreferences } from 'src/app/models/communication.model';
import { Member } from 'src/app/models/member.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HelpersService } from 'src/app/services/helpers.service';

@Component({
  selector: 'app-communication-preferences',
  templateUrl: './communication-preferences.page.html',
  styleUrls: ['./communication-preferences.page.scss'],
})
export class CommunicationPreferencesPage implements OnInit {
  member:Member;
  memberCommunicationPreferences!: MemberCommunicationPreferences;
  communicationPreferencesForm!: FormGroup;
  standardCommunicationPreferences!: StandardCommunicationPreferences;
  languagesArray!: StandardCommunicationPreferences['Languages'];

  constructor(private api:AuthenticationService, private fb:FormBuilder, private helpers: HelpersService) { }

  ngOnInit() {
    this.member = this.api.getMember();
    this.initializeCommunicationPreferences();
    this.getMemberCommunicationPreferences();


    // Fetch Communcation Preferences from CRM
    this.api.getStandardCommunicationPreferences(this.member.access_token).subscribe(res => {
      this.standardCommunicationPreferences = JSON.parse(res.data);
      this.languagesArray = this.standardCommunicationPreferences.Languages;
      // console.log(this.languagesArray)
    });
  }

  getMemberCommunicationPreferences = () => {
    this.api.getMemberCommunicationPreferences(this.member.MemberGuid, this.member.access_token)
      .subscribe(res => {
        this.memberCommunicationPreferences = JSON.parse(res.data);
        console.log(this.memberCommunicationPreferences);
        this.communicationPreferencesForm.get('Language').patchValue({Description: this.memberCommunicationPreferences.Language.Description});
        this.communicationPreferencesForm.patchValue({Statements: this.memberCommunicationPreferences.Statements});
        this.communicationPreferencesForm.patchValue({ClaimInformation: this.memberCommunicationPreferences.ClaimInformation});
        this.communicationPreferencesForm.patchValue({AnnualOptionChange: this.memberCommunicationPreferences.AnnualOptionChange});
        this.communicationPreferencesForm.patchValue({Newsletter: this.memberCommunicationPreferences.Newsletter});
      }, err => {
        console.log(err);
      });
  };

  initializeCommunicationPreferences = () => {
    this.communicationPreferencesForm = this.fb.group({
      Language: this.fb.group({
        ID: '',
        Description: '',
      }),
      Statements: '',
      ClaimInformation: '',
      AnnualOptionChange: '',
      Newsletter: ''
    });
  };

  updateCommunicationPreferences = (form: any) => {
    this.helpers.presentLoadingIndicator();
    const payload = this.communicationPreferencesForm.value;
    console.log(payload);
    this.api.updateMemberCommunicationPreferences(payload, this.member.MemberGuid, this.member.access_token)
      .subscribe(
        res => {
          this.helpers.hideLoadingIndicator();
          this.helpers.presentToast('Thank you, a service request has been created to update your communication preferences. To avoid duplication of work please do not submit these details more than once. Your updated details will be available within 48 hours.');

        }, err => {
          this.helpers.hideLoadingIndicator();
          console.log(err.error.toString());
          this.helpers.presentToast('Please review all highlighted fields.');
        }
      );
  };

  onUpdateStatements(e:CustomEvent) {
    console.log(e.detail.value);
    this.communicationPreferencesForm.patchValue({Statements: e.detail.value});
  }

  onUpdateClaimInformation(e:CustomEvent) {
    console.log(e.detail.value);
    this.communicationPreferencesForm.patchValue({ClaimInformation: e.detail.value});
  }

  onUpdateAnnualOptionChange(e:CustomEvent) {
    console.log(e.detail.value);
    this.communicationPreferencesForm.patchValue({AnnualOptionChange: e.detail.value});
  }

  onUpdateNewsletter(e:CustomEvent) {
    console.log(e.detail.value);
    this.communicationPreferencesForm.patchValue({Newsletter: e.detail.value});
  }


  get communicationPreferencesFormControl() {
    return this.communicationPreferencesForm.controls;
  }

}
