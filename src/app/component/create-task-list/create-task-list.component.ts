import { Component } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task, TaskGroup} from '../../models/task.models';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-create-task-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './create-task-list.component.html',
  styleUrls: ['./create-task-list.component.scss'],
})
export class CreateTaskListComponent {
  listTitle: string = '';
  tasks: Task[] = [{ listID: '', taskID: '', title: '', status: 'pendente' }]; 

  constructor(
    private taskService: TaskService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  public generateUniqueListID(): string {
    return Date.now().toString(); // Convertendo para string
  }

  addTask() {
    this.tasks.push({
      listID: '', 
      taskID: '', 
      title: '',
      status: 'pendente',
    });
  }

  get isSaveDisabled(): boolean {
    return !this.listTitle || this.tasks.some((task) => !task.title);
  }

  saveTaskList() {
    const listID = this.generateUniqueListID(); 
    
    // 1. Criar a lista
    const requestData = {
      title: this.listTitle,
      tasks: this.tasks.map((task) => ({ 
        listID: listID, // Adicione o listID aqui!
        taskID: task.taskID, 
        title: task.title,
        status: task.status
      }))
    };
  
    this.taskService.createTaskList(requestData).subscribe(
      (response) => {
        // Exibindo a mensagem de sucesso, mas manipulando a resposta
        console.log('Lista de tarefas criada com sucesso!', response);
        this.snackBar.open('Lista de tarefas criada com sucesso!', 'Fechar', {
          duration: 3000,
        });
  
        // Limpa os campos do formulário
        this.listTitle = '';
        this.tasks = [{ listID: '', taskID: '', title: '', status: 'pendente' }];
  
        // Redireciona para a rota desejada
        this.router.navigate(['/created']);
      },
      (error) => {
        console.error('Erro ao criar lista de tarefas:', error);
  
        this.snackBar.open('Erro ao criar a lista de tarefas.', 'Fechar', {
          duration: 5000,
        });
      }
    );
  }
  cancel() {
    this.router.navigate(['/main']); 
  }
  deleteTask(index: number) {
    this.tasks.splice(index, 1);
  }
}