'use server';

import { readTodos, writeTodos } from "@/lib/todoStore";
import { Todo } from "@/lib/types";

export async function getTodosAction(): Promise<Todo[]> {
    const todos = await readTodos();
    return todos;
}

export async function addTodoAction(newTodo: Todo): Promise<Todo[]> {
    const todos = await readTodos();
    todos.push(newTodo);
    await writeTodos(todos);
    return todos;
}