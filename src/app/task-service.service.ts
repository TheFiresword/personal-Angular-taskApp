import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, map } from 'rxjs';
export interface Task{
  id: number
  title: string
  description:string
  due_date?:Date
  completed:Boolean
  created_at:Date
  updated_at:Date
}
export interface apiResponse<T>{
  message: string,
  details: T
} 

@Injectable({
  providedIn: 'root'
})
export class TaskServiceService {
  tasks !: Task[]
  private backend_url = "http://localhost:3001/tasks";
  
  constructor(private http: HttpClient) {
  }

  getTasks(): Observable<apiResponse<Task[]>>{
    //window.alert("I'm here");
    return this.http.get<apiResponse<Task[]>>(this.backend_url);
  }

  submitNewTask(title: string, description: string, deadline?: string): Observable<apiResponse<[] | string>>{
    // Suppose here that the values are safe and cleaned
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    let body :{[key: string]: string}= {};

    body['title'] = title;
    body['description'] = description;
    if(deadline)
      body['due_date']= deadline;
    return this.http.post<apiResponse<[] | string>>(this.backend_url, body, {headers});
    //return this.http.post<{status: string}>(this.backend_url+'create', body.toString(), {headers});
  }

  sendRemoveTask(id:number): Observable<apiResponse<[] | string>>{
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.delete<apiResponse<[] | string>>(this.backend_url+'/'+id, {headers});
  }

  getOneTask(id: number): Observable<apiResponse<Task | string>>{
    return this.http.get<apiResponse<Task | string>>(this.backend_url+'/'+id);
  }

  updateOneTask(id: number, new_title?: string, new_description?:string, new_deadline?:string):Observable<apiResponse<[] | string>> | undefined{
    if(!new_deadline && !new_description && !new_title){
      return;
    }
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    let body :{[key: string]: string}= {};

    if(new_title)
      body['title'] = new_title;
    if(new_description)
      body['description'] = new_description;
    if(new_deadline)
      body['due_date']= new_deadline;
    
    return this.http.patch<apiResponse<[] | string>>(this.backend_url+'/'+id, body, {headers}) 
  }
}
