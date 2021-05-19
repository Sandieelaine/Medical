import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./auth/walkthrough/walkthrough.module').then( m => m.WalkthroughPageModule)
  },
  {
    path: 'onboard',
    loadChildren: () => import('./auth/onboard/onboard.module').then( m => m.OnboardPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'claims',
    loadChildren: () => import('./pages/card/card.module').then( m => m.CardPageModule)
  },
  {
    path: 'benefits',
    loadChildren: () => import('./pages/benefits/benefits.module').then( m => m.BenefitsPageModule)
  },
  {
    path: 'providers',
    loadChildren: () => import('./pages/providers/providers.module').then( m => m.ProvidersPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./auth/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'card',
    loadChildren: () => import('./pages/card/card.module').then( m => m.CardPageModule)
  },
  {
    path: 'rewards',
    loadChildren: () => import('./pages/rewards/rewards.module').then( m => m.RewardsPageModule)
  },
  {
    path: 'walkthrough',
    loadChildren: () => import('./auth/walkthrough/walkthrough.module').then( m => m.WalkthroughPageModule)
  },
  {
    path: 'fingerprint',
    loadChildren: () => import('./auth/fingerprint/fingerprint.module').then( m => m.FingerprintPageModule)
  },
  {
    path: 'onboard',
    loadChildren: () => import('./auth/onboard/onboard.module').then( m => m.OnboardPageModule)
  },
  {
    path: 'contact',
    loadChildren: () => import('./pages/contact/contact.module').then( m => m.ContactPageModule)
  },
  {
    path: 'bot',
    loadChildren: () => import('./pages/bot/bot.module').then( m => m.BotPageModule)
  },
  {
    path: 'documents',
    loadChildren: () => import('./pages/documents/documents.module').then( m => m.DocumentsPageModule)
  },
  {
    path: 'information',
    loadChildren: () => import('./auth/information/information.module').then( m => m.InformationPageModule)
  },
  {
    path: 'welcome',
    loadChildren: () => import('./auth/welcome/welcome.module').then( m => m.WelcomePageModule)
  },
  {
    path: 'pre-login',
    loadChildren: () => import('./pages/pre-login/pre-login.module').then( m => m.PreLoginPageModule)
  },
  {
    path: 'option',
    loadChildren: () => import('./pages/pre-login/option/option-routing.module').then( m => m.OptionPageRoutingModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./auth/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'pre-home',
    loadChildren: () => import('./pages/pre-home/pre-home.module').then( m => m.PreHomePageModule)
  },
  {
    path: 'claims-landing',
    loadChildren: () => import('./pages/claims-landing/claims-landing.module').then( m => m.ClaimsLandingPageModule)
  },
  {
    path: 'centres',
    loadChildren: () => import('./pages/centres/centres.module').then( m => m.CentresPageModule)
  },
  {
    path: 'submit-claim',
    loadChildren: () => import('./pages/submit-claim/submit-claim.module').then( m => m.SubmitClaimPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
