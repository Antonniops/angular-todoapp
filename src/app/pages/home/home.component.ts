import { Component, computed, effect, inject, Injector, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  tasks = signal<Task[]>([]);

  injector = inject(Injector)
  filter = signal<'all' | 'pending' | 'completed'>('all')
  tasksByFilter = computed( () => {
    const filter = this.filter()
    const tasks = this.tasks()

    if(filter === 'pending'){
      return tasks.filter( (task) => !task.completed)
    }

    if(filter === 'completed'){
      return tasks.filter( (task) => task.completed)
    }

    return tasks
  })

  newTaskCtrl: FormControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });


  constructor(){
    
  }

  ngOnInit(){
    const storage = localStorage.getItem('tasks')

    if(storage){
      const tasks = JSON.parse(storage)
      this.tasks.set(tasks)
    }
    this.trackTasks()
  }

  trackTasks(){
    effect( () => {
      const tasks = this.tasks()
      localStorage.setItem('tasks', JSON.stringify(this.tasks()))
    }, {injector: this.injector})
  }

  changeHandler() {
    if (this.newTaskCtrl.valid && this.newTaskCtrl.value.trim() !== '') {
      this.addTask(this.newTaskCtrl.value);
      this.newTaskCtrl.setValue('');
    }
  }

  clickHandler(index: number) {
    this.deleteTask(index);
  }

  toggleCompleted(index: number) {
    this.updateTasks(index);
  }

  addTask(title: string) {
    const newTask = {
      id: Date.now(),
      title,
      completed: false,
    };

    this.tasks.update((tasks) => [...tasks, newTask]);
  }

  updateTasks(id: number) {
    this.tasks.update((tasks) =>
      tasks.map((task) => {
        if (task.id === id) {
          console.log(task, id)
          task.completed = !task.completed;
        }

        return task;
      })
    );

    console.log(this.tasks())
  }

  deleteTask(index: number) {
    this.tasks.update((tasks) =>
      tasks.filter((task, position) => position !== index)
    );
  }

  deleteCompleted(): void{
    this.tasks.update((tasks) => tasks.filter( (task) => !task.completed))
  }

  updateTaskTextMode(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    this.tasks.update((tasks) =>
      tasks.map((task, idx) => {
        if (idx === index) {
          return {
            ...task,
            title: input.value,
            editing: false
          };
        }

        return task
      })
    );
  }

  updateTaskEditingMode(index: number) {
    this.tasks.update((tasks) =>
      tasks.map((task, idx) => {
        if (idx === index && !task.completed) {
          return {
            ...task,
            editing: true,
          };
        }

        return {
          ...task,
          editing: false,
        };
      })
    );
  }

  changeFilter(filter: 'all' | 'pending' | 'completed'){
    this.filter.set(filter)
  }
}
