import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task, TaskGroup, EditTaskListData } from '../../models/task.models';
import { Observable, of, forkJoin, BehaviorSubject } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { TaskItemComponent } from '../task-item/task-item.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskEditCardComponent } from '../task-edit-card/task-edit-card.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
// import { AuthInterceptor } from '../../../../auth.interceptor';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  standalone: true,
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  imports: [
    CommonModule,
    MatCheckboxModule,
    FormsModule,
    TaskItemComponent,
    MatListModule,
    MatIconModule,
    TaskEditCardComponent,
    MatProgressSpinnerModule,
    MatExpansionModule,
   
  ],
})
export class TaskListComponent implements OnInit {
  taskGroups$: BehaviorSubject<TaskGroup[]> = new BehaviorSubject<TaskGroup[]>([]);
  editingTaskGroup: TaskGroup | undefined;
  isLoading = true;
  expandedPanels: string[] = [];

  constructor(
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    // private authInterceptor: AuthInterceptor,
  ) {}

  ngOnInit(): void {
    this.loadTaskGroups();
  }

  loadTaskGroups() {
    this.isLoading = true;
    this.taskService.getLists().pipe(
      switchMap((lists) => {
        const tasksObservables = lists.map((list) =>
          this.taskService.getTasks(list.listID).pipe(
            switchMap((tasks) => {
              const titleTask = tasks.find((task) => task.taskID === 'T000');
              const listTitle = titleTask ? titleTask.title : '';
              const listStatus = titleTask ? titleTask.status === 'concluido' : false;
              return of({
                ...list,
                listTitle,
                listStatus: listStatus ? 'concluido' : 'pendente',
                tasks: tasks.filter((task) => task.taskID !== 'T000'),
              });
            })
          )
        );
        return forkJoin(tasksObservables);
      })
    ).subscribe({
      next: (taskGroups: TaskGroup[]) => {
        const filteredTaskGroups = taskGroups.filter(group => group.tasks.length > 0);
        this.taskGroups$.next(filteredTaskGroups);
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao carregar listas e tarefas:', error);
        this.isLoading = false;
      },
    });
  }

  updateListStatus(group: TaskGroup): void {
  const newStatus = group.listStatus === 'concluido' ? 'pendente' : 'concluido'; // Inverte o status

  // Atualiza o status da lista no backend
  this.taskService.updateListStatus(group.listID, newStatus).subscribe(
    () => {
      console.log('Status da lista atualizado com sucesso!');

      group.listStatus = newStatus;

      const tasksObservables = group.tasks.map(task => {
        task.status = newStatus;
        return this.taskService.updateTasksStatus(group.listID, task.taskID, newStatus); // Passa o objeto task completo
      });

      forkJoin(tasksObservables).subscribe(
        () => {
          console.log('Status das tarefas atualizado com sucesso!');
          this.taskGroups$.next([...this.taskGroups$.getValue()]);
        },
        (error) => console.error('Erro ao atualizar status das tarefas:', error)
      );
    },
    (error) => console.error('Erro ao atualizar status da lista:', error)
  );
}



updateTaskStatus(task: Task, listID: string): void {
  const newStatus = task.status === 'concluido' ? 'concluido' : 'pendente';

  this.taskService.updateTasksStatus(listID, task.taskID, newStatus).subscribe({
    next: () => {
      console.log('Status da tarefa atualizado com sucesso!');
      task.status = newStatus;
      this.updateParentStatusIfNeeded(listID);
      this.taskGroups$.next([...this.taskGroups$.getValue()]);
    },
    error: (error: HttpErrorResponse) => {
      console.error('Erro ao atualizar o status da tarefa:', error);
      this.snackBar.open('Erro ao atualizar o status da tarefa.', 'Fechar', { duration: 5000 });
    }
  });
}

private updateParentStatusIfNeeded(listID: string) {
  this.taskGroups$.pipe(take(1)).subscribe(groups => {
    const groupIndex = groups.findIndex(g => g.listID === listID);
    if (groupIndex !== -1) {
      const group = groups[groupIndex];
      const allTasksCompleted = group.tasks.every(t => t.status === "concluido");

      // Atualiza o status do grupo no backend se necessário
      if (allTasksCompleted && group.listStatus !== 'concluido') {
        this.taskService.updateParentTaskStatus(group.listID, 'concluido').subscribe(
          () => {
            console.log('Status do pai atualizado para "concluido" com sucesso!');
            group.listStatus = 'concluido';
            this.taskGroups$.next([...groups]);
          },
          (error) => console.error('Erro ao atualizar status do pai para "concluido":', error)
        );
      } else if (!allTasksCompleted && group.listStatus !== 'pendente') {
        this.taskService.updateParentTaskStatus(group.listID, 'pendente').subscribe(
          () => {
            console.log('Status do pai atualizado para "pendente" com sucesso!');
            group.listStatus = 'pendente';
            this.taskGroups$.next([...groups]);
          },
          (error) => console.error('Erro ao atualizar status do pai para "pendente":', error)
        );
      }
    }
  });
}

  deleteTaskList(listID: string) {
    if (confirm('Tem certeza que deseja excluir esta lista de tarefas?')) {
      this.taskService.deleteTaskList(listID).subscribe({
        next: () => {
          console.log('Lista de tarefas excluída com sucesso!');
          const updatedTaskGroups = this.taskGroups$.getValue().filter(
            (group) => group.listID !== listID
          );
          this.taskGroups$.next(updatedTaskGroups);
          this.snackBar.open('Lista de tarefas excluída com sucesso!', 'Fechar', { duration: 3000 });
        },
        error: (error: HttpErrorResponse) => {
          console.error('Erro ao excluir lista de tarefas:', error);
          this.snackBar.open('Erro ao excluir a lista de tarefas.', 'Fechar', { duration: 5000 });
        },
      });
    }
  }

  editTaskList(taskGroup: TaskGroup) {
    const dialogRef = this.dialog.open(TaskEditCardComponent, {
      width: '600px',
      data: taskGroup,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveTaskListChanges(result);
      }
    });
  }

  saveTaskListChanges(updatedTaskGroup: TaskGroup) {
    const index = this.taskGroups$.getValue().findIndex(
      (g) => g.listID === updatedTaskGroup.listID
    );

    if (index !== -1) {
      const updatedTaskGroups = [...this.taskGroups$.getValue()];
      updatedTaskGroups[index] = updatedTaskGroup;
      this.taskGroups$.next(updatedTaskGroups);

      const editTaskListData: EditTaskListData = {
        listID: updatedTaskGroup.listID,
        listTitle: updatedTaskGroup.listTitle,
        listStatus: updatedTaskGroup.listStatus,
        tasks: updatedTaskGroup.tasks,
        newTasks: [], // Lista de novas tarefas se houver
      };

      this.taskService
        .editTaskList(updatedTaskGroup)
        .subscribe({
          next: () => {
            console.log('Lista de tarefas atualizada com sucesso no backend!');
            
          },
          error: (error: HttpErrorResponse) => {
            console.error('Erro ao atualizar a lista de tarefas no backend:', error);
            this.snackBar.open('Erro ao atualizar a lista de tarefas.', 'Fechar', { duration: 5000 });
          },
        });
    }

    this.editingTaskGroup = undefined;
  }

  cancelTaskListEdit() {
    this.editingTaskGroup = undefined;
  }

  isPanelOpen(panelId: string): boolean {
    return this.expandedPanels.includes(panelId);
  }

  togglePanel(panelId: string): void {
    if (this.isPanelOpen(panelId)) {
      this.expandedPanels = this.expandedPanels.filter(id => id !== panelId);
    } else {
      this.expandedPanels.push(panelId);
    }
  }
}