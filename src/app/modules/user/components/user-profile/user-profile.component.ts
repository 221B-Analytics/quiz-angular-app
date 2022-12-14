import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { AuthService, SnackbarService, UserService } from 'src/app/core/services';
import { StateService } from 'src/app/shared/services/states.service';
import { DistrictService } from 'src/app/shared/services/districts.service';
import { SchoolService } from 'src/app/shared/services/schools.service';
import { TopicService } from 'src/app/shared/services/topic.service';

import { User, Response } from 'src/app/core/models';
import { State } from 'src/app/shared/models/state.model';
import { District } from 'src/app/shared/models/district.model';
import { School } from 'src/app/shared/models/school.model';
import { Topic } from 'src/app/shared/models/topic.model';

import { ProfilePictureComponent } from 'src/app/modules/user/components/profile-picture/profile-picture.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  userInfo!: User;
  userName!: string;
  userInitialName!: string;
  role!: any;
  ROLES = User.roles;
  userForm!: FormGroup;
  topics$!: Topic[];

  roles = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Mentor' },
    { id: 3, name: 'Seeker' }
  ];

  isMentor!: boolean;
  states$!: State[];
  districts$!: District[];
  schools$!: School[];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private stateService: StateService,
    private districtService: DistrictService,
    private schoolService: SchoolService,
    private topicService: TopicService,
    private snackBar: SnackbarService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo')!);
    // this.userName = `${this.userInfo!.name!.firstName} ${this.userInfo!.name!.lastName}`;
    // this.role = this.roles.find((e) => e.id === this.userInfo.role);
    this.isMentor = this.authService.isMentor();
  }

  ngOnInit(): void {
    this.getUserById();
    this.initializeForm();
    this.getTopics();
    this.getStates();
  }

  getUserById() {
    this.userService.getUserById(this.userInfo._id!).subscribe((res: Response) => {
      this.userInfo = res?.data;
      this.userName = `${this.userInfo!.name!.firstName} ${this.userInfo!.name!.lastName}`;
      this.userInitialName = this.userInfo!.name!.firstName.charAt(0) + this.userInfo!.name!.lastName.charAt(0);
      this.role = this.roles.find((e) => e.id === this.userInfo.role);
      this.initializeForm();
      if (this.userInfo.role === this.ROLES.MENTOR) {
        this.userForm.controls['topics'].setValidators(Validators.required);
      }
    });
  }

  initializeForm() {
    this.userForm = new FormGroup({
      _id: new FormControl(this.userInfo._id),
      name: this.formBuilder.group({
        firstName: [this.userInfo.name?.firstName, Validators.required],
        lastName: [this.userInfo.name?.lastName, Validators.required]
      }),
      email: new FormControl(this.userInfo.email, Validators.required),
      mobileNumber: new FormControl(this.userInfo.mobileNumber),
      age: new FormControl(this.userInfo.age),
      profilePicDetails: new FormControl(this.userInfo.profilePicDetails),
      topics: new FormControl(this.userInfo.topics),
      // state: new FormControl(this.userInfo.state),
      // district: new FormControl(this.userInfo.district),
      // school: new FormControl(this.userInfo.school)
    });

    this.userForm.controls['email'].disable();
    // if (this.userForm.value.state) {
    //   this.getDistrictByStateId();
    // }

    // if (this.userForm.value.district) {
    //   this.getSchoolByDistrictId();
    // }
  }

  getTopics() {
    this.topicService.getTopics().subscribe((res: Response) => {
      this.topics$ = res?.data;
    });
  }

  getStates() {
    this.stateService.getStates().subscribe((res: Response) => {
      this.states$ = res?.data;
    });
  }

  handleStateSelection(event: any) {
    this.getDistrictByStateId();
  }

  getDistrictByStateId() {
    this.districtService.getDistrictByStateId(this.userForm.value.state).subscribe((res: Response) => {
      this.districts$ = res?.data;
    });
  }

  handleDistrictSelection(event: any) {
    this.getSchoolByDistrictId();
  }

  getSchoolByDistrictId() {
    this.schoolService.getSchoolByDistrictId(this.userForm.value.district).subscribe((res: Response) => {
      this.schools$ = res?.data;
    });
  }

  handleUploadImage() {
    const dialogRef = this.dialog.open(ProfilePictureComponent, {
      height: '55%',
      width: '60%',
      data: {
        user: this.userInfo
      },
      restoreFocus: false
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getUserById();
    });
  }

  handleUpdateProfile() {
    try {
      let objUser = Object.assign({}, this.userForm.value);
      objUser.isProfileCompleted = true;

      this.userService.updateUser(objUser).subscribe((res: Response) => {
        this.snackBar.openSnackBar(res?.message!, 'Close', 'green-snackbar');
        this.router.navigate(['/dashboard']);
      });
    } catch (error: any) {
      this.snackBar.openSnackBar(error, 'Close', 'red-snackbar');
    }
  }

}
