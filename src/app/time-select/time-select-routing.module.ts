import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { TimeSelectComponent } from 'app/time-select/time-select.component';

const routes: Routes = [{ path: '', component: TimeSelectComponent }];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule],
})
export class TimeSelectRoutingModule {}
