import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import * as moment from 'moment';
import { ClaimsByDate } from 'src/app/models/claim.model';
import { Router } from '@angular/router';
import { Member } from 'src/app/models/member.model';

@Component({
  selector: 'app-claims-landing',
  templateUrl: './claims-landing.page.html',
  styleUrls: ['./claims-landing.page.scss'],
})
export class ClaimsLandingPage implements OnInit {
  dateStatus = "from";
  dateFrom = "2000-8-5";
  dateTill = "2021-2-2";
  claims:any;
  automaticClose = true;
  isLoading = false;
  member:Member = null;

  constructor(private api: AuthenticationService, private datePicker: DatePicker, private router: Router) {
  }

  ngOnInit() {
    this.member = this.api.getMember();
    this.getClaimsByDate();
  }

  getClaimsByDate() {
    this.isLoading = true;
    this.api.getClaimsByDate(this.dateFrom, this.dateTill, this.member.MemberGuid, this.member.access_token)
    .subscribe(claims => {
      console.log(JSON.parse(claims.data));
      this.claims = JSON.parse(claims.data);
      this.isLoading = false;
    }, err => {
      console.log(err);
    })
  }

  doRefresh(e?) {
    this.isLoading = true;
    this.getClaimsByDate();
    e.target.complete();
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
      // maxDate: new Date(),
      // minDate: moment().subtract(3, 'months').toDate()
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
      date: new Date(this.dateTill),
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
          this.getClaimsByDate();
          
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


  toggleSection(index) {
    this.claims[index].open = !this.claims[index].open;

    if (this.automaticClose && this.claims[index].open) {
      this.claims.filter((theItem, itemIndex) => itemIndex != index)
      .map(item => item.open = false);
    }
  }

}
