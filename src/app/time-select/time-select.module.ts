import { NgModule } from '@angular/core';
import { TimeSelectComponent } from './time-select.component';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { TimeSelectRoutingModule } from 'app/time-select/time-select-routing.module';

@NgModule({
  declarations: [TimeSelectComponent],
  imports: [NativeScriptCommonModule, TimeSelectRoutingModule],
})
export class TimeSelectModule {}
