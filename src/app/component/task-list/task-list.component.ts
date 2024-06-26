import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.models';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { TaskItemComponent } from '../task-item/task-item.component';

interface TaskGroup {
  listID: number;
  listTitle: string; // Título da lista
  listStatus: boolean; // Status da lista
  tasks: Task[]; // Itens da lista (apenas tarefas)
}

@Component({
  standalone: true,
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  imports: [CommonModule, MatCheckboxModule, FormsModule, TaskItemComponent] 
})
export class TaskListComponent implements OnInit {
  taskGroups$: Observable<TaskGroup[]> = new Observable<TaskGroup[]>();

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks() {
    this.taskGroups$ = this.taskService.getTasks().pipe(
      map(tasks => this.groupTasks(tasks))
    );
  }

  private groupTasks(tasks: Task[]): TaskGroup[] {
    const grouped: { [listID: number]: TaskGroup } = {};

    tasks.forEach(task => {
      if (!grouped[task.listID]) { // Verifica se o grupo já existe
        // Se o grupo não existe, cria um novo grupo
        grouped[task.listID] = {
          listID: task.listID,
          listTitle: '', // Inicializa o título como vazio
          listStatus: false, // Inicializa o status como false
          tasks: [] // Inicializa a lista de tarefas
        };
      }
  
      if (task.taskID === 'T001') {
        // Define o título e o status da lista
        grouped[task.listID].listTitle = task.title;
        grouped[task.listID].listStatus = task.status;
      } else {
        // Adiciona a tarefa à lista de tarefas do grupo
        grouped[task.listID].tasks.push(task);
      }
    });
  
    return Object.values(grouped);
  }
  updateListStatus(group: TaskGroup): void {
    group.listStatus = !group.listStatus; // Alterna o status da lista

    // Atualiza o status de todas as tarefas da lista
    group.tasks.forEach(task => {
      task.status = group.listStatus;
    });

    // Lógica para atualizar o status no backend
    console.log('Atualizando status da lista no backend:', group);
  }

  updateTaskStatus(task: Task): void {
    // Lógica para atualizar o status da tarefa no backend
    console.log('Atualizando status da tarefa no backend:', task);
  }
}