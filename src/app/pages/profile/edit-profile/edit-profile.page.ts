import { Member } from './../../../models/member.model';
import { AuthenticationService } from './../../../services/authentication.service';
import { Component, NgZone, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { FullMember } from 'src/app/models/fullmember.model';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  user = 'member';
  member: Member = null;
  activity = null;
  dayToDayBenefits = null;
  MemberImage = null;
  selectedMember;
  profile: FullMember = null;
  benefit;
  documents;
  GUID
  slideOpt = {
    slidesPerView: 2.5,
    spaceBetween: 10
  };

  constructor(private auth: AuthenticationService, private storage: Storage, private zone: NgZone, private alertCtrl: AlertController, private router: Router, private activatedRoute: ActivatedRoute) {
    
  }

  ionViewWillEnter() {
    this.member = this.auth.getMember();
    this.getSelectedProfile();
  }

  ngOnInit() {
    this.auth.trackView('/', '360 View Page');
    this.activatedRoute.paramMap
    .subscribe(paramMap => {
      this.GUID = paramMap.get('guid');
      console.log(this.GUID);
    })
    
  }

  getSelectedProfile() {
    this.auth.getMemberProfile(this.GUID, this.member.access_token).subscribe(profile => {
      this.profile = JSON.parse(profile.data);
      this.MemberImage = `https://api.gems.gov.za/api/v1/MemberImage/${this.profile.BeneficiaryID}?counter=0`;
      // console.log(this.profile);
    }, err => {
      // console.log(err);
    });
  }




  

}
