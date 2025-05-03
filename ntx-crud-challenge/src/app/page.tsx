import Image from "next/image";
import { Todo } from "@/lib/types";

export default async function MainPage() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    const todos: Todo[] = await response.json();
    if (!response.ok) {
      return <div className="text-red-500">Error fetching data</div>;
    }
    // Pick three random indexes from the todos array, shuffle & pick 
    // fisher yates shuffle algorithm is fine since each todo has a unique id
    const indices = Array.from({ length: todos.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    // Double check that the todos have unique ids
    const uniqueIds = new Set(todos.map((todo) => todo.id));
    if (uniqueIds.size !== todos.length) {
      return <div className="text-red-500">Error: Todos have duplicate ids</div>;
    }
    const todolist = indices.slice(0, 3).map((index) => todos[index]);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black-100">
        <h1 >Random Todos</h1>
        <ul >
          {todolist.map((todo) => (
            <li key={todo.id} className="mb-2">
              <span className="ml-2 text-grey-500">{todo.title}</span>
              <span className={`ml-2 ${todo.completed ? "text-green-500" : "text-red-500"}`}>
                {todo.completed ? "Completed" : "Not Completed"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return <div className="text-red-500">Error fetching data</div>;
  }
}