import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Member } from 'src/app/models/member.model';
import { FullMember } from 'src/app/models/fullmember.model';

@Component({
  selector: 'app-card',
  templateUrl: './card.page.html',
  styleUrls: ['./card.page.scss'],
  animations: [
    trigger("cardFlip", [
      state(
        "default",
        style({
          transform: "none"
        })
      ),
      state(
        "flipped",
        style({
          transform: "rotateY(180deg)"
        })
      ),
      state(
        "matched",
        style({
          visibility: "false",
          transform: "scale(0.05)",
          opacity: 0
        })
      ),
      transition("default => flipped", [animate("400ms")]),
      transition("flipped => default", [animate("400ms")]),
      transition("* => matched", [animate("400ms")])
    ])
  ]
})
export class CardPage implements OnInit, OnDestroy {
  member:Member;
  profile:FullMember;
  state = 'default';
  MemberImage;

  constructor(private screenOrientation: ScreenOrientation, private router: Router, private api: AuthenticationService) { }


  async ngOnInit() {
    await this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
    this.member = this.api.getMember();
    this.getMemberProfile();
  }

  ngOnDestroy() {
    
  }

  getMemberProfile() {
    this.api.getMemberProfile(this.member.MemberGuid, this.member.access_token).subscribe(profile => {
      this.profile = JSON.parse(profile.data);
      this.MemberImage = `https://api.gems.gov.za/api/v1/MemberImage/${this.profile.BeneficiaryID}?counter=0`;
      // console.log(this.profile);
    }, err => {
      // console.log(err);
    });
  }

  cardClicked() {
    if (this.state === "default") {
      this.state = "flipped";
    } else {
      this.state = "default";
    }
  }

  closePage() {
    this.router.navigateByUrl('/tabs/tabs/home').then(res => {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    }).catch(err => {
      console.log(err);
    });
    
  }

}
