import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { ViewSelectRoutingModule } from 'app/view-select/view-select-routing.module';
import { ViewSelectComponent } from 'app/view-select/view-select.component';

@NgModule({
  imports: [NativeScriptCommonModule, ViewSelectRoutingModule],
  declarations: [ViewSelectComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class ViewSelectModule {}
