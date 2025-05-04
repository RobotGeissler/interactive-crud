'use server';
import { promises as fs } from 'fs';
import path from 'path';
import { Todo } from './types';

const todosFilePath = path.join(process.cwd(), 'data', 'todos.json');

export async function readTodos(): Promise<Todo[]> {
  try {
    const data = await fs.readFile(todosFilePath, 'utf-8');
    return JSON.parse(data) as Todo[];
  } catch (error) {
    console.error('Error reading todos file:', error);
    return [];
  }
}

export async function writeTodos(todos: Todo[]): Promise<void> {
  try {
    await fs.writeFile(todosFilePath, JSON.stringify(todos, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing todos file:', error);
  }
}