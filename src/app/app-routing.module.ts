import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from 'nativescript-angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/view-select', pathMatch: 'full' },
  {
    path: 'view-select',
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    loadChildren: () =>
      import('app/view-select/view-select.module').then(
        (m) => m.ViewSelectModule
      ),
  },
  {
    path: 'bluetooth-scan',
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    loadChildren: () =>
      import('app/bluetooth-scan/bluetooth-scan.module').then(
        (m) => m.BluetoothScanModule
      ),
  },
];

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}
