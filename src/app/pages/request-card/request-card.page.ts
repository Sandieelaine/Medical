import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
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
  
  constructor(private fb: FormBuilder, private api: AuthenticationService, private helper: HelpersService) {
    this.cardRequestForm = this.fb.group({
      AddressLine1: ['', [Validators.required]],
      PostalCode: ['', [Validators.required]],
      AddressLine2: ['', Validators.required],
      AddressLine3: ['', Validators.required],
      Province: ['', [Validators.required],]
    });
  }

  ngOnInit() {
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
    this.cardRequestForm.value.Province.$$hashKey = "object:364";
    console.log(this.cardRequestForm.value);

    this.api.requestNewCard(this.cardRequestForm.value)
    .subscribe(res => {
      this.helper.presentToast('Your card will be sent to your new address');
    }, err => {
      this.helper.presentToast('Failed To Complete Request');
    });

  }

}
