import { Component, Inject, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { TaskService } from '../../services/task.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Task, TaskGroup } from '../../models/task.models';
import { HttpErrorResponse } from '@angular/common/http';

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
  styleUrls: ['./task-edit-card.component.scss']
})
export class TaskEditCardComponent implements OnInit {
  @Input() taskGroup: TaskGroup;
  @Output() save = new EventEmitter<TaskGroup>();
  newTaskTitle: string = '';

  constructor(
    public dialogRef: MatDialogRef<TaskEditCardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskGroup,
    private taskService: TaskService,
    private snackBar: MatSnackBar
  ) {
    this.taskGroup = data;
  }

  ngOnInit(): void {
  }

  addTask() {
    if (this.newTaskTitle.trim() !== '') {
      const newTaskID = this.generateNewTaskID();
      this.taskGroup.tasks.push({
        listID: this.taskGroup.listID,
        taskID: newTaskID,
        title: this.newTaskTitle,
        status: 'pendente',
      });
      this.newTaskTitle = '';
    }
  }

  generateNewTaskID(): string {
    const maxTaskID = this.taskGroup.tasks.reduce((max, task) => {
      const taskNumber = parseInt(task.taskID.replace('T', ''), 10);
      return taskNumber > max ? taskNumber : max;
    }, 0);
    return `T${(maxTaskID + 1).toString().padStart(3, '0')}`;
  }


  confirmDeleteTask(task: Task, listID: string) {
    if (confirm(`Tem certeza que deseja excluir a tarefa: ${task.title}?`)) {
      this.deleteTask(task, listID);
    }
  }

  deleteTask(task: Task, listID: string) {
    this.taskService.deleteTask(listID, task.taskID).subscribe({
      next: () => {
        console.log('Tarefa excluída com sucesso!');
        this.snackBar.open('Tarefa excluída com sucesso!', 'Fechar', { duration: 3000 });
        this.taskGroup.tasks = this.taskGroup.tasks.filter(t => t.taskID !== task.taskID);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao excluir tarefa:', error);
        this.snackBar.open('Erro ao excluir a tarefa.', 'Fechar', { duration: 5000 });
      },
    });
  }

  onSave() {
    if (this.taskGroup) {
      const existingTasks = this.taskGroup.tasks.filter(task => task.taskID !== '');
      const newTasks = this.taskGroup.tasks.filter(task => task.taskID === '');

      const data: TaskGroup = {
        listID: this.taskGroup.listID,
        listTitle: this.taskGroup.listTitle,
        listStatus: this.taskGroup.listStatus,
        tasks: existingTasks.concat(newTasks)
      };

      this.taskService.editTaskList(this.taskGroup).subscribe(
        () => {
          console.log('Lista de tarefas atualizada com sucesso!');
          this.snackBar.open('Lista de tarefas atualizada com sucesso!', 'Fechar', { duration: 3000 });
          this.dialogRef.close(this.taskGroup);
          this.save.emit(this.taskGroup);
        },
        error => {
          console.error('Erro ao atualizar a lista de tarefas:', error);
          this.snackBar.open('Erro ao atualizar a lista de tarefas.', 'Fechar', { duration: 5000 });
        }
      );
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
