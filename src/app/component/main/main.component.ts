import { Component, OnInit } from '@angular/core';
import{ FooterComponent } from '../footer/footer.component'
import { HeaderComponent } from '../header/header.component'
import { SidebarComponent } from '../sidebar/sidebar.component'
import {TaskListComponent} from '../task-list/task-list.component'
import { Task } from '../../models/task.models';
import { Observable, of} from 'rxjs';
import { TaskService } from '../../services/task.service';
import { TaskItemComponent } from '../task-item/task-item.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    TaskListComponent,
    TaskItemComponent
    
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  providers: [TaskService]
})
export class MainComponent implements OnInit {
  tasks$: Observable<Task[]> = of([]);// Para usar o asyncPipe

  constructor(public taskService: TaskService) { }

  ngOnInit(): void {
    this.tasks$ = this.taskService.getTasks(); 
  }
}
