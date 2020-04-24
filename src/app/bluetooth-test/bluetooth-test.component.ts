import { Component } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';

@Component({
  selector: 'ns-bluetooth-test',
  templateUrl: './bluetooth-test.component.html',
  styleUrls: ['./bluetooth-test.component.scss'],
})
export class BluetoothTestComponent {
  constructor(private readonly page: Page) {
    this.page.actionBarHidden = true;
  }
}
