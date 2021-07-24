import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Member } from 'src/app/models/member.model';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-claim',
  templateUrl: './claim.page.html',
  styleUrls: ['./claim.page.scss'],
})
export class ClaimPage implements OnInit {
  member: Member;
  claim;

  constructor(
    private activatedRoute: ActivatedRoute,
    private api: AuthenticationService
  ) { }

  ngOnInit() {
    this.member = this.api.getMember();
    this.activatedRoute.paramMap.subscribe(paramMap => {
      let refNumber = paramMap.get('claimID');
      // console.log(refNumber);
      this.api.getClaimByReferenceNumber(refNumber, this.member.MemberGuid, this.member.access_token).subscribe(claim => {
        this.claim = JSON.parse(claim.data);
        console.log(this.claim);
        console.log(refNumber);
      })
    })
  }

}
