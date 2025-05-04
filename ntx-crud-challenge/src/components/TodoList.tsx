'use client';

import React, { useState } from 'react';
import { Todo } from '@/lib/types';
import { addTodoAction } from '@/app/actions';
import { readTodos, writeTodos } from '@/lib/todoStore'; // Import the server action to clear todos
import { write } from 'fs';

interface TodoListProps {
    todolist: Todo[];
}

export default function TodoList({ todolist }: TodoListProps) {
    const [todos, setTodos] = useState<Todo[]>(todolist);
    const [newTitle, setNewTitle] = useState<string>('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState<string>('');

    const addTodo = async () => {
        if (!newTitle.trim()) return;
        const newTodo: Todo = {
          userId: 1,
          id: Date.now(), // unique ID
          title: newTitle,
          completed: false,
        };
        await addTodoAction(newTodo); // Call the server action to add the todo
        setTodos(prev => [...prev, newTodo]);
        setNewTitle("");
    };

    const clearTodo = async () => {
        await writeTodos([]); // Clear the todos in the server action
        setTodos([]);
    };

    // Could be done faster if using a hasmap but would require rewrite
    const editTodo = (id: number, newTitle: string) => {
        setTodos(prev =>
            prev.map(todo => (todo.id === id ? { ...todo, title: newTitle } : todo))
        );
    };

    // More expensive to do this on server side without targeted deletions
    // Unexpected behavior if items < 3 then all are reset on repop
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
                <button onClick={addTodo} className="bg-blue-500 text-white rounded p-2 mr-2">
                    Add Todo
                </button>
                <button onClick={clearTodo} className="bg-red-500 text-white rounded p-2">
                    Clear Todos
                </button>
            </div>
            <h2 className="text-xl font-bold mb-4">Todo List</h2>
            <ul className="pl-5">
                {todos.map((todo) => (
                <li key={todo.id} className="mb-2">
                    {editingId === todo.id ? (
                    <>
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="border rounded p-1 mr-2"
                        />
                        <button
                            onClick={() => editTodo(todo.id, editTitle)}
                            className="bg-green-500 text-white rounded p-1 mr-2"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => {
                                setEditingId(null);
                                setEditTitle('');
                            }}
                            className="bg-gray-500 text-white rounded p-1"
                            >
                            Cancel
                        </button>
                    </>
                    ) : (
                    <>
                        <span className="mr-4">{todo.title}</span>
                        <button
                            onClick={() => {
                                setEditingId(todo.id);
                                setEditTitle(todo.title);
                            }}
                            className="bg-yellow-500 text-white rounded p-1 mr-2"
                            >
                            Edit
                        </button>
                        <button
                            onClick={() => deleteTodo(todo.id)}
                            className="bg-red-600 text-white rounded p-1"
                            >
                            Delete
                        </button>
                    </>
                    )}
                </li>
                ))}
            </ul>
        </div>
    );
}