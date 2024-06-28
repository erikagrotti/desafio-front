import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.models';
import { CommonModule } from '@angular/common';
// import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { TaskItemComponent } from '../task-item/task-item.component';
import { MatListModule } from '@angular/material/list';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

interface TaskGroup {
  listID: number;
  listTitle: string;
  listStatus: boolean;
  tasks: Task[];
}

@Component({
  standalone: true,
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  imports: [CommonModule, MatCheckboxModule, FormsModule, TaskItemComponent, MatListModule, MatIconModule ]
})
export class TaskListComponent implements OnInit {
  taskGroups$: BehaviorSubject<TaskGroup[]> = new BehaviorSubject<TaskGroup[]>([]);

  constructor(private taskService: TaskService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().pipe(
      map(tasks => this.groupTasks(tasks))
    ).subscribe(groupedTasks => {
      this.taskGroups$.next(groupedTasks); // Emite o valor inicial para o BehaviorSubject
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

    // Atualiza o status de todos os filhos para corresponder ao pai
    group.tasks.forEach(task => {
      task.status = group.listStatus;
      this.updateTaskStatus(task);
    });

    // Cria uma tarefa representando o pai
    const parentTask: Task = {
      listID: group.listID,
      taskID: 'T001',
      status: group.listStatus,
      title: group.listTitle
    };

    // Atualiza apenas o status do pai no backend
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
        this.updateParentStatusIfNeeded(task); // Verifica e atualiza o pai se necessário
      },
      (error) => console.error('Erro ao atualizar status da tarefa:', error)
    );
  }

  // Verifica se o status do pai precisa ser atualizado e, se sim, atualiza
  private updateParentStatusIfNeeded(task: Task) {
    this.taskGroups$.pipe(take(1)).subscribe((groups: TaskGroup[]) => {
      const groupIndex = groups.findIndex((g: TaskGroup) => g.listID === task.listID);
      if (groupIndex !== -1) {
        const group = groups[groupIndex]; // Obtém a referência direta ao grupo
  
        // Verifica se TODOS os filhos estão marcados como 'true' (concluídos)
        const allTasksCompleted = group.tasks.every((t: Task) => t.status === true);
        if (allTasksCompleted) { 
          // Atualiza o status do pai no frontend 
          group.listStatus = true;

          // Cria uma tarefa representando o pai
          const parentTask: Task = {
            listID: group.listID,
            taskID: 'T001',
            status: true, 
            title: group.listTitle
          };

          // Atualiza o status do pai no backend
          this.taskService.updateParentTaskStatus(parentTask)
            .subscribe(
              () => console.log('Status do pai atualizado com sucesso!'),
              (error) => console.error('Erro ao atualizar status do pai:', error)
            );
        } else if (!group.tasks.every(t => t.status)) { // Se pelo menos uma tarefa não estiver concluída
          group.listStatus = false; // Define o status do pai como 'false'
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
          this.loadTasks(); // Recarrega as tarefas após a exclusão
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
}