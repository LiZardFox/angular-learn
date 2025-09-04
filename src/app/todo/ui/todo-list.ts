import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Todo } from '../interfaces/todo.interface';

@Component({
  selector: 'app-todo-list',
  imports: [RouterLink],
  template: `
    <h2>Todo List</h2>
    <ul>
    @for (todo of todos(); track todo.id) {
      <li [class.completed]="todo.completed"><a [routerLink]="[todo.id]">{{todo.title}}</a></li>
    }
    </ul>
  `,
  styles: `ul {
      list-style-type: none;
      padding: 0;
      max-width: 400px;
      margin: 0 auto;
    }
    
    li {
      margin: 8px 0;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background-color: #f9f9f9;
      transition: all 0.2s ease;
    }
    
    li.completed {
      background-color: #e8f5e8;
      border-color: #28a745;
      opacity: 0.7;
    }
    
    a {
      text-decoration: none;
      color: #333;
      font-weight: 500;
    }
    
    a:hover {
      color: #007bff;
    }
    
    li.completed a:hover {
      color: #28a745;
    }`
})
export class TodoList {
  todos = input<Todo[]>([]);
}
