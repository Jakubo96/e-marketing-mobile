import { NgModule } from '@angular/core';
import { TimeSelectComponent } from './time-select.component';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { TimeSelectRoutingModule } from 'app/time-select/time-select-routing.module';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [TimeSelectComponent],
  imports: [
    NativeScriptCommonModule,
    TimeSelectRoutingModule,
    ReactiveFormsModule,
    NativeScriptFormsModule,
  ],
})
export class TimeSelectModule {}
