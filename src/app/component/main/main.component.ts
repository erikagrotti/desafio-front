import { Component } from '@angular/core';
import{ FooterComponent } from '../footer/footer.component'
import { HeaderComponent } from '../header/header.component'
import { SidebarComponent } from '../sidebar/sidebar.component'
import {TaskListComponent} from '../task-list/task-list.component'


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    TaskListComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

}
