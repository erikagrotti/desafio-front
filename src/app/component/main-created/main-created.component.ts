import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CreateTaskListComponent } from '../create-task-list/create-task-list.component';

@Component({
  selector: 'app-main-created',
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    CreateTaskListComponent
  ],
  templateUrl: './main-created.component.html',
  styleUrl: './main-created.component.scss'
})
export class MainCreatedComponent {

}
