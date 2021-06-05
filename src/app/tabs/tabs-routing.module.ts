import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../pages/home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../pages/profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: 'map',
        loadChildren: () => import('../pages/providers/providers.module').then(m => m.ProvidersPageModule)
      },
      {
        path: 'card',
        loadChildren: () => import('../pages/card/card.module').then(m => m.CardPageModule)
      },
      {
        path: 'contact',
        loadChildren: () => import('../pages/contact/contact.module').then(m => m.ContactPageModule)
      },
      {
        path: 'rewards',
        loadChildren: () => import('../pages/rewards/rewards.module').then(m => m.RewardsPageModule)
      },
      {
        path: 'claims',
        loadChildren: () => import('../pages/claims/claims.module').then(m => m.ClaimsPageModule)
      },
      {
        path: 'claims-landing',
        loadChildren: () => import('../pages/claims-landing/claims-landing.module').then(m => m.ClaimsLandingPageModule)
      },
      {
        path: 'claims-home',
        children: [
          {
            path: '',
            loadChildren: () => import('../pages/claims-home/claims-home.module').then(m => m.ClaimsHomePageModule)
          },
          {
            path: 'submit-claim',
            loadChildren: () => import('../pages/submit-claim/submit-claim.module').then(m => m.SubmitClaimPageModule)
          },
        ]   
      },
      {
        path: 'submit-claim',
        loadChildren: () => import('../pages/submit-claim/submit-claim.module').then(m => m.SubmitClaimPageModule)
      },
      {
        path: 'benefits',
        loadChildren: () => import('../pages/benefits/benefits.module').then(m => m.BenefitsPageModule)
      },
      {
        path: 'documents',
        loadChildren: () => import('../pages/documents/documents.module').then(m => m.DocumentsPageModule)
      },
      {
        path: 'request-card',
        loadChildren: () => import('../pages/request-card/request-card.module').then(m => m.RequestCardPageModule)
      },
      {
        path: 'option-change',
        children: [
          {
            path: '',
            loadChildren: () => import('../pages/option-change/option-change.module').then(m => m.OptionChangePageModule)
          },
          {
            path: ':option/:status',
            loadChildren: () => import('../pages/option-change/option-change.module').then(m => m.OptionChangePageModule)
          }
          
        ]
        
      },
      {
        path: '',
        redirectTo: '/tabs/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
