import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';
import { Bluetooth } from 'nativescript-bluetooth';

@Component({
  selector: 'ns-bluetooth-test',
  templateUrl: './bluetooth-test.component.html',
  styleUrls: ['./bluetooth-test.component.scss'],
})
export class BluetoothTestComponent implements OnInit {
  private readonly bluetooth = new Bluetooth();
  public scanning = false;

  constructor(private readonly page: Page) {
    this.page.actionBarHidden = true;
    this.bluetooth.debug = true;
  }

  public ngOnInit(): void {
    this.scanBluetooth();
  }

  private async scanBluetooth(): Promise<void> {
    const enabled = await this.bluetooth.enable();

    if (enabled) {
      // eslint-disable-next-line no-console
      console.log('Scanning started');
      this.scanning = true;
      await this.bluetooth.startScanning({
        seconds: 4,
        onDiscovered: (peripheral) => {
          // eslint-disable-next-line no-console
          console.log('Periperhal found with UUID: ' + peripheral.UUID);
        },
      });
      // eslint-disable-next-line no-console
      console.log('Scanning complete');
      this.scanning = false;
    } else {
      // eslint-disable-next-line no-console
      console.log('Bluetooth not enabled');
    }
  }
}
