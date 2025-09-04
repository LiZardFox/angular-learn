import { Component, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateTodo, Todo } from '../interfaces/todo.interface';

@Component({
  selector: 'app-todo-form',
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="todoForm" (ngSubmit)="handleSubmit()" class="todo-form">
      <div class="form-group">
        <input
          type="text"
          placeholder="Enter todo title..."
          formControlName="title"
          class="form-input"
        />
      </div>
      <div class="form-group">
        <textarea
          placeholder="Enter description (optional)..."
          formControlName="description"
          class="form-textarea"
          rows="3"
        ></textarea>
      </div>
      <button type="submit" [disabled]="!todoForm.valid" class="submit-btn">
        {{ actionLabel() }}
      </button>
    </form>
  `,
  styles: `
    .todo-form {
      max-width: 500px;
      margin: 0 auto;
      padding: 2rem;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-input,
    .form-textarea {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.2s ease;
      font-family: inherit;
    }

    .form-input:focus,
    .form-textarea:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-textarea {
      resize: vertical;
      min-height: 80px;
    }

    .submit-btn {
      width: 100%;
      padding: 0.75rem 1.5rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .submit-btn:hover:not(:disabled) {
      background: #2563eb;
    }

    .submit-btn:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }
  `,
})
export class TodoForm implements OnInit {
  private fb = inject(FormBuilder);
  actionLabel = input<string>('Add Todo');
  todo = input<Todo | null>(null);

  todoSubmitted = output<CreateTodo>();

  protected todoForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: [''],
  });

  ngOnInit(): void {
    if (this.todo()) {
      this.todoForm.reset(this.todo()!);
    }
  }

  handleSubmit() {
    if (this.todoForm.valid) {
      const newTodo: CreateTodo = {
        ...this.todoForm.getRawValue(),
      };
      this.todoSubmitted.emit(newTodo);
      this.todoForm.reset();
    }
  }
}
