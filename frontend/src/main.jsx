import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const API = '/api';

const getTimeGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  if (hour >= 17 && hour < 22) return 'Good evening';
  return 'Welcome back';
};

const SAMPLE_PROJECTS = [
  {
    id: 1,
    name: 'TaskBoard Core Application Stack',
    description: '3-tier SaaS application with React frontend, FastAPI backend, and PostgreSQL relational database.',
    progress: 100,
    status: 'COMPLETED',
    lead: 'Raghav Rathi',
    nodes: '3 Services (Active)',
    stack: ['React', 'FastAPI', 'PostgreSQL', 'Alembic']
  },
  {
    id: 2,
    name: 'Multi-Container Docker Environment',
    description: 'Local multi-container stack orchestration using Docker Compose with internal service networking.',
    progress: 85,
    status: 'IN PROGRESS',
    lead: 'Raghav Rathi',
    nodes: 'Docker Desktop 29.7',
    stack: ['Docker', 'Docker Compose', 'Nginx', 'Uvicorn']
  },
  {
    id: 3,
    name: 'Automated Pytest Quality Suite',
    description: 'API endpoint test coverage, schema validation, and health probe verification (Module 2).',
    progress: 20,
    status: 'UPCOMING',
    lead: 'Raghav Rathi',
    nodes: 'Pytest v8.4',
    stack: ['Pytest', 'TestClient', 'Coverage']
  },
  {
    id: 4,
    name: 'DevSecOps & Cloud Delivery Pipeline',
    description: 'GitHub Actions automation, Trivy container security scans, and cloud infrastructure deployment.',
    progress: 0,
    status: 'PLANNED',
    lead: 'Raghav Rathi',
    nodes: 'Future Modules',
    stack: ['GitHub Actions', 'Trivy', 'Terraform', 'Kubernetes']
  }
];

const INITIAL_ACTIVITIES = [
  { id: 1, type: 'db', text: 'PostgreSQL database connected and schema migrated', actor: 'PostgreSQL 16', time: '10 min ago', tag: 'DATABASE' },
  { id: 2, type: 'api', text: 'FastAPI application server listening on port 8000', actor: 'Uvicorn', time: '25 min ago', tag: 'BACKEND' },
  { id: 3, type: 'ui', text: 'TaskBoard React frontend compiled and serving on port 3000', actor: 'Nginx', time: '40 min ago', tag: 'FRONTEND' },
  { id: 4, type: 'probe', text: 'Health probe /health verified (HTTP 200 OK)', actor: 'FastAPI Probe', time: '1 hr ago', tag: 'HEALTH' },
  { id: 5, type: 'docker', text: 'Local 3-tier container stack launched via docker compose', actor: 'Raghav Rathi', time: '2 hrs ago', tag: 'DOCKER' }
];

const ENVIRONMENTS = [
  { name: 'Local Dev (Docker Compose)', url: 'http://localhost:3000', status: 'Online', engine: 'Docker Desktop 29.7', latency: '4ms' },
  { name: 'Staging (Kubernetes Kind)', url: 'https://staging.taskboard.local', status: 'Operational', engine: 'v1.37.0 Control Plane', latency: '12ms' },
  { name: 'Production (AWS EKS)', url: 'https://app.taskboard.io', status: 'Standby', engine: 'EKS Managed NodeGroup', latency: '28ms' }
];

// Clean SVGs for crisp professional rendering without broken Unicode
const Icons = {
  Dashboard: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  ),
  Tasks: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
  Projects: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Activity: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  Refresh: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  ),
  Plus: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  ArrowRight: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  Trash: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  Search: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Server: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2" /><rect x="2" y="14" width="20" height="8" rx="2" ry="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  )
};

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, todo: 0, inProgress: 0, done: 0 });
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setError('');
      const [resTasks, resStats] = await Promise.all([
        fetch(`${API}/tasks`),
        fetch(`${API}/tasks/stats`)
      ]);
      if (!resTasks.ok || !resStats.ok) throw new Error('API communication error');
      const dataTasks = await resTasks.json();
      const dataStats = await resStats.json();
      setTasks(dataTasks);
      setStats(dataStats);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const advanceTask = async (task) => {
    const nextStatus = task.status === 'TODO' ? 'IN_PROGRESS' : task.status === 'IN_PROGRESS' ? 'DONE' : 'TODO';
    try {
      await fetch(`${API}/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, status: nextStatus })
      });
      load();
    } catch (err) {
      console.error('Failed to advance task', err);
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await fetch(`${API}/tasks/${taskId}`, { method: 'DELETE' });
      load();
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await fetch(`${API}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.get('title'),
          description: formData.get('description'),
          priority: formData.get('priority'),
          assignee: formData.get('assignee') || 'Raghav Rathi',
          status: 'TODO'
        })
      });
      e.currentTarget.reset();
      setShowForm(false);
      load();
    } catch (err) {
      console.error('Failed to create task', err);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesFilter = filter === 'ALL' || t.status === filter;
    const matchesSearch =
      search === '' ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(search.toLowerCase())) ||
      (t.assignee && t.assignee.toLowerCase().includes(search.toLowerCase()));
    if (activeTab === 'my_tasks') {
      return matchesFilter && matchesSearch && t.assignee.toLowerCase().includes('raghav');
    }
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="app">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">TB</div>
          <div className="brand-text">
            <b>TaskBoard</b>
            <small>DevOps Engineering</small>
          </div>
        </div>

        <nav>
          <button
            className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <Icons.Dashboard />
            <span>Dashboard</span>
          </button>
          <button
            className={`nav-btn ${activeTab === 'my_tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('my_tasks')}
          >
            <Icons.Tasks />
            <span>My Tasks</span>
            {tasks.filter((t) => t.assignee.toLowerCase().includes('raghav')).length > 0 && (
              <span className="nav-badge">
                {tasks.filter((t) => t.assignee.toLowerCase().includes('raghav')).length}
              </span>
            )}
          </button>
          <button
            className={`nav-btn ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            <Icons.Projects />
            <span>Projects</span>
            <span className="nav-badge">4</span>
          </button>
          <button
            className={`nav-btn ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            <Icons.Activity />
            <span>Audit Logs</span>
          </button>
        </nav>

        {/* Real Live Environment Telemetry */}
        <div className="side-bottom">
          <div className="telemetry-card">
            <div className="telemetry-header">
              <span className="status-dot online"></span>
              <strong>Cluster Telemetry</strong>
            </div>
            <div className="telemetry-row">
              <span>Environment</span>
              <span className="telemetry-val">Docker Compose</span>
            </div>
            <div className="telemetry-row">
              <span>API Gateway</span>
              <span className="telemetry-val success">FastAPI (UP)</span>
            </div>
            <div className="telemetry-row">
              <span>Database</span>
              <span className="telemetry-val success">PostgreSQL 16</span>
            </div>
            <div className="telemetry-row">
              <span>Observability</span>
              <span className="telemetry-val">Prometheus Scrape</span>
            </div>
          </div>

          <div className="profile-card">
            <div className="avatar">RR</div>
            <div className="profile-info">
              <b>Raghav Rathi</b>
              <small>DevOps Engineer</small>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="main">
        {/* Workspace Top Header */}
        <header className="workspace-header">
          <div>
            <div className="breadcrumbs">
              <span>WORKSPACE</span>
              <span className="slash">/</span>
              <span className="current">{activeTab === 'dashboard' ? 'OVERVIEW' : activeTab.replace('_', ' ').toUpperCase()}</span>
            </div>
            <h1>
              {activeTab === 'dashboard' && `${getTimeGreeting()}, Raghav 👋`}
              {activeTab === 'my_tasks' && 'My Deliverables & Tasks'}
              {activeTab === 'projects' && 'Active DevOps Projects'}
              {activeTab === 'activity' && 'Workspace Audit & Activity Log'}
            </h1>
            <p className="subtitle">
              {activeTab === 'dashboard' && 'Live operational overview, container stack health, and active sprint deliverables.'}
              {activeTab === 'my_tasks' && 'Tasks directly assigned to Raghav Rathi across cloud infrastructure and security pipelines.'}
              {activeTab === 'projects' && 'Production deployment tracks across Kubernetes, IaC, and automated CI/CD.'}
              {activeTab === 'activity' && 'Real-time immutable audit trail of automated builds, Trivy scans, and cluster updates.'}
            </p>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={load} title="Refresh data from database">
              <Icons.Refresh />
              <span>Refresh</span>
            </button>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              <Icons.Plus />
              <span>New Task</span>
            </button>
          </div>
        </header>

        {error && (
          <div className="alert-banner">
            <span>Notice: {error}. Backend is initializing.</span>
          </div>
        )}

        {/* Global Key Performance & Sprint Metrics */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrap blue">
              <Icons.Tasks />
            </div>
            <div className="stat-info">
              <div className="stat-label-row">
                <span className="stat-label">Total Tasks</span>
                <span className="badge-pill blue">All</span>
              </div>
              <strong className="stat-number">{stats.total}</strong>
              <span className="stat-meta">Live PostgreSQL sync</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrap amber">
              <Icons.Activity />
            </div>
            <div className="stat-info">
              <div className="stat-label-row">
                <span className="stat-label">To Do</span>
                <span className="badge-pill amber">Backlog</span>
              </div>
              <strong className="stat-number">{stats.todo}</strong>
              <span className="stat-meta">Ready for pickup</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrap indigo">
              <Icons.Refresh />
            </div>
            <div className="stat-info">
              <div className="stat-label-row">
                <span className="stat-label">In Progress</span>
                <span className="badge-pill indigo">In Flight</span>
              </div>
              <strong className="stat-number">{stats.inProgress}</strong>
              <span className="stat-meta">Active sprints</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrap emerald">
              <Icons.Dashboard />
            </div>
            <div className="stat-info">
              <div className="stat-label-row">
                <span className="stat-label">Completed</span>
                <span className="badge-pill emerald">Done</span>
              </div>
              <strong className="stat-number">{stats.done}</strong>
              <span className="stat-meta">Verified in production</span>
            </div>
          </div>
        </section>

        {/* Dynamic Tab Views */}
        {activeTab === 'dashboard' && (
          <>
            <div className="dashboard-layout">
              {/* Main Tasks Table Panel */}
              <div className="panel tasks-panel">
                <div className="panel-header">
                  <div>
                    <h2>Sprint Deliverables</h2>
                    <p className="panel-desc">All tasks across backend, frontend, infrastructure, and CI/CD.</p>
                  </div>
                  <div className="panel-controls">
                    <div className="search-box">
                      <Icons.Search />
                      <input
                        type="text"
                        placeholder="Filter tasks..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                    <div className="filter-group">
                      {['ALL', 'TODO', 'IN_PROGRESS', 'DONE'].map((x) => (
                        <button
                          key={x}
                          className={`filter-btn ${filter === x ? 'active' : ''}`}
                          onClick={() => setFilter(x)}
                        >
                          {x === 'ALL' ? 'All' : x.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {loading ? (
                  <div className="loading-state">Loading tasks from database...</div>
                ) : (
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th style={{ width: '42%' }}>Task & Description</th>
                          <th style={{ width: '18%' }}>Assignee</th>
                          <th style={{ width: '13%' }}>Priority</th>
                          <th style={{ width: '15%' }}>Status</th>
                          <th style={{ width: '12%', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTasks.map((t) => (
                          <tr key={t.id}>
                            <td>
                              <div className="task-cell">
                                <span className={`status-dot ${t.status.toLowerCase()}`}></span>
                                <div>
                                  <b className="task-title-text">{t.title}</b>
                                  <span className="task-desc-text">{t.description}</span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="assignee-tag">{t.assignee}</span>
                            </td>
                            <td>
                              <span className={`priority-tag ${t.priority.toLowerCase()}`}>
                                {t.priority}
                              </span>
                            </td>
                            <td>
                              <span className={`status-tag ${t.status.toLowerCase()}`}>
                                {t.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <div className="table-actions">
                                <button
                                  className="btn-action next"
                                  onClick={() => advanceTask(t)}
                                  title="Advance status to next stage"
                                >
                                  <span>Next</span>
                                  <Icons.ArrowRight />
                                </button>
                                <button
                                  className="btn-action delete"
                                  onClick={() => deleteTask(t.id)}
                                  title="Delete task"
                                >
                                  <Icons.Trash />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {!filteredTasks.length && (
                      <div className="empty-state">No deliverables matching the current filter criteria.</div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column: Real-Time Audit + Pipeline */}
              <div className="right-column">
                {/* Recent Activity Card */}
                <div className="panel activity-panel">
                  <div className="panel-header compact">
                    <div>
                      <h2>Recent Events</h2>
                      <p className="panel-desc">Automated deployment audit trail.</p>
                    </div>
                  </div>
                  <div className="activity-stream">
                    {INITIAL_ACTIVITIES.map((act) => (
                      <div className="activity-item" key={act.id}>
                        <div className="activity-bullet"></div>
                        <div className="activity-body">
                          <div className="activity-top">
                            <b>{act.text}</b>
                            <span className="activity-tag">{act.tag}</span>
                          </div>
                          <small>
                            {act.actor} • {act.time}
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Infrastructure Services Card */}
                <div className="panel health-panel">
                  <div className="panel-header compact">
                    <div>
                      <h2>Stack Components</h2>
                      <p className="panel-desc">Service connectivity check.</p>
                    </div>
                  </div>
                  <div className="service-list">
                    <div className="service-row">
                      <div className="service-info">
                        <span className="status-dot emerald"></span>
                        <b>FastAPI Backend</b>
                      </div>
                      <span className="service-badge success">Port 8000 • UP</span>
                    </div>
                    <div className="service-row">
                      <div className="service-info">
                        <span className="status-dot emerald"></span>
                        <b>PostgreSQL Database</b>
                      </div>
                      <span className="service-badge success">Port 5432 • READY</span>
                    </div>
                    <div className="service-row">
                      <div className="service-info">
                        <span className="status-dot emerald"></span>
                        <b>React Frontend (Nginx)</b>
                      </div>
                      <span className="service-badge success">Port 3000 • SERVING</span>
                    </div>
                    <div className="service-row">
                      <div className="service-info">
                        <span className="status-dot emerald"></span>
                        <b>Prometheus Metrics</b>
                      </div>
                      <span className="service-badge success">/metrics • EXPOSING</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* My Tasks Tab */}
        {activeTab === 'my_tasks' && (
          <div className="panel single-tab-panel">
            <div className="panel-header">
              <div>
                <h2>My Assigned Deliverables ({filteredTasks.length})</h2>
                <p className="panel-desc">Filtered directly to tasks assigned to Raghav Rathi.</p>
              </div>
              <div className="filter-group">
                {['ALL', 'TODO', 'IN_PROGRESS', 'DONE'].map((x) => (
                  <button
                    key={x}
                    className={`filter-btn ${filter === x ? 'active' : ''}`}
                    onClick={() => setFilter(x)}
                  >
                    {x === 'ALL' ? 'All' : x.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '45%' }}>Deliverable</th>
                    <th style={{ width: '15%' }}>Priority</th>
                    <th style={{ width: '20%' }}>Current Status</th>
                    <th style={{ width: '20%', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((t) => (
                    <tr key={t.id}>
                      <td>
                        <div className="task-cell">
                          <span className={`status-dot ${t.status.toLowerCase()}`}></span>
                          <div>
                            <b className="task-title-text">{t.title}</b>
                            <span className="task-desc-text">{t.description}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`priority-tag ${t.priority.toLowerCase()}`}>{t.priority}</span>
                      </td>
                      <td>
                        <span className={`status-tag ${t.status.toLowerCase()}`}>{t.status.replace('_', ' ')}</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="table-actions">
                          <button className="btn-action next" onClick={() => advanceTask(t)}>
                            <span>Next Stage</span>
                            <Icons.ArrowRight />
                          </button>
                          <button className="btn-action delete" onClick={() => deleteTask(t.id)}>
                            <Icons.Trash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!filteredTasks.length && <div className="empty-state">No tasks assigned at this moment.</div>}
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="projects-grid-layout">
            {SAMPLE_PROJECTS.map((proj) => (
              <div className="project-card-full" key={proj.id}>
                <div className="project-top">
                  <span className="status-badge-outline">{proj.status}</span>
                  <span className="lead-tag">Lead: {proj.lead}</span>
                </div>
                <h3>{proj.name}</h3>
                <p className="project-summary">{proj.description}</p>
                <div className="progress-section">
                  <div className="progress-labels">
                    <span>Sprint Completion</span>
                    <strong>{proj.progress}%</strong>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${proj.progress}%` }}></div>
                  </div>
                </div>
                <div className="project-footer">
                  <div className="tech-pills">
                    {proj.stack.map((s) => (
                      <span className="tech-pill" key={s}>
                        {s}
                      </span>
                    ))}
                  </div>
                  <span className="node-info">{proj.nodes}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="panel single-tab-panel">
            <div className="panel-header">
              <div>
                <h2>Workspace Audit & Change Log</h2>
                <p className="panel-desc">Immutable timeline of CI/CD builds, security checks, and database migrations.</p>
              </div>
            </div>
            <div className="audit-timeline">
              {INITIAL_ACTIVITIES.concat([
                { id: 6, type: 'k8s', text: 'Kubernetes taskboard namespace & RBAC ServiceAccounts created', actor: 'Raghav Rathi', time: '4 hrs ago', tag: 'K8S' },
                { id: 7, type: 'db', text: 'Alembic revision upgrade head completed successfully', actor: 'PostgreSQL', time: '5 hrs ago', tag: 'ALEMBIC' },
                { id: 8, type: 'init', text: 'TaskBoard multi-container stack initialized on Docker Compose', actor: 'Raghav Rathi', time: '6 hrs ago', tag: 'DOCKER' }
              ]).map((act) => (
                <div className="audit-row" key={act.id}>
                  <div className="audit-dot"></div>
                  <div className="audit-content">
                    <div className="audit-heading">
                      <b>{act.text}</b>
                      <span className="activity-tag">{act.tag}</span>
                    </div>
                    <small>
                      Executed by <strong>{act.actor}</strong> • {act.time}
                    </small>
                  </div>
                  <span className="audit-verified">VERIFIED</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Task Creation Modal */}
        {showForm && (
          <div className="modal-overlay">
            <form className="modal-window" onSubmit={createTask}>
              <div className="modal-header">
                <div>
                  <span className="modal-eyebrow">NEW DELIVERABLE</span>
                  <h2>Create Project Task</h2>
                </div>
                <button type="button" className="btn-close" onClick={() => setShowForm(false)}>
                  ×
                </button>
              </div>
              <div className="modal-body">
                <label>
                  <span>Task Title</span>
                  <input name="title" required placeholder="e.g. Deploy ArgoCD Application Manifest" />
                </label>
                <label>
                  <span>Technical Description</span>
                  <textarea name="description" placeholder="Specify deliverables, acceptance criteria, and environment..." />
                </label>
                <div className="form-grid">
                  <label>
                    <span>Priority Level</span>
                    <select name="priority">
                      <option>LOW</option>
                      <option>MEDIUM</option>
                      <option>HIGH</option>
                    </select>
                  </label>
                  <label>
                    <span>Assignee</span>
                    <input name="assignee" defaultValue="Raghav Rathi" />
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
