import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.css'
})
export class LabsComponent {
  welcome = 'bienvenido';

  tasks = signal([
    'Instalar Angular CLI',
    'Instalar proyecto',
    'Crear componentes'
  ])

  colorCtrl= new FormControl();
  widthCtrl = new FormControl(50, {
    nonNullable: true
  });

  nameCtrl = new FormControl('antonio', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(3)
    ]
  });

  name=signal("Antonio")
  edad="24"
  disabled="true"
  img="https://w3schools.com/howto/img_avatar.png"


  constructor(){
    this.colorCtrl.valueChanges.subscribe(value => console.log(value))
  }

  clickHandler(){
    alert('hola')
  }

  changeHandler(evento: Event){
    const input = evento.target as HTMLInputElement
    const newValue = input.value

    this.name.set(newValue)
    console.log(input.value)
  }

  keydownHandler(evento: KeyboardEvent){
    const input = evento.target as HTMLInputElement
    console.log(input.value)
  }
}
