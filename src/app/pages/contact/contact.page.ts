// tslint:disable: prefer-const
import { Component, OnInit } from '@angular/core';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';

import { Plugins } from '@capacitor/core';
import { PickerController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Contact } from 'src/app/models/contact.model';
const { Geolocation } = Plugins;

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {
  contactOptions:Contact;

  constructor(private launchNavigator: LaunchNavigator, private pickerCtrl: PickerController, private api: AuthenticationService) { }

  ngOnInit() {
    this.loadContactOptions();
  }

  loadContactOptions() {
    this.api.getContactOptions()
    .subscribe(res => {
      console.log(res);
      this.contactOptions = JSON.parse(res.data);
    }, err => {
      console.log(err);
    });
  }

  call() {
    window.open('tel:0860004367');
  }

  email() {
    window.open('mailto:info@gems.gov.za');
  }

  async navigate() {
    try {
      let options: LaunchNavigatorOptions = {
        start: 'London, ON',
        enableGeolocation: true
      };

      let navigate = await this.launchNavigator.navigate([-25.786513, 28.2815323], options);
    } catch (err) {
      alert(err);
    }
  }

  async getCurrentPosition() {
    const coordinates = await Geolocation.getCurrentPosition();
    alert(coordinates.coords.latitude);
  }

  async openPicker() {
    const picker = await this.pickerCtrl.create({
      buttons: [{
        text: 'Done',
        handler: res => {
          console.log(res);
          window.open(`mailto:${res.status.value}`);
        }
      }],
      columns: [{
        name: 'status',
        options: [
          {
            text: 'General Enquiries',
            value: 'enquiries@gems.gov.za'
          },
          {
          text: 'Chronic Authorizations',
          value: 'enquiries@gems.gov.za'
        },
        {
          text: 'Chronic Medicine Supply',
          value: 'enquiries@gems.gov.za'
        },
        {
          text: 'Compliments',
          value: 'enquiries@gems.gov.za'
        }]
      }]
    });
    await picker.present();
  }

}
