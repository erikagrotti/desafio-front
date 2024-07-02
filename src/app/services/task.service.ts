import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Task, TaskGroup } from '../models/task.models'; 

@Injectable({
  providedIn: 'root',
})
export class TaskService {

  private apiUrl = 'https://dj61vekak1.execute-api.us-east-1.amazonaws.com'; 

  constructor(private http: HttpClient) { }

  getTasks(): Observable<Task[]> {
    return this.http.get<any[]>(`${this.apiUrl}/items`)
      .pipe(
        map(data => {
          console.log("Dados brutos do DynamoDB:", data); 
          return data.map(item => ({
            listID: item.listID,
            taskID: item.taskID,
            title: item.title,
            status: item.status,
            description: item.description || '' // Adicione uma descrição vazia se não existir
          }));
        })
      );
  }

  updateTaskStatus(task: Task): Observable<any> {
    const url = `${this.apiUrl}/items/${task.listID}/${task.taskID}`;
    const body = { status: task.status }; 
    return this.http.patch(url, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  editTaskList(updatedListData: TaskGroup): Observable<any> {
    const url = `${this.apiUrl}/items`; 
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

  deleteTask(listID: number, taskID: string): Observable<any> {
    const url = `${this.apiUrl}/items/${listID}/${taskID}`; 
    return this.http.delete(url); 
  }
    
  updateTasksStatus(listID: number, tasks: any[]): Observable<any> {
    const url = `${this.apiUrl}/items/${listID}/status`;
    return this.http.patch(url, { tasks: tasks }, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }

  updateParentTaskStatus(task: Task): Observable<any> {
    const url = `${this.apiUrl}/items/${task.listID}/${task.taskID}`;
    const body = { status: task.status }; 
    return this.http.patch(url, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  createTask(task: Task): Observable<any> {
    const url = `${this.apiUrl}/items`; 
    return this.http.post(url, task, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }

  createTasks(tasks: Task[]): Observable<any> {
    const url = `${this.apiUrl}/items`;
    return this.http.post(url, { tasks }, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }

  deleteTaskList(listID: number): Observable<any> {
    const url = `${this.apiUrl}/items/${listID}`; 
    return this.http.delete(url); 
  }
}