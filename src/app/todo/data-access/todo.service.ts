import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { CreateTodo, Todo } from '../interfaces/todo.interface';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  #todos = signal<Todo[]>([]);
  #showCompleted = signal(true);

  showCompleted = this.#showCompleted.asReadonly();
  
  todos = this.#todos.asReadonly();

  visibleTodos = computed(() =>
    this.#showCompleted()
      ? this.#todos()
      : this.#todos().filter(todo => !todo.completed)
  );

  toggleShowCompleted() {
    this.#showCompleted.update(show => !show);
  }

  addTodo(todo: CreateTodo) {
    const newId = this.#todos().length ? Math.max(...this.#todos().map(t => t.id)) + 1 : 1;
    const newTodo: Todo = { id: newId, completed: false, ...todo };
    this.#todos.update(todos => [...todos, newTodo]);
  }

  deleteTodo(id: Todo['id']) {
    this.#todos.update(todos => todos.filter(todo => todo.id !== id));
  }

  updateTodo(id: Todo['id'], updatedFields: Partial<CreateTodo>) {
    this.#todos.update(todos =>
      todos.map(todo =>
        todo.id === id ? { ...todo, ...updatedFields } : todo
      )
    );
  }

  getTodoById(id: number) {
    return this.#todos().find(todo => todo.id === id) || null;
  }

  completeTodo(id: Todo['id']) {
    this.#todos.update(todos =>
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  constructor() {
    this.loadFromSessionStorage();
    effect(() => {
      this.saveToSessionStorage();
    });
  }

  private loadFromSessionStorage() {
    const savedTodos = sessionStorage.getItem('todos');
    if (savedTodos) {
      try {
        const todos = JSON.parse(savedTodos) as Todo[];
        this.#todos.set(todos);
      } catch (error) {
        console.error('Failed to parse todos from sessionStorage:', error);
      }
    }
  }

  private saveToSessionStorage() {
    sessionStorage.setItem('todos', JSON.stringify(this.#todos()));
  }
}
