// App.jsx
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TaskManager from './components/TaskManager';
import APISection from './components/APISection';
import ThemeProvider from './context/ThemeContext';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Navbar />

        <main className="flex-grow max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <TaskManager />

          <div className="mt-8 bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">API Data</h2>
            <APISection />
          </div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;

// components/Navbar.jsx
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export default function Navbar() {
  const { toggleTheme } = useContext(ThemeContext);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">PLP Task Manager</h1>
      <button
        onClick={toggleTheme}
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Toggle Theme
      </button>
    </nav>
  );
}

// components/Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} PLP Task Manager. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

// components/TaskManager.jsx
import { useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

export default function TaskManager() {
  const [tasks, setTasks] = useLocalStorage('tasks', []);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all');

  const addTask = () => {
    if (!newTask) return;
    setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
    setNewTask('');
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const filteredTasks = tasks.filter(t =>
    filter === 'active' ? !t.completed : filter === 'completed' ? t.completed : true
  );

  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Task Manager</h2>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-grow p-2 rounded border dark:bg-gray-700"
          placeholder="New task..."
        />
        <button
          onClick={addTask}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >Add</button>
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={() => setFilter('all')} className="btn">All</button>
        <button onClick={() => setFilter('active')} className="btn">Active</button>
        <button onClick={() => setFilter('completed')} className="btn">Completed</button>
      </div>

      <ul className="space-y-2">
        {filteredTasks.map(task => (
          <li key={task.id} className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-2 rounded">
            <span className={task.completed ? 'line-through text-gray-500' : ''}>{task.text}</span>
            <div className="flex gap-2">
              <button onClick={() => toggleComplete(task.id)} className="text-sm text-blue-500 hover:underline">Done</button>
              <button onClick={() => deleteTask(task.id)} className="text-sm text-red-500 hover:underline">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// components/APISection.jsx
import { useState, useEffect } from 'react';

export default function APISection() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts?_limit=5')
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  return (
    <ul className="space-y-4">
      {data.map(post => (
        <li key={post.id} className="p-4 bg-gray-100 dark:bg-gray-700 rounded shadow">
          <h3 className="font-semibold text-lg">{post.title}</h3>
          <p>{post.body}</p>
        </li>
      ))}
    </ul>
  );
}

// hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// context/ThemeContext.jsx
import { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// styles: Add a global class in App.css
.btn {
  @apply px-3 py-1 bg-gray-300 dark:bg-gray-600 text-sm rounded hover:bg-gray-400 dark:hover:bg-gray-500;
}

export default App; 
