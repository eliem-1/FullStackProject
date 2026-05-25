import { useState, useEffect } from 'react';

interface TodoTask {
  id?: number;
  description: string;
}

function App() {
  const [tasks, setTasks] = useState<TodoTask[]>([]);
  const [userInput, setUserInput] = useState('');

  // 🔄 Connected directly to your .NET backend port!
  const backendUrl = 'http://localhost:5047/api/tasks';

  // Fetch tasks automatically when the web page opens
  useEffect(() => {
    fetch(backendUrl)
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  // Send a new task item back to our .NET array via HTTP POST
  const handleSubmitTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newTaskObject: TodoTask = { description: userInput };

    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTaskObject),
      });

      if (response.ok) {
        const savedTaskFromServer = await response.json();
        // Add the new task instantly to our screen
        setTasks([...tasks, savedTaskFromServer]);
        setUserInput(''); // Clear the text input box
      }
    } catch (error) {
      console.error("Error saving task item:", error);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', fontFamily: 'system-ui, sans-serif' }}>
      <h2>Full-Stack Task Tracker</h2>
      
      {/* Task input form */}
      <form onSubmit={handleSubmitTask} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="text" 
          value={userInput} 
          placeholder="Enter a new chore..."
          onChange={(e) => setUserInput(e.target.value)}
          style={{ flexGrow: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>Add Task</button>
      </form>

      {/* Bulleted data output list */}
      <ul style={{ padding: 0, listStyleType: 'none' }}>
        {tasks.map((task) => (
          <li key={task.id} style={{ padding: '10px', borderBottom: '1px solid #eee', background: '#f9f9f9', marginBottom: '5px' }}>
            <strong>{task.id}.</strong> {task.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;