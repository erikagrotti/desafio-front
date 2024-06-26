import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Task } from '../models/task.models'; 

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
          console.log("Dados brutos do DynamoDB:", data); // <-- console.log fora do objeto
          return data.map(item => ({
            listID: item.listID,
            taskID: item.taskID,
            title: item.title,
            status: item.status,
            description: item.description
          }));
        })
      );
      
  }

  updateTaskStatus(task: Task): Observable<any> {
    const url = `${this.apiUrl}/items/${task.taskID}`; // Construir a URL
    const body = { status: task.status }; // Criar o corpo da requisição
    return this.http.patch(url, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }
}