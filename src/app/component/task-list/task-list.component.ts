import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task, TaskGroup } from '../../models/task.models';
import { CommonModule } from '@angular/common';
import { map, take } from 'rxjs/operators';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { TaskItemComponent } from '../task-item/task-item.component';
import { MatListModule } from '@angular/material/list';
import { BehaviorSubject } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskEditCardComponent } from '../task-edit-card/task-edit-card.component';
import { MatDialog } from '@angular/material/dialog'; 

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
  ]
})
export class TaskListComponent implements OnInit {
  taskGroups$: BehaviorSubject<TaskGroup[]> = new BehaviorSubject<TaskGroup[]>([]);
  editingTaskGroup: TaskGroup | undefined;

  constructor(
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().pipe(
      map(tasks => this.groupTasks(tasks))
    ).subscribe(groupedTasks => {
      this.taskGroups$.next(groupedTasks);
    });
  }

  private groupTasks(tasks: Task[]): TaskGroup[] {
    const grouped: { [listID: number]: TaskGroup } = {};

    tasks.forEach(task => {
      if (!grouped[task.listID]) {
        grouped[task.listID] = {
          listID: task.listID,
          listTitle: '',
          listStatus: false,
          tasks: []
        };
      }

      if (task.taskID === 'T001') {
        grouped[task.listID].listTitle = task.title; 
        grouped[task.listID].listStatus = task.status;
      } else {
        grouped[task.listID].tasks.push(task);
      }
    });

    return Object.values(grouped);
  }

  updateListStatus(group: TaskGroup): void {
    group.listStatus = !group.listStatus;

    group.tasks.forEach(task => {
      task.status = group.listStatus;
      this.updateTaskStatus(task);
    });

    const parentTask: Task = {
      listID: group.listID,
      taskID: 'T001',
      status: group.listStatus,
      title: group.listTitle
    };

    this.taskService.updateParentTaskStatus(parentTask)
      .subscribe(
        () => console.log('Status do pai atualizado com sucesso!'),
        (error) => console.error('Erro ao atualizar status do pai:', error)
      );
  }

  updateTaskStatus(task: Task): void {
    this.taskService.updateTaskStatus(task).subscribe(
      () => {
        console.log('Status da tarefa atualizado com sucesso!');
        this.updateParentStatusIfNeeded(task); 
      },
      (error) => console.error('Erro ao atualizar status da tarefa:', error)
    );
  }

  private updateParentStatusIfNeeded(task: Task) {
    this.taskGroups$.pipe(take(1)).subscribe((groups: TaskGroup[]) => {
      const groupIndex = groups.findIndex((g: TaskGroup) => g.listID === task.listID);
      if (groupIndex !== -1) {
        const group = groups[groupIndex];

        const allTasksCompleted = group.tasks.every((t: Task) => t.status === true);
        if (allTasksCompleted) {
          group.listStatus = true;

          const parentTask: Task = {
            listID: group.listID,
            taskID: 'T001',
            status: true,
            title: group.listTitle
          };

          this.taskService.updateParentTaskStatus(parentTask)
            .subscribe(
              () => console.log('Status do pai atualizado com sucesso!'),
              (error) => console.error('Erro ao atualizar status do pai:', error)
            );
        } else if (!group.tasks.every(t => t.status)) { 
          group.listStatus = false;
          const parentTask: Task = {
            listID: group.listID,
            taskID: 'T001',
            status: false,
            title: group.listTitle
          };
          this.taskService.updateParentTaskStatus(parentTask)
            .subscribe(
              () => console.log('Status do pai atualizado com sucesso!'),
              (error) => console.error('Erro ao atualizar status do pai:', error)
            );
        }
        this.taskGroups$.next([...groups]);
      }
    });
  }

  deleteTaskList(listID: number) {
    if (confirm('Tem certeza que deseja excluir esta lista de tarefas?')) {
      this.taskService.deleteTaskList(listID).subscribe(
        () => {
          console.log('Lista de tarefas excluída com sucesso!');
          this.loadTasks();
          this.snackBar.open('Lista de tarefas excluída com sucesso!', 'Fechar', {
            duration: 3000
          });
        },
        error => {
          console.error('Erro ao excluir lista de tarefas:', error);
          this.snackBar.open('Erro ao excluir a lista de tarefas.', 'Fechar', {
            duration: 5000
          });
        }
      );
    }
  }

  editTaskList(taskGroup: TaskGroup) {
    const dialogRef = this.dialog.open(TaskEditCardComponent, {
      width: '600px', 
      data: taskGroup 
    });

    dialogRef.afterClosed().subscribe((result: TaskGroup | undefined) => {
      if (result) { 
        this.saveTaskListChanges(result);
      }
    });
  }

  saveTaskListChanges(updatedTaskGroup: TaskGroup) {
    const index = this.taskGroups$.getValue().findIndex(g => g.listID === updatedTaskGroup.listID);

    if (index !== -1) {
      const updatedTaskGroups = [...this.taskGroups$.getValue()];
      updatedTaskGroups[index] = updatedTaskGroup;
      this.taskGroups$.next(updatedTaskGroups);

      this.taskService.editTaskList(updatedTaskGroup)
        .subscribe(
          () => {
            console.log('Lista de tarefas atualizada com sucesso no backend!');
            this.snackBar.open('Lista de tarefas atualizada com sucesso!', 'Fechar', {
              duration: 3000
            });
          },
          error => {
            console.error('Erro ao atualizar a lista de tarefas no backend:', error);
            this.snackBar.open('Erro ao atualizar a lista de tarefas.', 'Fechar', {
              duration: 5000
            });
          }
        );
    }

    this.editingTaskGroup = undefined;
  }

  cancelTaskListEdit() {
    this.editingTaskGroup = undefined;
  }
}