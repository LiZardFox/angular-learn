import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TodoCurrent } from '../data-access/todo-current';

@Component({
  selector: 'app-todo-detail',
  imports: [RouterLink],
  template: `
    <div class="todo-detail-container">
      <h2 class="page-title">Todo Detail</h2>
      @if (todo()){
        <div class="todo-card">
          <h3 class="todo-title">{{ todo()!.title }}</h3>
          <p class="todo-description">{{ todo()!.description }}</p>
          <div class="todo-status">
            <span class="status-label">Status:</span>
            <span class="status-badge" [class.completed]="todo()!.completed" [class.pending]="!todo()!.completed">
              {{ todo()!.completed ? 'Completed' : 'Pending' }}
            </span>
          </div>
          <div class="todo-actions">
            <button 
              class="toggle-button" 
              [class.complete-btn]="!todo()!.completed"
              [class.uncomplete-btn]="todo()!.completed"
              (click)="todoService.completeTodo(todo()!.id)">
              {{ todo()!.completed ? 'Mark as Pending' : 'Mark as Completed' }}
            </button>
            <a 
              class="toggle-button edit-btn"
            [routerLink]="['/todo', 'edit', todo()!.id]"
            >Edit</a>
            <button
            type="button"
            class="toggle-button delete-btn"
            (click)="handleDelete()"
            >
              Delete Todo
            </button>
          </div>
        </div>
      }
      @else { 
        <div class="no-todo">
          <p>No todo selected</p>
        </div>
      }
    </div>
  `,
  styles: `
    .todo-detail-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 2rem;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .page-title {
      color: #333;
      margin-bottom: 2rem;
      text-align: center;
      font-size: 2rem;
    }

    .todo-card {
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 2rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .todo-title {
      color: #495057;
      margin-bottom: 1rem;
      font-size: 1.5rem;
      border-bottom: 2px solid #dee2e6;
      padding-bottom: 0.5rem;
    }

    .todo-description {
      color: #6c757d;
      font-size: 1.1rem;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .todo-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }

    .status-label {
      font-weight: 600;
      color: #495057;
    }

    .status-badge {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-weight: 500;
      text-transform: uppercase;
      font-size: 0.875rem;
    }

    .status-badge.completed {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .status-badge.pending {
      background-color: #fff3cd;
      color: #856404;
      border: 1px solid #ffeaa7;
    }

    .todo-actions {
      text-align: center;
    }

    .toggle-button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .complete-btn {
      background-color: #28a745;
      color: white;
    }

    .complete-btn:hover {
      background-color: #218838;
    }

    .uncomplete-btn {
      background-color: #ffc107;
      color: #212529;
    }

    .uncomplete-btn:hover {
      background-color: #e0a800;
    }

    .delete-btn {
      background-color: #dc3545;
      color: white;
      margin-left: 1rem;
    }

    .delete-btn:hover {
      background-color: #c82333;
    }

    .edit-btn {
      background-color: #007bff;
      color: white;
      margin-left: 1rem;
      text-decoration: none;
    }

    .edit-btn:hover {
      background-color: #0069d9;
    }

    .no-todo {
      text-align: center;
      padding: 3rem;
      color: #6c757d;
      font-style: italic;
    }
  `
})
export default class TodoDetail extends TodoCurrent {
  router = inject(Router);

  handleDelete() {
    this.todoService.deleteTodo(this.todo()!.id);
    this.router.navigate(['/todo']);
  }
}
