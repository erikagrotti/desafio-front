import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../models/task.models';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
@Component({
selector: 'app-task-item',
templateUrl: './task-item.component.html',
styleUrls: ['./task-item.component.scss'],
standalone: true,
imports: [CommonModule, MatCheckboxModule, FormsModule, MatListModule],
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Input() listID!: string; 
  @Output() statusChange = new EventEmitter<{ task: Task, listID: string }>();

  updateTaskStatus(completed: boolean) {
    this.task.status = completed ? 'concluido' : 'pendente';
    this.statusChange.emit({ task: this.task, listID: this.listID }); 
  }
}