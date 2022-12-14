import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonalityTestRoutingModule } from './personality-test-routing.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';

import { PersonalityTestComponent } from './components/personality-test/personality-test.component';
import { PersonalityTestResultComponent } from './components/personality-test-result/personality-test-result.component';

@NgModule({
  declarations: [
    PersonalityTestComponent,
    PersonalityTestResultComponent
  ],
  imports: [
    CommonModule,
    PersonalityTestRoutingModule,
    SharedModule
  ]
})
export class PersonalityTestModule { }
