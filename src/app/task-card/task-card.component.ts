import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { Task, TaskServiceService } from '../task-service.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent {
  task: Task = {} as Task;
  initial_task!: Task;
  task_id : number = -1;
  error_msg: string = "";
  date_to_display: Date = new Date();
  is_changed: boolean=false;
  the_task_form!: FormGroup;

  constructor(private route: ActivatedRoute, 
    private taskService: TaskServiceService, 
    private form: FormBuilder,
    private router: Router){
    const routeParams = this.route.snapshot.paramMap;
    this.task_id = Number(routeParams.get('id'));
    
    this.the_task_form = this.form.group({'title':'', 'deadline':'', 'description':''});
    this.getOneTask(this.task_id);

 }
  setChangesListener(){
    this.the_task_form.valueChanges.subscribe(
      
      changment =>{
        //console.log(this.initial_task);
        const formated_deadline = String(formatDate(this.the_task_form.get('deadline')?.value, 'yyyy-MM-dd', 'en-US'))
        
        if( 
          this.the_task_form.get('title')?.value == this.initial_task.title &&
          this.the_task_form.get('description')?.value == this.initial_task.description &&
          formated_deadline == String(this.initial_task.due_date)
        ){
          this.is_changed=false;
        }
        else{
          console.log("changement")
          this.is_changed=true;     
        }
      }
    )
  }
 
  getOneTask(id:number){
    this.taskService.getOneTask(id).subscribe(
      apiResponse => {
        let params = apiResponse.details
        let status = String(apiResponse.message).toLowerCase()
        if (status === "echec"){
          // An error occured
          this.error_msg = "Erreur";
        }
        else if(typeof params === 'object'){
          this.task = params;
          this.initial_task = params;
          if(this.task['due_date']){
            this.date_to_display = this.task['due_date'];
          }
          this.the_task_form.setValue({
            title: this.task.title,
            deadline: this.date_to_display,
            description: this.task.description
          });
          this.setChangesListener();
        }
      
      }
    )
  }
  goBackToList(){
    this.router.navigateByUrl('/tasks')
  }
  

  onSubmitChanges(){
    const cur_title = this.the_task_form.get('title')?.value;
    const cur_descr = this.the_task_form.get('description')?.value;
    const cur_deadl = this.the_task_form.get('deadline')?.value;

    const title_to_send = (cur_title != this.initial_task.title)? cur_title:undefined
    const descr_to_send = (cur_descr != this.initial_task.description)? cur_descr:undefined
    const deadl_to_send = (cur_deadl != this.initial_task.due_date)? String(formatDate(cur_deadl, 'yyyy-MM-dd', 'en-US')):undefined
    console.log([this.task.id, title_to_send, descr_to_send, deadl_to_send])
    const apiResponse = this.taskService.updateOneTask(this.task.id, title_to_send, descr_to_send, deadl_to_send);
    
    let epilogue = (message: string) => {
      if(message.toLowerCase() === "succès"){
        this.the_task_form.reset();
        this.goBackToList()
      }
      else{
        //Unexpected error occured
      }
      
    }

    if(apiResponse){
      apiResponse.subscribe(
        response => {
          epilogue(response.message)
        }
      )
    }
    
  }
}


