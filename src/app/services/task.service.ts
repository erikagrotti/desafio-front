import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Task, TaskGroup, EditTaskListData } from '../models/task.models';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'https://dc0y8bcyu5.execute-api.us-east-1.amazonaws.com/';

  constructor(private http: HttpClient) {}

  // Obter todas as listas do usuário
  getLists(): Observable<TaskGroup[]> {
    return this.http.get<any[]>(`${this.apiUrl}/items`).pipe(
      map((data) =>
        data.map((item) => ({
          listID: item.listID,
          listTitle: item.title,
          listStatus: item.status,
          tasks: [],
        }))
      )
    );
  }

  // Obter tarefas de uma lista
  getTasks(listID: string): Observable<Task[]> {
    const url = `${this.apiUrl}/items/${listID}`;
    return this.http.get<any[]>(url).pipe(
      map((data) =>
        data.map((item) => ({
          listID: listID,
          taskID: item.taskID,
          title: item.title,
          status: item.status,
        }))
      )
    );
  }

  // Criar uma nova lista de tarefas
  createTaskList(taskList: { title: string; tasks: Task[] }): Observable<any> {
    const url = `${this.apiUrl}/items`;
    return this.http.post(url, taskList, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

   // Atualizar o status da lista de tarefas
   updateListStatus(listID: string, newStatus: string): Observable<any> {
    const url = `${this.apiUrl}/items/${listID}`;
    const body = { status: newStatus };
    return this.http.patch(url, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    }).pipe(
      // catchError(this.handleError)
    );
  }

   // Atualizar o status de uma tarefa individual
  //  updateTaskStatus(task: Task): Observable<any> {
  //   const url = `${this.apiUrl}/items/${task.listID}/${task.taskID}`; // Incluir listID na URL
  //   const body = { status: task.status }; 
  //   return this.http.patch(url, body, {
  //     headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  //   });
  // }

  updateTasksStatus(listID: string, task: Task, newStatus: string): Observable<any> {
    const url = `${this.apiUrl}/items/${listID}/${task.listID}/status`;
    return this.http.patch(url, { status:  newStatus}, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }

  updateParentTaskStatus(task: Task): Observable<any> {
    const url = `${this.apiUrl}/items/${task.listID}/${task.taskID}`;
    const body = { status: task.status }; 
    return this.http.patch(url, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }


     // Atualizar o título de uma lista de tarefas
  updateListTitle(listID: string, newTitle: string): Observable<any> {
    const url = `${this.apiUrl}/items/${listID}`;
    const body = { title: newTitle };
    return this.http.patch(url, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    }).pipe(
      // catchError(this.handleError)
    );
  }

  // Excluir uma lista e suas tarefas
  deleteTaskList(listID: string): Observable<any> {
    const url = `${this.apiUrl}/items/${listID}`;
    return this.http.delete(url);
  }

   // Editar uma lista de tarefas
   editTaskList(updatedListData: TaskGroup): Observable<any> {
    const url = `${this.apiUrl}/items/${updatedListData.listID}`; 
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    const body = { 
      listID: updatedListData.listID, // Inclua o listID no corpo
      title: updatedListData.listTitle,
      tasks: updatedListData.tasks.map(task => ({
        taskID: task.taskID, 
        title: task.title,
        status: task.status
      }))
    };
  
    return this.http.patch(url, body, { headers }); // Use PATCH para atualizar
  }

  // Excluir uma tarefa
  deleteTask(listID: string, taskID: string): Observable<any> {
    const url = `${this.apiUrl}/items/${listID}/${taskID}`;
    return this.http.delete(url);
  }
}
