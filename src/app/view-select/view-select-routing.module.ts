import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { ViewSelectComponent } from 'app/view-select/view-select.component';

const routes: Routes = [{ path: '', component: ViewSelectComponent }];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule],
})
export class ViewSelectRoutingModule {}
