import { useState, useEffect, useCallback } from "react";
import { Navbar } from "../components/Navbar";
import { TaskCard } from "../components/TaskCard";
import { TaskForm } from "../components/TaskForm";
import { taskService } from "../services/task.service";
import { milestoneService } from "../services/milestone.service";
import { useRealTimeTasks } from "../hooks/useRealTimeTasks";

export function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [filter, setFilter] = useState("ALL");

  useRealTimeTasks(setTasks);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = filter !== "ALL" ? { status: filter.toUpperCase() } : {};
      const res = await taskService.getAll(params);
      setTasks(res.data || []);
    } catch (err) {
      setError(err.response?.data?.error?.message || "Gagal memuat task");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  const fetchMilestones = useCallback(async () => {
    try {
      const res = await milestoneService.getAll();
      setMilestones(res.data || []);
    } catch (err) {
      console.error("Gagal memuat daftar milestone untuk pilihan form", err);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    fetchMilestones();
  }, [fetchTasks, fetchMilestones]);

  const preparePayload = (formData) => {
    return {
      title: formData.title,
      description: formData.description || "", 
      status: formData.status ? formData.status.toUpperCase() : "TODO",
      priority: formData.priority ? formData.priority.toUpperCase() : "MEDIUM",
      milestoneId: formData.milestoneId ? Number(formData.milestoneId) : null,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
    };
  };

  const handleCreate = async (formData) => {
    try {
      const cleanData = preparePayload(formData);
      const res = await taskService.create(cleanData);
      const newTask = res.data?.data || res.data || res; 
      
      setTasks((prev) => {
        const exists = prev.some(t => t.id === newTask.id);
        if (exists) return prev;
        return [newTask, ...prev];
      });
      setShowForm(false);
    } catch (err) {
      alert(err.response?.data?.error?.message || "Gagal membuat task");
    }
  };

  const handleEditClick = (task) => {
    setEditTarget(task);
    setShowForm(true);
  };

  const handleUpdate = async (formData) => {
    try {
      const cleanData = preparePayload(formData);
      const updated = await taskService.update(editTarget.id, cleanData);
      
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      setShowForm(false);
      setEditTarget(null);
    } catch (err) {
      alert(err.response?.data?.error?.message || "Gagal memperbarui task");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus task ini?")) return;
    try {
      await taskService.remove(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert(err.response?.data?.error?.message || "Gagal menghapus task");
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditTarget(null);
  };

  return (
    <div>
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <h1>Daftar Task</h1>
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            + Task Baru
          </button>
        </div>

        <div className="filter-bar">
          {["ALL", "TODO", "IN_PROGRESS", "DONE"].map((s) => (
            <button
              key={s}
              className={`filter-btn ${filter === s ? "active" : ""}`}
              onClick={() => setFilter(s)}
            >
              {s === "ALL" ? "Semua" : s === "TODO" ? "Belum Dimulai" : s === "IN_PROGRESS" ? "Sedang Dikerjakan" : "Selesai"}
            </button>
          ))}
        </div>

        {loading && <p className="state-msg">Memuat task...</p>}
        {error && <p className="state-msg error">{error}</p>}
        {!loading && !error && tasks.length === 0 && (
          <p className="state-msg">Belum ada task. Buat task pertamamu!</p>
        )}

        <div className="task-grid">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEditClick}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {showForm && (
          <TaskForm
            onSubmit={editTarget ? handleUpdate : handleCreate}
            onCancel={handleCloseForm}
            initialData={editTarget}
            milestones={milestones}
          />
        )}
      </main>
    </div>
  );
}