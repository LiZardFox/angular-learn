import { Component, inject } from '@angular/core';
import { TodoForm } from "../ui/todo-form";
import { TodoService } from '../data-access/todo.service';
import { TodoList } from "../ui/todo-list";


@Component({
  selector: 'app-todo',
  imports: [TodoForm, TodoList],
  template: `
    <h2>Todo</h2>
    <app-todo-form (todoSubmitted)="todoService.addTodo($event)" />
    <input type="checkbox" (change)="todoService.toggleShowCompleted()" [checked]="todoService.showCompleted()" id="showCompleted" />
    <label for="showCompleted">Show Completed</label>
    <hr />
    <app-todo-list [todos]="todoService.visibleTodos()" />
  `,
  styles: `
    h2 {
      text-align: center;
    }
  `
})
export default class TodoComponent {
  readonly todoService = inject(TodoService);
}
