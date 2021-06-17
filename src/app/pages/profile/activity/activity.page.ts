import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Member } from 'src/app/models/member.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HelpersService } from 'src/app/services/helpers.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.page.html',
  styleUrls: ['./activity.page.scss'],
})
export class ActivityPage implements OnInit {
  member:Member = null;
  activity = [];
  page_number = 1;
  loadingIndicator;
  memberHasNoActivity;

  constructor(private api: AuthenticationService, private helper:HelpersService, private loadingCtrl:LoadingController) { }

  ngOnInit() {
    this.member = this.api.getMember();
    this.loadActivity();
  }

  loadActivity() {
    this.showLoader();
    this.api.getMemberActivity(this.member.MemberGuid, this.member.access_token, this.page_number)
    .subscribe(activity => {
      this.loadingCtrl.dismiss();
      if (JSON.parse(activity.data).length === 0) {
        this.memberHasNoActivity = true;
      }
      if (this.page_number === 1) {
        this.activity = JSON.parse(activity.data);
      } else if(this.page_number > 1 && this.activity.length > 9) {
        this.activity = this.activity.concat(JSON.parse(activity.data));
      } 
      console.log(this.page_number);
      // Do the addition after everything else has been done
      this.page_number++;
    }, err => {
      this.loadingCtrl.dismiss();
      this.helper.presentToast('Failed to load your activity. Please try again')
    })
  }

  async showLoader() {
    this.loadingIndicator = await this.helper.showLoader();
  }


}
