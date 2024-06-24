import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DefauldLoginLayoutComponent } from './component/defauld-login-layout/defauld-login-layout.component';
import { LoginComponent } from './component/login/login.component';
import { PrimaryInputComponent } from './component/primary-input/primary-input.component';
import {SignupComponent} from './component/signup/signup.component'
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    DefauldLoginLayoutComponent, 
    LoginComponent, 
    PrimaryInputComponent,
    SignupComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'front-3';
}
