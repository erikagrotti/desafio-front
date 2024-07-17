import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task, TaskGroup } from '../../models/task.models'; // Certifique-se de que os modelos corretos estão sendo importados
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router'; 
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TaskListComponent } from '../task-list/task-list.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  standalone: true,
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatListModule,
    MatSidenavModule,
    HeaderComponent,
    SidebarComponent,
    TaskListComponent,
    FooterComponent,
  ],
})
export class MainComponent implements OnInit {
  taskGroups$: BehaviorSubject<TaskGroup[]> = new BehaviorSubject<TaskGroup[]>([]);
  newTaskListName: string = '';

  constructor(private taskService: TaskService, private snackBar: MatSnackBar,  private router: Router) {}

  ngOnInit(): void {
    this.loadTaskGroups();
  }

  loadTaskGroups() {
    this.taskService.getLists().subscribe({
      next: (taskGroups: TaskGroup[]) => {
        this.taskGroups$.next(taskGroups);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao carregar listas de tarefas:', error);
      },
    });
  }

  createTaskList() {
    if (this.newTaskListName.trim() !== '') {
      const newTaskGroup: { title: string; tasks: Task[] } = {
        title: this.newTaskListName,
        tasks: [],
      };

      this.taskService.createTaskList(newTaskGroup).subscribe({
        next: (createdTaskGroup) => {
          this.loadTaskGroups();
          this.newTaskListName = '';
          this.snackBar.open('Lista de tarefas criada com sucesso!', 'Fechar', {
            duration: 3000,

          });
          this.loadTaskGroups();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Erro ao criar lista de tarefas:', error);
          this.snackBar.open('Erro ao criar a lista de tarefas.', 'Fechar', {
            duration: 5000,
          });
        },
      });
    }
  }
}
