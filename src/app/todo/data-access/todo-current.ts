import { computed, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { TodoService } from "./todo.service";
import { ActivatedRoute } from "@angular/router";

export abstract class TodoCurrent {
    todoService = inject(TodoService);
    route = inject(ActivatedRoute);

    params = toSignal(this.route.paramMap);

    todo = computed(() => {
        const id = +(this.params()?.get('id') || 0);
        return this.todoService.getTodoById(id);
    });
}