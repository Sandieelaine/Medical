import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { Member } from 'src/app/models/member.model';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.page.html',
  styleUrls: ['./activity.page.scss'],
})
export class ActivityPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  member:Member = null;
  activity;

  constructor(private api: AuthenticationService) { }

  ngOnInit() {
    this.member = this.api.getMember();
    this.loadActivity();
  }

  loadActivity() {
    this.api.getMemberActivity(this.member.MemberGuid, this.member.access_token)
    .subscribe(activity => {
      this.activity = JSON.parse(activity.data);
    })
  }

  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      event.target.complete();
      let data;
      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (data.length == 1000) {
        event.target.disabled = true;
      }
    }, 500);
  }

}
