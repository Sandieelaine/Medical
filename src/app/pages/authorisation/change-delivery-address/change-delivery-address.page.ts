import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Member } from 'src/app/models/member.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HelpersService } from 'src/app/services/helpers.service';

@Component({
  selector: 'app-change-delivery-address',
  templateUrl: './change-delivery-address.page.html',
  styleUrls: ['./change-delivery-address.page.scss'],
})
export class ChangeDeliveryAddressPage implements OnInit {
  member:Member = null;
  chronicMedicationDeliveryForm: FormGroup;
  staticprovincesArray = [
    'Eastern Cape',
    'Free State',
    'Gauteng',
    'Kwa-Zulu Natal',
    'Limpopo',
    'Mpumalanga',
    'North West',
    'Northern Cape',
    'Western Cape'
  ];

  constructor(private fb: FormBuilder, private api: AuthenticationService, private helper: HelpersService) { }

  ngOnInit() {
    this.member = this.api.getMember();
    this.initializeChronicMedicationForm();
  }

  get chronicMedicationDeliveryFormControl() {
    return this.chronicMedicationDeliveryForm.controls;
  }

  //Form Controllers for Update Chronic Medication Form
  initializeChronicMedicationForm = () => {
    this.chronicMedicationDeliveryForm = this.fb.group({
        DeliveryAddressLine1: ['', [Validators.required]],
        DeliveryAddressLine2: ['', [Validators.required]],
        DeliveryAddressLine3: ['', [Validators.required]],
        DeliveryAddressLine4: ['', [Validators.required]],
        DeliveryAddressPostalCode: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
    });
  };

  postChronicMedicationDeliveryForm() {

        const payload = this.chronicMedicationDeliveryForm.value;
        console.log(this.chronicMedicationDeliveryForm.value);

        this.api.updateChronicMedicationDeliveryAddress(this.member.MemberGuid, this.member.access_token, payload)
            .subscribe(res => {
                    const successMessage = 'Thank you, a service request has been created to update your delivery address. To avoid duplication of work please do not submit these details more than once. Your updated details will be available within 48 hours.';
                    this.helper.presentToast(successMessage);
                    console.log(`%c ${successMessage}`, `background: #222; color: #bada55`);
                }, err => {
                    const failureMessage = 'There was an error in updating the delivery address.';
                    this.helper.presentToast(failureMessage);
                    console.error(`%c ${err.error.toString()}`, `background: #222; color: #bada55`);

                }
            );
};

}
