import {
  Component,
  EventEmitter,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';
import { isAndroid } from 'tns-core-modules/platform';
import { Bluetooth } from 'nativescript-bluetooth';
import * as applicationModule from 'tns-core-modules/application';
import { requestPermission } from 'nativescript-permissions';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { HttpWrapperService } from 'app/http-wrapper.service';
import { mergeMapTo, share } from 'rxjs/internal/operators';
import { defer, Observable } from 'rxjs';
import { SnackBar } from '@nstudio/nativescript-snackbar';
import { RouterExtensions } from 'nativescript-angular/router';
import { ListViewEventData } from 'nativescript-ui-listview';
import BluetoothDevice = android.bluetooth.BluetoothDevice;
import BluetoothAdapter = android.bluetooth.BluetoothAdapter;
import IntentFilter = android.content.IntentFilter;
import Intent = android.content.Intent;
import BroadcastReceiver = android.content.BroadcastReceiver;
import Context = android.content.Context;
import { DeviceIdentifier } from 'app/bluetooth-scan/device-identifier';
import { flatMap } from 'rxjs/operators';

@AutoUnsubscribe()
@Component({
  selector: 'ns-bluetooth-scan',
  templateUrl: './bluetooth-scan.component.html',
  styleUrls: ['./bluetooth-scan.component.scss'],
})
export class BluetoothScanComponent implements OnInit, OnDestroy {
  private readonly bluetooth = new Bluetooth();
  private readonly btAdapter = BluetoothAdapter.getDefaultAdapter();
  private readonly receiver = new CustomReceiver();
  private readonly snackbar = new SnackBar();
  public detectedDevices: DeviceIdentifier[] = [];

  public scanning = false;

  constructor(
    page: Page,
    private readonly zone: NgZone,
    private readonly httpWrapper: HttpWrapperService,
    private readonly router: RouterExtensions
  ) {
    page.actionBarHidden = true;
  }

  public ngOnInit(): void {
    this.scanBluetooth();
  }

  public ngOnDestroy(): void {
    if (this.scanning) {
      this.btAdapter.cancelDiscovery();
    }
    applicationModule.android.foregroundActivity.unregisterReceiver(
      this.receiver
    );
  }

  public restartScan(): void {
    if (!this.scanning) {
      this.detectedDevices = [];
      this.btAdapter.startDiscovery();
    }
  }

  public onItemSelected(event: ListViewEventData): void {
    const listView = event.object;
    const selectedDevice = listView.getSelectedItems()[0] as DeviceIdentifier;

    if (!selectedDevice.username || !selectedDevice.pushToken) {
      this.simpleSnackbar('This device is not logged in');
      return;
    }

    this.router.navigate(['/time-select'], {
      queryParams: {
        username: selectedDevice.username,
        pushToken: selectedDevice.pushToken,
      },
    });
  }

  private async scanBluetooth(): Promise<void> {
    const enabled = await this.providePermissions();

    if (enabled) {
      if (isAndroid) {
        this.discoverDevices();
      }
    } else {
      this.simpleSnackbar('Bluetooth not enabled');
    }
  }

  private async providePermissions(): Promise<boolean> {
    let permissionGranted: boolean;
    try {
      await requestPermission(android.Manifest.permission.ACCESS_FINE_LOCATION);
      permissionGranted = true;
    } catch (e) {
      this.simpleSnackbar('ACCESS_FINE_LOCATION permission not granted');
      permissionGranted = false;
    }
    return (await this.bluetooth.enable()) && permissionGranted;
  }

  private simpleSnackbar(text: string): void {
    this.snackbar.simple(text, '#000', '#d3d3d3');
  }

  private discoverDevices(): void {
    this.setupReceivers();

    this.btAdapter.startDiscovery();
  }

  private setupReceivers(): void {
    this.registerReceivers();
    this.handleReceivers();
  }

  private registerReceivers(): void {
    applicationModule.android.foregroundActivity.registerReceiver(
      this.receiver,
      new IntentFilter(BluetoothDevice.ACTION_FOUND)
    );

    applicationModule.android.foregroundActivity.registerReceiver(
      this.receiver,
      new IntentFilter(BluetoothAdapter.ACTION_DISCOVERY_STARTED)
    );

    applicationModule.android.foregroundActivity.registerReceiver(
      this.receiver,
      new IntentFilter(BluetoothAdapter.ACTION_DISCOVERY_FINISHED)
    );
  }

  private handleReceivers(): void {
    this.handleDeviceDetected();
    this.handleDiscoveryStarted();
    this.handleDiscoveryFinished();
  }

  private handleDeviceDetected(): void {
    const deviceDetected = this.receiver.deviceDetected.pipe(share());

    deviceDetected.subscribe((mac: string) => {
      this.zone.run(
        () => (this.detectedDevices = [...this.detectedDevices, { mac }])
      );
    });

    deviceDetected
      .pipe(flatMap((mac) => this.httpWrapper.findDevice(mac)))
      .subscribe((device) => {
        if (device) {
          this.zone.run(() => {
            const deviceToUpdateIndex = this.detectedDevices.findIndex(
              (detectedDevice) => detectedDevice.mac === device.mac
            );
            this.detectedDevices[deviceToUpdateIndex] = device;
          });
        }
      });
  }

  private handleDiscoveryStarted(): void {
    this.receiver.discoveryStarted.subscribe(() => {
      this.zone.run(() => (this.scanning = true));
    });
  }

  private handleDiscoveryFinished(): void {
    const discoveryFinished = this.receiver.discoveryFinished.pipe(share());

    discoveryFinished.subscribe(() => {
      this.zone.run(() => (this.scanning = false));
    });

    discoveryFinished
      .pipe(mergeMapTo(this.overwriteDevices()))
      .subscribe(() => {
        this.simpleSnackbar('List of detected devices sent to the server');
      });
  }

  private overwriteDevices(): Observable<void> {
    return defer(() =>
      this.httpWrapper.overwriteDetectedDevices({
        detectedDevices: this.detectedDevices,
      })
    );
  }
}

class CustomReceiver extends BroadcastReceiver {
  public deviceDetected = new EventEmitter<string>();
  public discoveryStarted = new EventEmitter();
  public discoveryFinished = new EventEmitter();

  public onReceive(context: Context, intent: Intent): void {
    switch (intent.getAction()) {
      case BluetoothDevice.ACTION_FOUND:
        const deviceAddress = (intent.getParcelableExtra(
          BluetoothDevice.EXTRA_DEVICE
        ) as BluetoothDevice).getAddress();
        this.deviceDetected.emit(deviceAddress);
        break;
      case BluetoothAdapter.ACTION_DISCOVERY_STARTED:
        this.discoveryStarted.emit();
        break;
      case BluetoothAdapter.ACTION_DISCOVERY_FINISHED:
        this.discoveryFinished.emit();
        break;
    }
  }
}
