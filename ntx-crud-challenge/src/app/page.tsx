import Image from "next/image";
import { Todo } from "@/lib/types";
import TodoList from "@/components/TodoList";
import { get } from "http";
import { getTodosAction } from "./actions";
import { write } from "fs";
import { writeTodos } from "@/lib/todoStore";

// Pick three random indexes from the todos array, shuffle & pick 
// fisher yates shuffle algorithm is fine since each todo has a unique id
async function PopulateTodos(length: number) {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos");
  const todos: Todo[] = await response.json();
  if (!response.ok) {
    throw new Error("Error fetching data");
  }
  if (todos.length < 3) {
    throw new Error("Not enough todos");
  }
  const indices = Array.from({ length: todos.length }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  // Double check that the resulting todos have unique ids
  const uniqueIds = new Set(todos.map((todo) => todo.id));
  if (uniqueIds.size !== todos.length) {
    throw new Error("Todos have duplicate ids");
  }
  const todolist = indices.slice(0, 3).map((index) => todos[index]);
  await writeTodos(todolist);
  return todolist;
}

export default async function MainPage() {
  try {
    let todolist = await getTodosAction();

    if (!todolist || todolist.length < 3) {
      try {
        todolist = await PopulateTodos(3);
      } catch (error) {
        console.error("Error fetching data:", error);
        return <div className="text-red-500">Error fetching data</div>;
      }
    }

    return (
      <div className="p-6">
        <h1 className="text-2xl mb-4">Todo List</h1>
        <TodoList todolist={todolist} />
      </div>
    );
  } catch (error) {
    console.error("Error collecting data:", error);
    return <div className="text-red-500">Error fetching data</div>;
  }
}