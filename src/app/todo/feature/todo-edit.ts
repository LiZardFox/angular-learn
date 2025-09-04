import { Component, inject } from '@angular/core';
import { TodoForm } from '../ui/todo-form';
import { Router } from '@angular/router';
import { CreateTodo } from '../interfaces/todo.interface';
import { TodoCurrent } from '../data-access/todo-current';

@Component({
  selector: 'app-todo-edit',
  imports: [TodoForm],
  template: `
    <div class="todo-edit-container">
      <h2 class="page-title">Edit Todo</h2>
      <app-todo-form
        actionLabel="Update Todo"
        [todo]="todo()!"
        (todoSubmitted)="handleEdit($event)"
      />
    </div>
  `,
  styles: ``,
})
export default class TodoEdit extends TodoCurrent {
  router = inject(Router);

  handleEdit(updatedTodo: CreateTodo) {
    this.todoService.updateTodo(this.todo()?.id!, updatedTodo);
    this.router.navigate(['/todo', this.todo()?.id]);
  }
}
