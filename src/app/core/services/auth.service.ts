import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, ReplaySubject } from 'rxjs';

import { AppConfigService } from './app-config.service';
import { UserService, SnackbarService } from 'src/app/core/services';

import { User } from 'src/app/core/models/user.model';
import { Response } from 'src/app/core/models/response.model';

@Injectable()
export class AuthService {

  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  ROLES = User.roles;

  get isLoggedIn() {
    if (sessionStorage.getItem('userInfo')) {
      this.loggedIn.next(true);
    } else {
      this.loggedIn.next(false);
    }
    return this.loggedIn.asObservable();
  }

  constructor(
    private router: Router,
    private appConfigService: AppConfigService,
    private userService: UserService,
    private snackBar: SnackbarService
  ) { }

  // get showUserInfo() {
  //   return this.userInfoSource.asObservable();
  // }

  authUser(objLogin: any) {
    if (objLogin.user_name !== '' && objLogin.password !== '') {
      this.loggedIn.next(true);
      this.appConfigService.setSessionObj('userInfo', objLogin);
      this.login(objLogin);
    }
  }

  isAdminUser() {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo')!);
    const isAdmin = this.ROLES.ADMIN === userInfo.role; // Role id 0 is for admin
    return isAdmin;
  }

  isMentor() {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo')!);
    const isMentor = this.ROLES.MENTOR === userInfo.role;
    return isMentor;
  }

  getUserName() {
    let data = this.appConfigService.getSessionObj('userInfo');
    let userName: string = '';
    if (data) {
      userName = data.name.firstName + ' ' + data.name.lastName;
    }
    return userName;
  }

  getUserInfo() {
    if (sessionStorage.getItem('userInfo')) {
      return JSON.parse(sessionStorage.getItem('userInfo') || '');
    } else {
      return false;
    }
  }

  login(user: any) {
    if (user) {
      this.userService.authenticate(user).subscribe((res: Response) => {
        let userInfo = res?.data;
        if (userInfo && res.data._id >= 0) {
          this.processUser(userInfo);
        } else {
          this.snackBar.openSnackBar(res?.message || 'Error occured', 'Close', 'error-snackbar');
        }
      });
    } else {
      this.logout();
    }
  }

  // userLoggedIn(user: any) {
  //   this.userInfoSource.next(user)
  // }

  // private selectUserInfoSource: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  // selectedUser = this.selectUserInfoSource.asObservable();
  // informUserSelected(user: User){
  //   this.selectUserInfoSource.next(user);
  // }

  processUser(userInfo: any) {
    this.appConfigService.setSessionObj('userInfo', userInfo); // Store user info in session
    this.loggedIn.next(true);
    // this.userLoggedIn(userInfo);
    if (this.isAdminUser()) {
      this.router.navigate(['user/user-verification']);  
    } else {
      this.router.navigate(['dashboard']);
    }
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }
}
