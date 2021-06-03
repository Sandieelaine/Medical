import { ClaimsHistory } from './../models/claim.model';
import { Platform, ToastController } from '@ionic/angular';
import { Activity } from './../models/activity.model';
import { Member } from './../models/member.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { tap, timeout, retry, switchMap, map, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HTTP } from '@ionic-native/http/ngx';
import { RegisterMember, RegisterMemberResponse } from '../models/auth.model';

declare var gtag;

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  url = 'https://api.gems.gov.za';
  // url = 'https://qa.api.gems.gov.za';
  // url = 'http://qa.api.gems.gov.za';
  // url = 'http://qa.member.gems.local';
  selectedMember: Member;
  token: string;
  authenticationState = new BehaviorSubject(false);
  public user: Observable<any>;
  private userData = new BehaviorSubject(null);
  selectedPreLoginContent;

  // Simon Grimm
  public member: Observable<any>;
  private memberData = new BehaviorSubject(null);
  // Simon Grimm

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private platform: Platform,
    private router: Router,
    private httpNative: HTTP,
    public toastController: ToastController) {
    // Simon Grimm
      this.loadStoredToken();
    // Simon Grimm

  } 

  // Simon Grimm
  loadStoredToken() {
    let platformObs = from(this.platform.ready());
 
    this.member = platformObs.pipe(
      switchMap(() => {
        return from(this.storage.get('memberToken'));
      }),
      map(memberTokenData => {
        if (memberTokenData) {
          let tokenData:Member = JSON.parse(memberTokenData.data); 
          this.memberData.next(tokenData);
          return true;
        } else {
          return null;
        }
      })
    );
  }

  logMemberIn(username: string, password: string) {
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
      take(1),
      map(res => {
        return res;
      }),
      switchMap(memberTokenData => {
        let tokenData = memberTokenData;
        this.memberData.next(tokenData);
        let storageObs = from(this.storage.set('memberToken', tokenData));
        return storageObs;
      })
    );
  }

  getMember() {
    return this.memberData.getValue();
  }

  logMemberOut() {
    this.storage.remove('memberToken').then(() => {
      this.router.navigateByUrl('/');
      this.memberData.next(null);
    });
  }


  getMemberProfile(GUID, Token) {
    let req = this.httpNative.get(`${this.url}/api/v1/Members/${GUID}`,
    {},
    {
      'Authorization': `Bearer ${Token}`
    });
    return from(req);
  }

  getMemberActivity(GUID, Token, pageNumber = 1) {
    let req = this.httpNative.get(
      `${this.url}/api/v1/Members/${GUID}/activities?pageCount=5&pageNumber=${pageNumber}`,
      {},
      {
        'Authorization': `Bearer ${Token}`
      }
      );
    return from(req);
  }

  getMemberDayToDayBenefits(GUID, Token) {
    let req = this.httpNative.get(`${this.url}/api/v1/Members/${GUID}/daytodayBenefit/`,
    {},
    {
      'Authorization': `Bearer ${Token}`
    }
    );
    return from(req);
  }

  getAllDocuments(GUID, Token) {
    let req = this.httpNative.get(`${this.url}/api/v1/BenefitDocuments/GetAllDocuments/${GUID}`,
    {},
    {
      'Authorization': `Bearer ${Token}`
    }
    );
    return from(req);
  }

  // Download Documents: Tax and Member Certificates //
  getMemberCertificate(GUID, Token) {
    let req = this.httpNative.sendRequest(
      `${this.url}/api/v1/Members/${GUID}/memberCertificate/`,
      {
        method: 'get',
        headers: {
          'Authorization': `Bearer ${Token}`,
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

  getTaxCertificate(year, GUID, Token) {
    let req = this.httpNative.sendRequest(
      `${this.url}/api/v1/Members/${GUID}/taxCertificate/${year}`,
      {
        method: 'get',
        headers: {
          'Authorization': `Bearer ${Token}`,
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
  // Simon Grimm

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
      
      console.log(this.url);
    let req = this.httpNative.post(`${this.url}/token`,
    body,
    {
      "Content-Type": "application/x-www-form-urlencoded"
    });
    return from(req).pipe(
      // timeout(10000),
      retry(3)
    );
  }

  getRefferalOptions():Observable<any> {
    let req = this.httpNative.get(`${this.url}/api/v1/Auth/ReferralOptions`, {}, {});
    return from(req);
  }

  getProvinces():Observable<any> {
    let req = this.httpNative.get(`${this.url}/api/v1/generalPractitioner/GetProvinces`, {}, {});
    return from(req);
  }

  getCities(provinceID):Observable<any> {
    let req = this.httpNative.get(`${this.url}/api/v1/generalPractitioner/GetCities?provinceId=${provinceID}`, {}, {});
    return from(req);
  }

  getGeneralPractitioners(provinceID, cityID):Observable<any> {
    let req = this.httpNative.get(`${this.url}/api/v1/generalPractitioner/GetGeneralPractitioners?provinceId=${provinceID}&cityId=${cityID}`, {}, {});
    return from(req);
  }

  
  

  getOptionsForDropdowns():Observable<any> {
    let req = this.httpNative.get(`${this.url}/api/v1/formOptions/memberApplication/beneficiaryOptions`, {}, {});
    return from(req);
  }

  resetPassword(UserName, GEMSMemberNumber):Observable<any>{
    const body = {
      UserName: UserName,
      GEMSMemberNumber: GEMSMemberNumber
    }
    let req = this.httpNative.post(`${this.url}/api/v1/account/CheckUsernameExists`,
    body,
    {
      "Content-Type": "application/x-www-form-urlencoded"
    })
    return from(req);
  }
  

  retrieveUsername(MemberIDNumber){
    const body = {
      MemberIDNumber: MemberIDNumber
    }
    let req = this.httpNative.post(`${this.url}/api/v1/account/CheckUsernameExists`,
    body,
    {
      "Content-Type": "application/x-www-form-urlencoded"
    })
    return from(req);
  }
  
  
  register(registrationData: RegisterMember):Observable<any> {
    let req = this.httpNative.post(`${this.url}/api/otp/sen`,
    registrationData,
    {
      "Content-Type": "application/x-www-form-urlencoded"
    })
    return from(req);
  }

  submitOTP(otp: RegisterMemberResponse):Observable<any> {
    let req = this.httpNative.post(`${this.url}/api/otp/validate`,
    otp,
    {
      "Content-Type": "application/x-www-form-urlencoded"
    })
    return from(req);
  }

  reloadToken() {
    this.storage.get('member').then(res => {
      console.log(JSON.parse(res.data));
      const parsedData = JSON.parse(res.data);
      this.selectedMember = parsedData;
      console.log(this.selectedMember);
    });
  }

  getUser() {
    return this.userData.asObservable();
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

  getClaimsByDate(dateFrom, dateTill) {
    if (!this.selectedMember) { return }
    let req = this.httpNative.get(`${this.url}/api/v1/Members/${this.selectedMember.MemberGuid}/claims?dateFrom=${dateFrom}&dateTill=${dateTill}`,
    {},
    {
      'Authorization': `Bearer ${this.selectedMember.access_token}`
    }
    );
    return from(req).pipe(
      // timeout(10000000)
    );
  }

  submitClaim(DocName, DocURLUpload) {
    if (!this.selectedMember) { return }
    const body = {
      DocName,
      DocURLUpload
    };
    let req = this.httpNative.post(`${this.url}/api/v1/Members/${this.selectedMember.MemberGuid}/claims/submit/`,
    body,
    {
      'Authorization': `Bearer ${this.selectedMember.access_token}`
    });
    return from(req);
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

  startTrackerWithId(id) {
    gtag('config', id);
  }

  trackView(pageUrl: string, screenName: string) {}

  trackEvent(category, action, label?, value?) {}

  getAllWalkInCentres() {
    if (!this.selectedMember) { return }
    let req = this.httpNative.get(`${this.url}/api/v1/WalkInCentres/`,
    {},
    {
      'Authorization': `Bearer ${this.selectedMember.access_token}`
    }
    );
    return from(req).pipe(
      // timeout(10000000)
    );
  }

  requestNewCard(postalAddress) {
    if (!this.selectedMember) { return }
    let req = this.httpNative.put(`${this.url}/api/v1/Members/${this.selectedMember.MemberGuid}/requestNewCard/`,
    postalAddress,
    {
      'Authorization': `Bearer ${this.selectedMember.access_token}`
    }
    );
    return from(req).pipe(
      // timeout(10000)
    );
  }

  changeOption(option) {
    if (!this.selectedMember) { return }
    let req = this.httpNative.put(`${this.url}/api/v1/Members/${this.selectedMember.MemberGuid}/ChangeBenefitOption/${option}`,
    {},
    {
      'Authorization': `Bearer ${this.selectedMember.access_token}`
    }
    );
    return from(req).pipe(
      // timeout(10000)
    );
  }

  changeToEVOOption(option) {
    if (!this.selectedMember) { return }
    let req = this.httpNative.put(`${this.url}/api/v1/Members/${this.selectedMember.MemberGuid}/ChangeBenefitOption/${option}`,
    {},
    {
      'Authorization': `Bearer ${this.selectedMember.access_token}`
    }
    );
    return from(req).pipe(
      // timeout(10000)
    );
  }


  loadPreloginInformation() {
    return this.http.get('assets/json/pre-login.json')
  }

  

  

}
