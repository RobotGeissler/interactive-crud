'use client';

import React, { useState } from 'react';
import { Todo } from '../lib/types';

interface TodoListProps {
    todolist: Todo[];
}

export default function TodoList({ todolist }: TodoListProps) {
    const [todos, setTodos] = useState<Todo[]>(todolist);
    const [newTitle, setNewTitle] = useState<string>('');
    return (
        <div className="bg-blue-800 rounded-lg p-4">
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