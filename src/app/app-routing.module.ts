import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards';

import { LoginComponent } from './modules/login/components/login/login.component';
import { RegisterUserComponent } from './modules/login/components/register-user/register-user.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register-user', component: RegisterUserComponent },
  { path: 'dashboard', loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuard] },
  { path: 'user', loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule), canActivate: [AuthGuard] },
  { path: 'notification', loadChildren: () => import('./modules/notification/notification.module').then(m => m.NotificationModule), canActivate: [AuthGuard] },
  { path: 'mentor', loadChildren: () => import('./modules/mentor/mentor.module').then(m => m.MentorModule), canActivate: [AuthGuard] },
  { path: 'topic', loadChildren: () => import('./modules/topic/topic.module').then(m => m.TopicModule), canActivate: [AuthGuard] },
  { path: 'communication', loadChildren: () => import('./modules/communication/communication.module').then(m => m.CommunicationModule), canActivate: [AuthGuard] },
  { path: 'contact-us', loadChildren: () => import('./modules/contact-us/contact-us.module').then(m => m.ContactUsModule), canActivate: [AuthGuard] },
  { path: 'about-us', loadChildren: () => import('./modules/about-us/about-us.module').then(m => m.AboutUsModule), canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'error', loadChildren: () => import('./modules/error/error.module').then(m => m.ErrorModule) },
  // { path: '**', loadChildren: () => import('./modules/error/error.module').then(m => m.ErrorModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
