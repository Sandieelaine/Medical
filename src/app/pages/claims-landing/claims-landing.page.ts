import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import * as moment from 'moment';

@Component({
  selector: 'app-claims-landing',
  templateUrl: './claims-landing.page.html',
  styleUrls: ['./claims-landing.page.scss'],
})
export class ClaimsLandingPage implements OnInit {
  dateStatus = "from";
  dateFrom = "2020-8-5";
  dateTill = "2021-2-2";

  constructor(private api: AuthenticationService, private datePicker: DatePicker) {
  }

  ngOnInit() {
    this.getClaimsByDate();
  }

  getClaimsByDate() {
    this.api.getClaimsByDate('2020-6-1', '2021-2-2')
    .subscribe(claims => {
      console.log(claims);
    }, err => {
      console.log(err);
    })
  }

  segmentChanged(e: CustomEvent) {
    console.log(e);
  }

  updateDateFrom() {
    console.log('clicked');
    console.log(this.dateStatus);
    console.log
    this.datePicker.show({
      date: new Date(this.dateFrom),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
      maxDate: new Date(),
      minDate: moment().subtract(3, 'months').toDate()
    }).then(
      date => {
        console.log('Got date: ', date);
        var check = moment(date, 'YYYY/MM/DD');
        
        var month = check.format('M');
        var day   = check.format('D');
        var year  = check.format('YYYY');

        console.log(month, day, year);
        this.dateFrom = `${year}-${month}-${day}`;
        if(moment(date).isBefore(moment(new Date(this.dateTill)))) {
          console.log('Date is before')
        } else if(moment(date).isAfter(moment(new Date(this.dateTill)))) {
          console.log('Date not allowed');
          alert('Please select a date before your selected date until');
        } else {
          console.log('Noting fired');
        }
      },
      err => console.log('Error occurred while getting date: ', err)
    );
  }

  updateDateTill() {
    console.log('clicked');
    console.log(this.dateStatus);
    console.log
    this.datePicker.show({
      date: new Date(this.dateFrom),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
      maxDate: new Date(),
      minDate: moment().subtract(3, 'months').toDate()
    }).then(
      date => {
        console.log('Got date: ', date);
        var check = moment(date, 'YYYY/MM/DD');
        
        var month = check.format('M');
        var day   = check.format('D');
        var year  = check.format('YYYY');

        console.log(month, day, year);
        this.dateTill = `${year}-${month}-${day}`;
        if(moment(date).isAfter(moment(new Date(this.dateFrom)))) {
          console.log('Date is after and okay')
        } else if(moment(date).isBefore(moment(new Date(this.dateFrom)))) {
          console.log('Date not allowed');
          alert('Please select a date after your selected date from');
        } else {
          console.log('Noting fired');
        }
      },
      err => console.log('Error occurred while getting date: ', err)
    );
  }

}
