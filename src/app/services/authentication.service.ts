import { RewardsPage } from './../pages/rewards/rewards.page';
import { ClaimsHistory } from './../models/claim.model';
import { AlertController, Platform, ToastController } from '@ionic/angular';
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
import * as moment from 'moment';
import {Idle, DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';
import {Keepalive} from '@ng-idle/keepalive';
import { HelpersService } from './helpers.service';
import { ModalController } from '@ionic/angular';

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
  selectedNewsPost;
  token: string;
  authenticationState = new BehaviorSubject(false);
  public user: Observable<any>;
  private userData = new BehaviorSubject(null);
  public timeLeftBeforeAppCloses = new BehaviorSubject(null);
  selectedPreLoginContent;

  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;
  secondsLeft = 1;
  idleTimer:HTMLIonAlertElement;
  count = 25;

  loggedInMember;

  // Simon Grimm
  public member: Observable<any>;
  public memberData = new BehaviorSubject(null);
  // Simon Grimm

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private platform: Platform,
    private router: Router,
    private httpNative: HTTP,
    public toastController: ToastController,
    private idle: Idle, private keepalive: Keepalive,
    private alertCtrl: AlertController,
    private helper: HelpersService,
    public modalController: ModalController
    ) {
    // Simon Grimm
      this.loadStoredToken();
      
      
    // Simon Grimm

  } 

  

  // Simon Grimm
  loadStoredToken() {
    if (this.memberData.getValue() === null || undefined) {}
    let platformObs = from(this.platform.ready());
 
    this.member = platformObs.pipe(
      switchMap(() => {
        return from(this.storage.get('memberToken'));
      }),
      map(memberTokenData => {
        if (memberTokenData) {
          let tokenData:Member = JSON.parse(memberTokenData.data);
          if (moment(tokenData['.expires']).isBefore(moment())) {
            this.logMemberOut();
            return null;
          }
          this.setIdleTimeout();
          this.memberData.next(tokenData);
          return true;
        } else {
          return null;
        }
      })
    );
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: RewardsPage,
      cssClass: 'gems-modal'
    });
    return await modal.present();
  }


setIdleTimeout() {
  // sets an idle timeout of 5 seconds, for testing purposes.
  this.idle.setIdle(600);
  // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
  this.idle.setTimeout(30);
  // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
  this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

  this.idle.onIdleEnd.subscribe(() => this.idleState = 'No longer idle.');
  this.idle.onTimeout.subscribe(() => {

    this.idleState = 'Timed out!';
    this.timedOut = true;
    this.idle.stop();
    this.logMemberOut();
    this.modalController.getTop().then(res => {
      res.dismiss();
      this.modalController.getTop().then(res => {
        res.dismiss();
      })
    })
  });
  this.idle.onIdleStart.subscribe(() => {
    this.idleState = 'You\'ve gone idle!';
    this.presentModal();
  });
  this.idle.onTimeoutWarning.subscribe((countdown) => {
    if(countdown === 25) {
      // this.showAlert(this.secondsLeft);
      
    }
    this.secondsLeft = countdown;
    //this.secondsLeft = countdown;
    this.idleState = 'You will time out in ' + countdown + ' seconds!';
    this.timeLeftBeforeAppCloses.next(countdown);
    console.log('You will time out in ' + countdown + ' seconds!')
  });

  // sets the ping interval to 15 seconds
  this.keepalive.interval(15);

  this.keepalive.onPing.subscribe(() => this.lastPing = new Date());

  this.reset();
}

countDown() {
  setTimeout(() => {
    this.count--;
    console.log(this.count);
    if (this.count > 0) {
      this.countDown();
    } else {
      // this.api.modal.dismiss();
    }
  }, 1000);
}

async showAlert(seconds) {
    this.countDown();
    console.log(this.count);
    this.idleTimer = await this.alertCtrl.create({
      header: `Important Notice ${this.count}`,
      subHeader: `You will be automatically logged out after 25 seconds`,
      buttons: [
        {
          text: 'Continue',
          handler: () => {
            this.reset();
          }
        }
      ]
    });
    await this.idleTimer.present();
}

reset() {
  this.idle.watch();
  this.idleState = 'Started.';
  this.timedOut = false;
}

stopAndStartAllOver() {
  this.idle.stop();
  this.setIdleTimeout();
}

  logMemberIn(username: string, password: string) {
    const body = {
      grant_type: 'password',
      username,
      password,
      platform: 'Member App'
    };
    let req = this.httpNative.post(`${this.url}/token`,
    body,
    {
      "Content-Type": "application/x-www-form-urlencoded"
    });
    return from(req).pipe(
      take(1),
      tap((res) => {
        console.log(res, 'tap');
        // if(!("key" in obj))
        // Get member profile and then check if the user has a member number. If not, log them out
      }),
      map(res => {
        // this.memberData.next(JSON.parse(res.data));
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

  async logMemberOut() {
    await this.storage.remove('memberToken');
    await this.memberData.next(null);
    await this.idle.stop();
    await this.router.navigateByUrl('/login', {replaceUrl: true});  
  }


  getMemberProfile(GUID, Token) {
    let req = this.httpNative.get(`${this.url}/api/v1/Members/${GUID}`,
    {},
    {
      'Authorization': `Bearer ${Token}`
    });
    return from(req);
  }

  getMemberActivity(GUID, Token, pageNumber) {
    let req = this.httpNative.get(
      `${this.url}/api/v1/Members/${GUID}/activities?pageCount=10&pageNumber=${pageNumber}`,
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

  //********************* Download Documents: Tax and Member Certificates *********************//
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

  //*************************************  Claims ***********************************//
  getClaimsHistory(GUID, Token) {
    let req = this.httpNative.get(`${this.url}/api/v1/Members/${GUID}/MemberClaims/`,
    {},
    {
      'Authorization': `Bearer ${Token}`
    }
    );
    return from(req).pipe(
      // timeout(10000)
    );
  }



  getClaimStatement(statementID, GUID, Token) {
    let req = this.httpNative.sendRequest(
      `${this.url}/api/v1/Members/${GUID}/claimStatements/${statementID}`,
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

  getClaims(GUID, Token) {
    let req = this.httpNative.get(`${this.url}/api/v1/Members/${GUID}/claimStatements/`,
    {},
    {
      'Authorization': `Bearer ${Token}`
    }
    );
    return from(req);
  }

  

  getClaimsByDate(dateFrom, dateTill, GUID, Token) {
    let req = this.httpNative.get(`${this.url}/api/v1/Members/${GUID}/claims?dateFrom=${dateFrom}&dateTill=${dateTill}`,
    {},
    {
      'Authorization': `Bearer ${Token}`
    }
    );
    return from(req).pipe(
      // timeout(10000000)
    );
  }

  getClaimByReferenceNumber(referenceNumber, GUID, Token) {
    let req = this.httpNative.get(`${this.url}/api/v1/Members/${GUID}/claims/${referenceNumber}`,
    {},
    {
      'Authorization': `Bearer ${Token}`
    }
    );
    return from(req);
  }

  submitClaim(DocName, DocURLUpload, GUID, Token) {
    const body = {
      DocName,
      DocURLUpload
    };
    let req = this.httpNative.post(`${this.url}/api/v1/Members/${GUID}/claims/submit/`,
    body,
    {
      'Authorization': `Bearer ${Token}`
    });
    return from(req);
  }
  //*************************************  End Claims ***********************************//

  // ************************************  Benefits *******************************//
  getBenefits(GUID, Token) {
    let req = this.httpNative.get(`${this.url}/api/v1/Members/${GUID}/benefitUsage/`,
    {},
    {
      'Authorization': `Bearer ${Token}`
    }
    );
    return from(req);
  }
  // ************************************  End Benefits *******************************//

  // ************************************  Authorisations *******************************//
  getAuthorisations(GUID, Token) {
    let req = this.httpNative.get(`${this.url}/api/v1/Members/${GUID}/authorisations?pageCount=10&pageNumber=1`,
    {},
    {
      'Authorization': `Bearer ${Token}`
    }
    );
    return from(req);
  }
  // ************************************  End Authorisations *******************************//
  
  // ************************************  Request New Card *******************************//
  requestNewCard(postalAddress, GUID, Token) {
    let req = this.httpNative.put(`${this.url}/api/v1/Members/${GUID}/requestNewCard/`,
    postalAddress,
    {
      'Authorization': `Bearer ${Token}`
    }
    );
    return from(req).pipe(
      // timeout(10000)
    );
  }

  



  // ************************************  Request New Card *******************************//

  // ************************************  Update Chronic Medicine Delivery Address *******************************//
  updateChronicMedicationDeliveryAddress(GUID, Token, payload) {
    let req = this.httpNative.put(`${this.url}/api/v1/Members/${GUID}/Authorisations/UpdateAddress/`,
    payload,
    {
      'Authorization': `Bearer ${Token}`
    }
    );
    return from(req);
  }
  // ************************************  Update Chronic Medicine Delivery Address  *******************************//


  // ************************************  Change Option *******************************//

  changeOption(option, GUID, Token) {
    let req = this.httpNative.put(`${this.url}/api/v1/Members/${GUID}/ChangeBenefitOption/${option}`,
    {},
    {
      'Authorization': `Bearer ${Token}`
    }
    );
    return from(req).pipe(
      // timeout(10000)
    );
  }

  changeToEVOOption(payload, option, GUID, Token) {
    this.httpNative.setDataSerializer("json");
    let req = this.httpNative.put(`${this.url}/api/v1/Members/${GUID}/${option}`,
    payload,
    {
      "Authorization": `Bearer ${Token}`,
      "Content-Type": "application/json"
    }
    );
    return from(req);
  }

  // ************************************  Change Option *******************************//

  getAllWalkInCentres(Token) {
    let req = this.httpNative.get(`${this.url}/api/v1/WalkInCentres/`,
    {},
    {
      'Authorization': `Bearer ${Token}`
    }
    );
    return from(req).pipe(
      // timeout(10000000)
    );
  }

  getAllWalkInCentreOptions(Token) {
    let req = this.httpNative.get(`${this.url}/api/v1/WalkInCentreOptions/`,
    {},
    {
      'Authorization': `Bearer ${Token}`
    }
    );
    return from(req).pipe(
      // timeout(10000000)
    );
  }

  // ************************************ End  New Code ************************************* //

  // ************************************ Authentication ************************************ //

  sendOTP(registrationData: RegisterMember) {
    let req = this.httpNative.post(`${this.url}/api/otp/send`,
    registrationData,
    {
      // "Content-Type": "application/x-www-form-urlencoded"
    })
    return from(req);
  }

  register(registrationData: RegisterMember) {
    this.httpNative.setDataSerializer("json");
    let req = this.httpNative.post(`${this.url}/api/v1/Auth/Register`,
    registrationData,
    {
      "Content-Type": "application/json"
    })
    return from(req);
  }

  submitOTP(otp: RegisterMemberResponse){
    let req = this.httpNative.post(`${this.url}/api/otp/validate`,
    otp,
    {
      // "Content-Type": "application/x-www-form-urlencoded"
    })
    return from(req);
  }

  updatePassword(payload: any) {
    let req = this.httpNative.post(`${this.url}/api/v1/account/ChangePassword`,
    payload,
    {
      // "Content-Type": "application/x-www-form-urlencoded"
    })
    return from(req);
 }

 ChangeUsername(payload: any): Observable<any> {
  let req = this.httpNative.post(`${this.url}/api/v1/account/ChangeUsername`,
  payload,
  {
    // "Content-Type": "application/x-www-form-urlencoded"
  })
  return from(req);
}

  checkUsernameExistsChangeUsername(payload: any) {
    const body = {
        MemberIDNumber: payload.MemberIDNumber,
        UserName: payload.UserName
    };

    let req = this.httpNative.post(`${this.url}/api/v1/account/CheckUsernameExists`,
    body,
    {
      // "Content-Type": "application/x-www-form-urlencoded"
    })
    return from(req);
}

  genericRequestOTP(payload: any) {
    let req = this.httpNative.post(`${this.url}/api/otp/send`,
    payload,
    {
      // "Content-Type": "application/x-www-form-urlencoded"
    })
    return from(req);
  }

  CheckUsernameExists(payload: { UserName: any; GEMSMemberNumber: any; }) {
    const body = {
      UserName: payload.UserName,
      GEMSMemberNumber: payload.GEMSMemberNumber
    };
    let req = this.httpNative.post(`${this.url}/api/v1/account/CheckUsernameExists`,
    body,
    {
      "Content-Type": "application/x-www-form-urlencoded"
    })
    return from(req);
  }
 
  changePassword(payload: any) {
      let req = this.httpNative.post(`${this.url}/api/v1/account/ChangePassword`,
      payload,
      {
        "Content-Type": "application/x-www-form-urlencoded"
      })
    return from(req);
  }

  checkUsernameExistsRetrieveUsername(payload: { MemberIDNumber: any; }) {
    const body = {
      MemberIDNumber: payload.MemberIDNumber
    };
    let req = this.httpNative.post(`${this.url}/api/v1/account/CheckUsernameExists`,
      body,
      {
        "Content-Type": "application/x-www-form-urlencoded"
      })
    return from(req);
  }

  getUsername(payload: { MemberIDNumber: any; }) {
    const body = {
      MemberIDNumber: payload.MemberIDNumber
    };
    let req = this.httpNative.post(`${this.url}/api/v1/account/GetUsername`,
      body,
      {
        "Content-Type": "application/x-www-form-urlencoded"
      })
    return from(req);
  }

  // ************************************ End Authentication ************************************ //

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
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
        password,
        platform: 'Member App'
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

  

  loadPreloginInformation() {
    return this.http.get('assets/json/pre-login.json')
  }

  loadNews(): Observable<any[]> {
    return this.http.get<any[]>('assets/json/news.json')
  }


  //**************************** Update Member Information **************************/
  getMemberContactInformation(GUID, Token){
    let req = this.httpNative.get(`${this.url}/api/v1/Members/ContactInfo/${GUID}/`,
    {},
    {
      'Authorization': `Bearer ${Token}`,
    }
    );
    return from(req);
  }

  getMemberEmergencyContactInfo(GUID, Token){
    let req = this.httpNative.get(`${this.url}/api/v1/Members/EmergencyContactInfo/${GUID}/`,
    {},
    {
      'Authorization': `Bearer ${Token}`,
    }
    );
    return from(req);
  }


  updateMemberInformation(payload, GUID, Token) {
    let req = this.httpNative.put(`${this.url}/api/v1/Members/${GUID}`,
    payload,
    {
      'Authorization': `Bearer ${Token}`
    }
    );
    return from(req);
  }

  updateMemberContactInformation(payload, GUID, Token) {
    let req = this.httpNative.put(`${this.url}/api/v1/Members/ContactInfo/${GUID}`,
    payload,
    {
      'Authorization': `Bearer ${Token}`
    }
    );
    return from(req);
  }

  updateMemberEmergencyContactInfo(payload, GUID, Token) {
    let req = this.httpNative.put(`${this.url}/api/v1/Members/EmergencyContactInfo/${GUID}`,
    payload,
    {
      'Authorization': `Bearer ${Token}`
    }
    );
    return from(req);
  }

  updateMemberCommunicationPreferences(payload, GUID, Token) {
    let req = this.httpNative.put(`${this.url}/api/v1/Members/${GUID}/UpdateMemberCommunicationPreferences`,
    payload,
    {
      'Authorization': `Bearer ${Token}`
    }
    );
    return from(req);
  }

  removeDependant(payload, GUID, Token) {
    let req = this.httpNative.put(`${this.url}/api/v1/Members/${GUID}/removeDependant`,
    payload,
    {
      'Authorization': `Bearer ${Token}`
    }
    );
    return from(req);
  }

  getBeneficiaryOptions(): Observable<any> {
    let req = this.httpNative.get(`${this.url}/api/v1/formOptions/memberApplication/beneficiaryOptions`,
    {},
    {}
    );
    return from(req);
  }

  requestAuthorisation(payload, GUID, Token) {
    let req = this.httpNative.post(`${this.url}/api/v1/Members/${GUID}/Authorisations/RequestAuthorisation`,
    payload,
    {
      'Authorization': `Bearer ${Token}`
    }
    );
    return from(req);
  }

  getContactOptions(): Observable<any> {
    let req = this.httpNative.get(`${this.url}/api/v1/contactus`,
    {},
    {}
    );
    return from(req);
  }

  getSuggestionsImprovementsCategories(): Observable<any> {
    let req = this.httpNative.get(`${this.url}/api/v1/suggestionsImprovementsCategories`,
    {},
    {}
    );
    return from(req);
  }

  submitSuggestionsOrImprovements(payload, GUID, Token) {
    this.httpNative.setDataSerializer("json");
    let req = this.httpNative.put(`${this.url}/api/v1/Members/${GUID}/suggestionsOrImprovements`,
    payload,
    {
      'Authorization': `Bearer ${Token}`,
      "Content-Type": "application/json"
    }
    );
    return from(req);
  }      

  

  submitSurveyFeedback(payload, GUID, Token) {
    let req = this.httpNative.put(`${this.url}/api/v1/Members/${GUID}/satisfactionSurveyMemberFeedBack`,
    payload,
    {
      'Authorization': `Bearer ${Token}`
    }
    );
    return from(req);
  }

  submitSatisfactionSurveyNewEnrollment(payload, GUID, Token) {
    let req = this.httpNative.put(`${this.url}/api/v1/Members/${GUID}/satisfactionSurveyNewEnrollment`,
    payload,
    {
      'Authorization': `Bearer ${Token}`
    }
    );
    return from(req);
  }

  submitSatisfactionSurveyChangeAndAmendments(payload, GUID, Token) {
    let req = this.httpNative.put(`${this.url}/api/v1/Members/${GUID}/satisfactionSurveyChangeAndAmendments`,
    payload,
    {
      'Authorization': `Bearer ${Token}`
    }
    );
    return from(req);
  }

  submitSatisfactionSurveyClaims(payload, GUID, Token) {
    let req = this.httpNative.put(`${this.url}/api/v1/Members/${GUID}/satisfactionSurveyChangeAndAmendments`,
    payload,
    {
      'Authorization': `Bearer ${Token}`
    }
    );
    return from(req);
  }

  submitSatisfactionSurveyWalkInCentre(payload, GUID, Token) {
    let req = this.httpNative.put(`${this.url}/api/v1/Members/${GUID}/satisfactionSurveyWalkInCentre`,
    payload,
    {
      'Authorization': `Bearer ${Token}`
    }
    );
    return from(req);
  }

  submitSatisfactionSurveyCommunication(payload, GUID, Token) {
    let req = this.httpNative.put(`${this.url}/api/v1/Members/${GUID}/satisfactionSurveyCommunication`,
    payload,
    {
      'Authorization': `Bearer ${Token}`
    }
    );
    return from(req);
  }

  submitSatisfactionSurveyCallCentre(payload, GUID, Token) {
    let req = this.httpNative.put(`${this.url}/api/v1/Members/${GUID}/satisfactionSurveyCallCentre`,
    payload,
    {
      'Authorization': `Bearer ${Token}`
    }
    );
    return from(req);
  }


  updateMemberImage(payload, GUID, Token) {
    let req = this.httpNative.post(`${this.url}/api/v1/MemberImage/UploadImage/${GUID}`,
    payload,
    {
      'Authorization': `Bearer ${Token}`
    });
    return from(req);
  }

  updateMemberPersonalInfo(payload, GUID, Token) {
    let req = this.httpNative.put(`${this.url}/api/v1/Members/${GUID}`,
    payload,
    {
      'Authorization': `Bearer ${Token}`
    }
    );
    return from(req);
  }


  getMemberCommunicationPreferences(GUID, Token) {
    let req = this.httpNative.get(`${this.url}/api/v1/Members/${GUID}/CommunicationPreferences/`,
    {},
    {
      'Authorization': `Bearer ${Token}`
    });
    return from(req);
  }

  getStandardCommunicationPreferences(Token) {
    let req = this.httpNative.get(`${this.url}/api/v1/GetCommumicationPreferenceOptions/`,
    {},
    {
      'Authorization': `Bearer ${Token}`
    });
    return from(req);
  }

  

}
