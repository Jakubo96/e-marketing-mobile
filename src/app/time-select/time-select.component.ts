import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page/page';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { HttpWrapperService } from 'app/http-wrapper.service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { SnackBar } from '@nstudio/nativescript-snackbar';
import { formatDate } from '@angular/common';

@AutoUnsubscribe()
@Component({
  selector: 'ns-time-select',
  templateUrl: './time-select.component.html',
  styleUrls: ['./time-select.component.scss'],
})
export class TimeSelectComponent implements OnInit, OnDestroy {
  public username: string;
  private pushToken: string;
  public readonly timeControl = new FormControl(new Date());
  private readonly snackbar = new SnackBar();

  constructor(
    page: Page,
    private readonly route: ActivatedRoute,
    private readonly router: RouterExtensions,
    private readonly httpWrapper: HttpWrapperService
  ) {
    page.actionBarHidden = true;
  }

  public ngOnInit(): void {
    this.retrieveUsernameAndMac();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public ngOnDestroy(): void {}

  public goBack(): void {
    this.router.back();
  }

  public changeNotificationTime(): void {
    const time: Date = this.timeControl.value;

    this.httpWrapper
      .changeNotificationTime(this.pushToken, {
        time,
      })
      .subscribe(() =>
        this.snackbar.simple(
          `Notification time for ${this.username} was changed to ${formatDate(
            time,
            'shortTime',
            'en-US'
          )}`,
          '#000',
          '#d3d3d3'
        )
      );
  }

  private retrieveUsernameAndMac(): void {
    this.username = this.route.snapshot.queryParams.username;
    this.pushToken = this.route.snapshot.queryParams.pushToken;
  }
}
