import { ClaimsHistory } from './../models/claim.model';
import { Platform, ToastController } from '@ionic/angular';
import { Activity } from './../models/activity.model';
import { Member } from './../models/member.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { tap, timeout, retry, switchMap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HTTP } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  url = 'https://api.gems.gov.za';
  selectedMember: Member;
  token: string;
  authenticationState = new BehaviorSubject(false);
  public user: Observable<any>;
  private userData = new BehaviorSubject(null);

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private platform: Platform,
    private router: Router,
    private httpNative: HTTP,
    public toastController: ToastController) {
    this.loadStoredTokenData();
    this.storage.get('member').then(res => {
      console.log(JSON.parse(res.data));
      const parsedData = JSON.parse(res.data);
      this.selectedMember = parsedData;
    })
  }

  checkToken() {
    this.storage.get('member').then(res => {
      if (res) {
        this.authenticationState.next(true);
      }
    });
  }


  login(username: string, password: string) {
    this.storage.remove('member').then(res => console.log(res));
    const body = {
        grant_type: 'password',
        username,
        password
      };
    let req = this.httpNative.post(`${this.url}/token`,
    body,
    {
      "Content-Type": "application/x-www-form-urlencoded"
    });
    return from(req).pipe(
      timeout(10000),
      retry(3)
    );
  }

  reloadToken() {
    this.storage.get('member').then(res => {
      console.log(JSON.parse(res.data));
      const parsedData = JSON.parse(res.data);
      this.selectedMember = parsedData;
      console.log(this.selectedMember);
    });
  }

  loadStoredTokenData() {
    let platformObs = from(this.platform.ready());
    console.log(platformObs)
 
    this.user = platformObs.pipe(
      switchMap(() => {
        return from(this.storage.get('member'));
      }),
      map(res => {
        console.log(res);
        if (res) {
          let tokenData = res;
          this.userData.next(tokenData);
          return true;
        } else {
          return null;
        }
      })
    );
  }

  getSelectedMember() {
    let member = this.storage.get('member');
    return from(member);
  }

  logout() {
    return this.storage.remove('member').then(() => {
      this.authenticationState.next(false);
      this.router.navigateByUrl('/onboard');
    });
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }

  getMemberFullProfile() {
    this.reloadToken();
    if (!this.selectedMember) { return }
    let req = this.httpNative.get(`${this.url}/api/v1/Members/${this.selectedMember.MemberGuid}`,
    {},
    {
      'Authorization': `Bearer ${this.selectedMember.access_token}`
    });
    return from(req);
  }

  getMemberActivity(id, pageNumber = 1) {
    if (!this.selectedMember) { return }
    let req = this.httpNative.get(
      `${this.url}/api/v1/Members/${this.selectedMember.MemberGuid}/activities?pageCount=5&pageNumber=${pageNumber}`,
      {},
      {
        'Authorization': `Bearer ${this.selectedMember.access_token}`
      }
      );
    return from(req);
  }

  getDayToDayBenefits() {
    if (!this.selectedMember) { return }
    let req = this.httpNative.get(`${this.url}/api/v1/Members/${this.selectedMember.MemberGuid}/daytodayBenefit/`,
    {},
    {
      'Authorization': `Bearer ${this.selectedMember.access_token}`
    }
    );
    return from(req);
  }

  getAllDocuments() {
    if (!this.selectedMember) { return }
    let req = this.httpNative.get(`${this.url}/api/v1/BenefitDocuments/GetAllDocuments/${this.selectedMember.MemberGuid}`,
    {},
    {
      'Authorization': `Bearer ${this.selectedMember.access_token}`
    }
    );
    return from(req);
  }

  getDocumentFromServer() {

  }

  getClaimsHistory() {
    if (!this.selectedMember) { return }
    let req = this.httpNative.get(`${this.url}/api/v1/Members/${this.selectedMember.MemberGuid}/MemberClaims/`,
    {},
    {
      'Authorization': `Bearer ${this.selectedMember.access_token}`
    }
    );
    return from(req).pipe(
      // timeout(10000)
    );
  }

  getMemberCertificate() {
    if (!this.selectedMember) { return }
    let req = this.httpNative.sendRequest(
      `${this.url}/api/v1/Members/${this.selectedMember.MemberGuid}/memberCertificate/`,
      {
        method: 'get',
        headers: {
          'Authorization': `Bearer ${this.selectedMember.access_token}`,
          "Content-Type": "application/pdf"
         },
        responseType: "blob",
        timeout: 50000
      }
    );
    return from(req).pipe(
      // timeout(10000000)
    );
  }

  getTaxCertificate(year) {
    if (!this.selectedMember) { return }
    let req = this.httpNative.sendRequest(
      `${this.url}/api/v1/Members/${this.selectedMember.MemberGuid}/taxCertificate/${year}`,
      {
        method: 'get',
        headers: {
          'Authorization': `Bearer ${this.selectedMember.access_token}`,
          "Content-Type": "application/pdf"
         },
        responseType: "blob",
        timeout: 50000
      }
    );
    return from(req).pipe(
      // timeout(10000000)
    );
  }

  getClaimStatement(statementID) {
    if (!this.selectedMember) { return }
    let req = this.httpNative.sendRequest(
      `${this.url}/api/v1/Members/${this.selectedMember.MemberGuid}/claimStatements/${statementID}`,
      {
        method: 'get',
        headers: {
          'Authorization': `Bearer ${this.selectedMember.access_token}`,
          "Content-Type": "application/pdf"
         },
        responseType: "blob",
        timeout: 50000
      }
    );
    return from(req).pipe(
      // timeout(10000000)
    );
  }

  getClaimStatementCopy(statementID) {
    if (!this.selectedMember) { return }
    let req = this.httpNative.get(`${this.url}/api/v1/Members/${this.selectedMember.MemberGuid}/claimStatements/${statementID}`,
    {},
    {
      'Authorization': `Bearer ${this.selectedMember.access_token}`,
      "Content-Type": "application/pdf"
    }
    );
    return from(req).pipe(
      // timeout(10000000)
    );
  }

  getClaims() {
    if (!this.selectedMember) { return }
    let req = this.httpNative.get(`${this.url}/api/v1/Members/${this.selectedMember.MemberGuid}/claimStatements/`,
    {},
    {
      'Authorization': `Bearer ${this.selectedMember.access_token}`
    }
    );
    return from(req).pipe(
      // timeout(10000000)
    );
  }


  getBenefits() {
    if (!this.selectedMember) { return }
    let req = this.httpNative.get(`${this.url}/api/v1/Members/${this.selectedMember.MemberGuid}/benefitUsage/`,
    {},
    {
      'Authorization': `Bearer ${this.selectedMember.access_token}`
    }
    );
    return from(req).pipe(
      timeout(10000)
    );
  }

  async presentToast(message, duration = 3000) {
    const toast = await this.toastController.create({
      message,
      duration
    });
    toast.present();
  }

}