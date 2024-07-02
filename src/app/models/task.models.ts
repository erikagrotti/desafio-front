// src/app/models/task.model.ts

export interface Task {
  listID: number;
  taskID: string;
  title: string;
  status: boolean;
  description?: string; // '?' indica que a propriedade é opcional
  subtasks?: Task[];   // '?' indica que a propriedade é opcional
  listStatus?: boolean; // Adicione a propriedade listStatus se necessário
}

export interface TaskGroup {
  listID: number;
  listTitle: string; 
  listStatus: boolean; // Adicione a propriedade listStatus
  tasks: Task[];
}