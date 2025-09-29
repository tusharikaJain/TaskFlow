import React, { useEffect, useState } from 'react';
import API from '../api';
import TaskForm from '../components/TaskForm';
import dayjs from 'dayjs';
import './Dashboard.css'; // We'll create this CSS file for animations and layout

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await API.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      setMessage('Failed fetching tasks');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchTasks(); }, []);

  const createTask = async (data) => {
    try {
      const res = await API.post('/tasks', data);
      setTasks(prev => [res.data, ...prev]);
      setMessage('Task created');
    } catch (err) {
      console.error(err);
      setMessage('Create failed');
    }
  };

  const updateTask = async (taskData) => {
    try {
      const res = await API.put(`/tasks/${editing._id}`, taskData);
      setTasks(prev => prev.map(t => t._id === res.data._id ? res.data : t));
      setEditing(null);
      setMessage('Task updated');
    } catch (err) {
      console.error(err);
      setMessage('Update failed');
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(prev => prev.filter(t => t._id !== id));
      setMessage('Task deleted');
    } catch (err) {
      console.error(err);
      setMessage('Delete failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <nav className="dashboard-navbar">
        <h2 className="dashboard-logo">TaskMaster</h2>
        <button onClick={logout} className="btn-logout">Logout</button>
      </nav>

      {/* Header */}
      <header className="dashboard-header">
        <h1 className="dashboard-title">Welcome Back! 🎉</h1>
        <p className="dashboard-subtitle">Manage your tasks efficiently</p>
      </header>

      {/* Toast Message */}
      {message && (
        <div className="dashboard-toast">
          {message}
          <button className="toast-close" onClick={() => setMessage('')}>✖</button>
        </div>
      )}

      {/* Create Task */}
      <div className="create-task-section">
        <button className="btn-toggle-create" onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? 'Hide Form' : 'Create Task'}
        </button>
        <div className={`create-task-form ${showCreate ? 'slide-down' : 'slide-up'}`}>
          <TaskForm onSubmit={createTask} />
        </div>
      </div>

      {/* Tasks */}
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="tasks-grid">
          {tasks.length === 0 && <div className="empty-tasks">No tasks yet</div>}
          {tasks.map((task, idx) => (
            <div key={task._id} className="task-card" style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="task-info">
                <h4>{task.title} <span className="task-priority">({task.priority})</span></h4>
                <p>{task.description}</p>
                <div className="task-meta">
                  Status: {task.status} • Due: {task.dueDate ? dayjs(task.dueDate).format('DD MMM YYYY') : '—'}
                </div>
              </div>
              <div className="task-actions">
                <button className="btn-edit" onClick={() => setEditing(task)}>Edit</button>
                <button className="btn-delete" onClick={() => deleteTask(task._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div className="modal-backdrop">
          <div className="modal-content slide-modal">
            <h3>Edit Task</h3>
            <TaskForm initial={editing} onSubmit={updateTask} />
            <div className="modal-footer">
              <button className="btn-close" onClick={() => setEditing(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
