import { Component, OnInit } from '@angular/core';
import { TaskServiceService, apiResponse } from '../task-service.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent {
  the_task_form: FormGroup
  today: Date = new Date();
  title_control = new FormControl('', [Validators.required])
  show_button :boolean = false

  constructor(private taskService: TaskServiceService,
    private form: FormBuilder,
    private router: Router){
      this.the_task_form = this.form.group({'title':this.title_control, 'description':'', 'deadline':''});
  }
  ngOnInit(){
    this.setListener();
  }
  setListener(){
    this.the_task_form.valueChanges.subscribe(
      changes => {
        this.show_button = this.the_task_form.get('title')?.value? true:false
      }
    )
  }

  onFormSubmit(){
    let title = String(this.the_task_form.get('title')?.value);
    let description = String(this.the_task_form.get('description')?.value);
    //console.log(title, description)
    const form_deadline = this.the_task_form.get('deadline')
    let deadline
    if (form_deadline?.value){
      //console.log(form_deadline.value)
      deadline = String(formatDate(form_deadline.value, 'yyyy-MM-dd', 'en-US'));
    }
    let status
    let epilogue = (apiResponse: apiResponse<[]|string> ) => {
      status=apiResponse.message; 
      console.log(status, apiResponse.details);
      this.the_task_form.reset();
      this.router.navigate(['']);
    }
    //console.log([title, description, deadline])
    this.taskService.submitNewTask(title, description, deadline).subscribe(
      epilogue
    );
    
  }
}
