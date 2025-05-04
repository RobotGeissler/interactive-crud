'use client';

import React, { useState } from 'react';
import { Todo } from '../lib/types';

interface TodoListProps {
    todolist: Todo[];
}

export default function TodoList({ todolist }: TodoListProps) {
    const [todos, setTodos] = useState<Todo[]>(todolist);
    const [newTitle, setNewTitle] = useState<string>('');

    const addTodo = () => {
        if (!newTitle.trim()) return;
        const newTodo: Todo = {
          userId: 1,
          id: Date.now(), // unique ID
          title: newTitle,
          completed: false,
        };
        setTodos(prev => [...prev, newTodo]);
        setNewTitle("");
    };

    const editTodo = (id: number, newTitle: string) => {
        setTodos(prev =>
            prev.map(todo => (todo.id === id ? { ...todo, title: newTitle } : todo))
        );
    };

    const deleteTodo = (id: number) => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
    };

    return (
        <div className="bg-blue-800 p-4">
            <div className="mb-4">
                <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Add a new todo"
                    className="border rounded p-2 mr-2"
                />
                <button onClick={addTodo} className="bg-blue-500 text-white rounded p-2">
                    Add Todo
                </button>
            </div>
            <h2 className="text-xl font-bold mb-4">Todo List</h2>
            <ul className="pl-5 mb-4">
                {todos.map((todo) => (
                    <li key={todo.id} className="mb-2">
                        <span className={todo.completed ? 'line-through' : ''}>
                            {todo.title}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}