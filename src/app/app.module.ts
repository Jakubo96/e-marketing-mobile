import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { AppComponent } from 'app/app.component';
import { AppRoutingModule } from 'app/app-routing.module';
import { NativeScriptHttpClientModule } from 'nativescript-angular/http-client';

@NgModule({
  bootstrap: [AppComponent],
  imports: [NativeScriptModule, AppRoutingModule, NativeScriptHttpClientModule],
  declarations: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}
