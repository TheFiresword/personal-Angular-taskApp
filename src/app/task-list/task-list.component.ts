import { Component, OnInit } from '@angular/core';
import { TaskServiceService, Task } from '../task-service.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

interface orderedTask extends Task{
  index: number;
}

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent {
  indexed_tasks: orderedTask[] = [];

  last_cancellation : boolean = true;

  constructor(
    private taskService: TaskServiceService,
    private router: Router,
    private dialog: MatDialog
    )
    {
      this.getTasks();
  }

  getTasks(){
    this.taskService.getTasks().subscribe(
      apiResponse => {
        if(apiResponse.message === "Succès"){
          let  tasks = apiResponse.details;
          this.indexed_tasks = tasks.map((task, i) => ({...task, index: i}));
        }
        else{
          // Echec -- Afficher un message d'erreur
        }
      }
    )
  }

  removeATask(task_id: number, task_index:number){
    this.taskService.sendRemoveTask(task_id).subscribe(
      response => {
        console.log(response);
        if (String(response.message).toLowerCase() == "succès"){
          this.last_cancellation = true;
          this.indexed_tasks.splice(task_index, 1);
        }
        else{
          this.last_cancellation = false;
        }
      }
    )
  }

  openConfirmDialog(task_id:number, task_index:number, enterAnimationDuration:string, exitAnimationDuration:string){
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: 'Etes vous sûr(e) de vouloir supprimer cette tâche ?',
      enterAnimationDuration: enterAnimationDuration,
      exitAnimationDuration: exitAnimationDuration
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.removeATask(task_id, task_index);
      }
      else{
        console.log("suppresion infirmée")
      }
    })
  }

  openTaskDetails(task_id: number){
    //console.log("Envoyé "+task_id);
    this.router.navigate(['/task', task_id]);
  }
}
