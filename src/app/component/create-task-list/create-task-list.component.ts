import { Component } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Router } from '@angular/router'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task.models';

@Component({
  selector: 'app-create-task-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './create-task-list.component.html',
  styleUrls: ['./create-task-list.component.scss']
})
export class CreateTaskListComponent {
  listTitle: string = '';
  tasks: Task[] = [{ listID: 0, taskID: '', title: '', status: false }]; // Inicializa com um campo de tarefa

  constructor(private taskService: TaskService, private router: Router) { }

  addTask() {
    this.tasks.push({
      listID: 0, // Inicializa como 0
      taskID: '', // Inicializa como vazio
      title: '',
      status: false,
    });
  }

  get isSaveDisabled(): boolean {
    return !this.listTitle || this.tasks.some(task => !task.title);
  }

  saveTaskList() {
    const listID = this.generateUniqueListID(); // Gera um ID único para a lista
    const newTasks = this.tasks.map((task, index) => ({
      listID,
      taskID: `T00${index + 2}`, // Define taskID sequencial a partir de T002
      title: task.title,
      status: false, // Inicializa as tarefas como não concluídas
      description: task.description,
      subtasks: task.subtasks
    }));

    // Salva a tarefa pai (lista de tarefas)
    this.taskService.createTask({
      listID,
      taskID: 'T001',
      title: this.listTitle,
      status: false
    }).subscribe(
      () => {
        // Salva as tarefas filhas
        this.taskService.createTasks(newTasks).subscribe(
          () => {
            console.log('Lista de tarefas criada com sucesso!');
            this.router.navigate(['/task-list']); // Redireciona para a lista de tarefas
          },
          error => console.error('Erro ao criar tarefas:', error)
        );
      },
      error => console.error('Erro ao criar lista de tarefas:', error)
    );
  }

  cancel() {
    this.router.navigate(['/task-list']);
  }

  private generateUniqueListID(): number {
    return Date.now();
  }
}
