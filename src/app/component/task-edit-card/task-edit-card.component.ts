import { Component, Inject, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TaskGroup } from '../../models/task.models';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { Task } from '../../models/task.models';
import { TaskService } from '../../services/task.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-task-edit-card',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    CommonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './task-edit-card.component.html',
  styleUrl: './task-edit-card.component.scss'
})
export class TaskEditCardComponent implements OnInit {
  @Input() taskGroup: TaskGroup; // taskGroup deve ser inicializado no construtor
  @Output() save = new EventEmitter<TaskGroup>();
  newTaskTitle: string = '';

  constructor(
    public dialogRef: MatDialogRef<TaskEditCardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskGroup,
    private taskService: TaskService,
    private snackBar: MatSnackBar
  ) {
    this.taskGroup = { ...data }; // Inicializa taskGroup com os dados recebidos
  }

  ngOnInit(): void {
    // A verificação de taskGroup.tasks não é mais necessária aqui
  }

  addTask() {
    if (this.newTaskTitle.trim() !== '') {
      this.taskGroup.tasks.push({
        listID: this.taskGroup.listID,
        taskID: this.generateTaskId(),
        title: this.newTaskTitle,
        status: false
      });
      this.newTaskTitle = '';
    }
  }

  deleteTask(index: number) {
    const taskToDelete = this.taskGroup.tasks[index];
    const listID = this.taskGroup.listID; 
    const taskID = taskToDelete.taskID;
  
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) { // Confirmação para a tarefa
      this.taskService.deleteTask(listID, taskID) 
        .subscribe(
          () => {
            console.log('Tarefa excluída com sucesso do backend!');
            this.taskGroup.tasks.splice(index, 1); 
            this.snackBar.open('Tarefa excluída com sucesso!', 'Fechar', { duration: 3000 });
          },
          error => {
            console.error('Erro ao excluir tarefa do backend:', error);
            this.snackBar.open('Erro ao excluir tarefa.', 'Fechar', { duration: 5000 });
          }
        );
    }
  }

  private generateTaskId(): string {
    return `T${Date.now()}`;
  }

  onSave() {
    this.dialogRef.close(this.taskGroup);
    this.save.emit(this.taskGroup);
  }

  onCancel() {
    this.dialogRef.close();
  }
}