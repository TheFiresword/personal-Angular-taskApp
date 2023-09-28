import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskFormComponent } from './task-form/task-form.component';
import { TaskCardComponent } from './task-card/task-card.component';

const routes: Routes = [
  {path:'', redirectTo: 'tasks', pathMatch:'full'},
  {path: 'tasks', component: TaskListComponent, title: 'Tasks'},
  {path: 'task/:id', component: TaskCardComponent},
  {path: 'form', component: TaskFormComponent, title:'Task-Form'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
