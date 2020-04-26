import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeviceIdentifier } from 'app/bluetooth-scan/device-identifier';

@Injectable({
  providedIn: 'root',
})
export class HttpWrapperService {
  private readonly SERVER_PREFIX = 'http://192.168.1.21:8080/bluetooth/';
  private readonly options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private readonly http: HttpClient) {}

  public findDevice(mac: string): Observable<DeviceIdentifier> {
    return this.http.get<DeviceIdentifier>(
      `${this.SERVER_PREFIX}device/${mac}`,
      this.options
    );
  }
}
