import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';

import { AppRoutingModule, routingComponents } from './app-routing.module';

import { AppComponent } from './app.component';
import { SpectrogramModule } from "./spectrogram/spectrogram.module";
import { AuthService} from "../services/auth.service";

import { AngularFireModule } from 'angularfire2';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from "angularfire2/auth";
import { environment } from "../environments/environment";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { MatNativeDateModule,} from "@angular/material";
import {SpectrogramComponent} from "./spectrogram/spectrogram.component";
import {NavMenuComponent} from "./spectrogram/spectrum/nav-menu/nav-menu.component";


@NgModule({
  declarations: [
    AppComponent,
    SpectrogramComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    AngularFireAuthModule,
    AppRoutingModule,
    SpectrogramModule,
  ],
  providers: [AuthService, NavMenuComponent],
  bootstrap: [AppComponent]

})
export class AppModule { }
