import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { BluetoothScanComponent } from 'app/bluetooth-scan/bluetooth-scan.component';

const routes: Routes = [{ path: '', component: BluetoothScanComponent }];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule],
})
export class BluetoothScanRoutingModule {}
