"use client";
import { useEffect, useState } from "react";

type Todo = {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  // --- データを取得する ---
  const fetchTodos = async () => {
    const res = await fetch("http://localhost:8000/todos");
    const data = await res.json();
    setTodos(data);
  };

  // --- タスクを追加する ---
  const addTodo = async () => {
    if (!newTodo.trim()) return; // 空文字防止

    const res = await fetch("http://localhost:8000/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: Math.floor(Math.random() * 10000),
        title: newTodo,
        completed: false,
      }),
    });

    if (res.ok) {
      setNewTodo("");
      fetchTodos();
    }
  };

  // --- タスクを削除する ---
  const deleteTodo = async (id: number) => {
    await fetch(`http://localhost:8000/todos/${id}`, {
      method: "DELETE",
    });
    fetchTodos();
  };

  // --- 完了状態を切り替える ---
  const toggleComplete = async (todo: Todo) => {
    await fetch(`http://localhost:8000/todos/${todo.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...todo,
        completed: !todo.completed,
      }),
    });
    fetchTodos();
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">ToDoリスト</h1>

      <div className="mb-6 flex gap-2">
        <input
          className="flex-1 border px-2 py-1 rounded"
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="新しいタスクを入力"
        />
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded"
          onClick={addTodo}
        >
          追加
        </button>
      </div>

      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded"
          >
            <div
              className={`flex-1 cursor-pointer ${
                todo.completed ? "line-through text-gray-500" : ""
              }`}
              onClick={() => toggleComplete(todo)}
            >
              {todo.title}
            </div>
            <button
              className="text-red-500 hover:underline ml-4"
              onClick={() => deleteTodo(todo.id)}
            >
              削除
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
