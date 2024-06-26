import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DefauldLoginLayoutComponent } from './component/defauld-login-layout/defauld-login-layout.component';
import { LoginComponent } from './component/login/login.component';
import { PrimaryInputComponent } from './component/primary-input/primary-input.component';
import {SignupComponent} from './component/signup/signup.component';
import {MainComponent} from './component/main/main.component';
import{ FooterComponent } from './component/footer/footer.component';
import { HeaderComponent } from './component/header/header.component';
import { SidebarComponent } from './component/sidebar/sidebar.component';
import { TaskListComponent } from './component/task-list/task-list.component';
import { MatCheckboxModule } from '@angular/material/checkbox'
import {TaskItemComponent} from './component/task-item/task-item.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    DefauldLoginLayoutComponent, 
    LoginComponent, 
    PrimaryInputComponent,
    SignupComponent,
    MainComponent,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    TaskListComponent,
    MatCheckboxModule,
    TaskItemComponent,
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'front-3';
}
