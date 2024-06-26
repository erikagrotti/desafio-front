// src/app/models/task.model.ts

export interface Task {
  listID: number;
  taskID: string;
  title: string;
  status: boolean;
  description?: string;
  subtasks?: Task[]; // Para usar a lógica de tarefas pai/filho
}