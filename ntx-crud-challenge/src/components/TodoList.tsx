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
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all'); 
    const [searchQuery, setSearchQuery] = useState<string>(''); 
    const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null); // State to hold the selected todo for editing

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

    // Could be done faster if using a hashmap but would require rewrite
    const editTodo = async (id: number, newTitle: string) => {
        if (!newTitle.trim()) return;
        const updatedTodo = todos.map(todo =>
            todo.id === id ? { ...todo, title: newTitle } : todo
        );
        await writeTodos(updatedTodo); 
        setTodos(updatedTodo);
        setEditingId(null);
        setEditTitle('');
    };

    // Same as above, could be done faster if using a hashmap but would require rewrite
    const toggleCompleted = async (id: number) => {
        const updatedTodo = todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        await writeTodos(updatedTodo);
        setTodos(updatedTodo);
    }

    // More expensive to do this on server side without targeted deletions... again hashmap would be better
    // Unexpected behavior if items < 3 then all are reset on repop
    const deleteTodo = async (id: number) => {
        // TODO Try to throw a better error if the todo is not found
        const updatedTodos = todos.filter(todo => todo.id !== id);
        await writeTodos(updatedTodos); // Call the server action to delete the todo
        setTodos(updatedTodos);
    };

    const filteredTodos = todos.filter(todo => {
        if (filter === 'active') return !todo.completed;
        else if (filter === 'completed') return todo.completed;
        return true; 
    }).filter(todo => {
        if (searchQuery) return todo.title.toLowerCase().includes(searchQuery.toLowerCase());
        return true;
    });

    // Enchancment: Dynamically expand slice size based on screen size
    return (
        <div className="bg-gray-800 p-4 min-h-screen text-white flex flex-col">
            <div className="mb-4">
                <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Add a new todo"
                    className="border rounded p-2 mr-2"
                />
                <button onClick={addTodo} className="border border-black-400 bg-emerald-700 text-white rounded p-2 mr-2">
                    Add Todo
                </button>
                <button onClick={clearTodo} className="border border-black-400 bg-rose-900 text-white rounded p-2 mr-2">
                    Clear Todos
                </button>
            </div>
            <div className="mb-4">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search todos"
                    className="border rounded p-2 mr-2"
                />
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'completed')}
                    className="border rounded p-2"
                >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                </select>
            </div>
            <h2 className="text-xl font-bold mb-4">Todo List</h2>
            
            {filteredTodos.map((todo) => (
                <div className='flex items-center justify-between mb-4' key={todo.id}>
                    <div key={todo.id} className="flex justify-between items-start gap-4">
                        {editingId === todo.id ? (
                            <>
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className='border rounded p-1 mr-2'
                                />
                            </>
                        ) : (
                            <span className={`mr-4 break-words whitespace-normal ${todo.completed ? 'line-through' : ''}`}>
                                {todo.title.length > 60 ? (
                                    <>
                                    {todo.title.slice(0, 60)}...{' '}
                                    <button
                                        className="text-emerald-700 hover:text-emerald-500"
                                        onClick={() => {
                                            setSelectedTodo(todo);
                                        }}
                                    >
                                        Read More
                                    </button>
                                    </>
                                ) : (
                                    todo.title
                                )}
                            </span>
                        )}
                    </div>
                    <div className="text-right">
                        {editingId === todo.id ? (
                            <>
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
                                <button
                                    onClick={() => toggleCompleted(todo.id)}
                                    className="bg-blue-800 text-white rounded p-1 mr-2"
                                >
                                    {todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
                                </button>
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
                                    className="bg-rose-900 text-white rounded p-1"
                                >
                                    Delete
                                </button>
                            </>
                        )}
                    </div>
                </div>
            ))}
            {selectedTodo && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-grey-700 p-4 rounded shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-bold mb-2">{selectedTodo.completed === true ? "Completed" : "Incomplete"}</h2>
                        <p className='mr-4 break-words whitespace-normal'>{selectedTodo.title}</p>
                        <button
                            onClick={() => setSelectedTodo(null)}
                            className="mt-4 bg-rose-500 text-white rounded p-1"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}