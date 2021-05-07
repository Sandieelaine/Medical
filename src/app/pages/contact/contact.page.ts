// tslint:disable: prefer-const
import { Component, OnInit } from '@angular/core';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';

import { Plugins } from '@capacitor/core';
const { Geolocation } = Plugins;

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {

  constructor(private launchNavigator: LaunchNavigator) { }

  ngOnInit() {
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

}
