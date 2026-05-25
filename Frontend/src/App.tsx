import { useEffect, useState } from 'react';
import './App.css';

interface TodoTask {
  id: number;
  description: string;
  isComplete: boolean;
  createdAt: string;
}

const backendUrl = `${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5047'}/api/tasks`;

function App() {
  const [tasks, setTasks] = useState<TodoTask[]>([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadTasks = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(backendUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.status}`);
      }
      const data: TodoTask[] = await response.json();
      setTasks(data);
    } catch (err) {
      setError('Unable to load tasks. Please check backend availability.');
      console.error('Load tasks error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleSubmitTask = async (event: React.FormEvent) => {
    event.preventDefault();
    const description = userInput.trim();
    if (!description) return;

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, isComplete: false }),
      });

      if (!response.ok) {
        throw new Error('Could not save task.');
      }

      const newTask = await response.json();
      setTasks((prev) => [...prev, newTask]);
      setUserInput('');
    } catch (err) {
      setError('Could not add task. Please try again.');
      console.error('Submit task error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleTaskCompletion = async (task: TodoTask) => {
    try {
      const response = await fetch(`${backendUrl}/${task.id}/toggle`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Toggle failed');
      }

      const updatedTask = await response.json();
      setTasks((prev) => prev.map((item) => (item.id === updatedTask.id ? updatedTask : item)));
    } catch (err) {
      setError('Unable to update task completion.');
      console.error('Toggle completion error:', err);
    }
  };

  const deleteTask = async (taskId: number) => {
    if (!confirm('Delete this task?')) return;
    try {
      const response = await fetch(`${backendUrl}/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (err) {
      setError('Unable to delete task.');
      console.error('Delete task error:', err);
    }
  };

  return (
    <main className="app-shell">
      <section className="task-panel">
        <h1>Full-Stack Task Tracker</h1>
        <p className="subtitle">Add tasks, mark them complete, and remove them in real time.</p>

        <form className="task-form" onSubmit={handleSubmitTask}>
          <input
            className="task-input"
            type="text"
            value={userInput}
            placeholder="Enter a new task..."
            onChange={(event) => setUserInput(event.target.value)}
            disabled={submitting}
          />
          <button className="task-button" type="submit" disabled={submitting || !userInput.trim()}>
            {submitting ? 'Adding...' : 'Add'}
          </button>
        </form>

        {error && (
          <div className="error-banner" role="alert" aria-live="assertive">
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading" aria-live="polite">
            Loading tasks...
          </div>
        ) : (
          <ul className="task-list" role="list">
            {tasks.length === 0 ? (
              <li className="empty-state" role="listitem">No tasks yet. Add one above.</li>
            ) : (
              tasks.map((task) => (
                <li key={task.id} className={`task-card ${task.isComplete ? 'completed' : ''}`} role="listitem">
                  <div>
                    <div className="task-label">
                      <span className="task-id">#{task.id}</span>
                      <span>{task.description}</span>
                    </div>
                    <div className="task-meta">Created {new Date(task.createdAt).toLocaleString()}</div>
                  </div>

                  <div className="task-actions">
                    <button
                      type="button"
                      onClick={() => toggleTaskCompletion(task)}
                      aria-pressed={task.isComplete}
                      aria-label={task.isComplete ? `Mark task ${task.id} as not complete` : `Mark task ${task.id} complete`}
                    >
                      {task.isComplete ? 'Undo' : 'Complete'}
                    </button>
                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => deleteTask(task.id)}
                      aria-label={`Delete task ${task.id}`}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;