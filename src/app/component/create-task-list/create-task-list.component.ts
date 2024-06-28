import { Component } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task.models';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-task-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './create-task-list.component.html',
  styleUrls: ['./create-task-list.component.scss']
})
export class CreateTaskListComponent {
  listTitle: string = '';
  tasks: Task[] = [{ listID: 0, taskID: '', title: '', status: false }];

  constructor(
    private taskService: TaskService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  public generateUniqueListID(): number {
    return Date.now();
  }

  addTask() {
    this.tasks.push({
      listID: 0,
      taskID: '',
      title: '',
      status: false,
    });
  }

  get isSaveDisabled(): boolean {
    return !this.listTitle || this.tasks.some(task => !task.title);
  }

  saveTaskList() {
    const listID = this.generateUniqueListID();

    // 1. Crie a "tarefa pai" (título da lista) diretamente no array
    const allTasks: Task[] = [{
      listID: listID,
      taskID: 'T001',
      title: this.listTitle,
      status: false,
      description: undefined,
      subtasks: undefined
    }];

    // 2. Adicione as tarefas filhas ao array 'allTasks'
    allTasks.push(...this.tasks.map((task, index) => ({
      listID,
      taskID: `T00${index + 2}`,
      title: task.title,
      status: false,
      description: task.description,
      subtasks: task.subtasks
    })));

    // 3. Envie todas as tarefas para o backend
    this.taskService.createTasks(allTasks).subscribe(
      response => {
        console.log('Lista de tarefas criada com sucesso!', response);

        this.snackBar.open('Lista de tarefas criada com sucesso!', 'Fechar', {
          duration: 3000
        });

        // Limpa os campos do formulário
        this.listTitle = '';
        this.tasks = [{ listID: 0, taskID: '', title: '', status: false }];

        // Redireciona para a rota desejada
        this.router.navigate(['/created']);
      },
      error => {
        console.error('Erro ao criar lista de tarefas:', error);

        this.snackBar.open('Erro ao criar a lista de tarefas.', 'Fechar', {
          duration: 5000
        });
      }
    );
  } 

  // Método para cancelar a criação da lista
  cancel() {
    this.router.navigate(['/']); // Ou a rota desejada para cancelar
  }

  // Método para excluir uma tarefa
  deleteTask(index: number) {
    this.tasks.splice(index, 1);
  }
}