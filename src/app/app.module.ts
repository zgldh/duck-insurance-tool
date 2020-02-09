import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../material/material.module';

import { AppComponent } from './app.component';

@NgModule({
  imports:      [ 
    BrowserModule,BrowserAnimationsModule, 
    FormsModule, ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule
  ],
  declarations: [ AppComponent],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
