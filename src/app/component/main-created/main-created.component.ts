import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CreateTaskListComponent } from '../create-task-list/create-task-list.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-main-created',
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    CreateTaskListComponent,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './main-created.component.html',
  styleUrl: './main-created.component.scss'
})
export class MainCreatedComponent {

}
