import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Navbar } from "../components/Navbar";
import { milestoneService } from "../services/milestone.service";
import { useRealTimeMilestones } from "../hooks/useRealTimeMilestones";

export function MilestonesPage() {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useRealTimeMilestones(setMilestones);

  const fetchMilestones = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await milestoneService.getAll();
      setMilestones(res.data);
    } catch (err) {
      setError(err.response?.data?.error?.message || "Gagal memuat milestone");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMilestones();
  }, [fetchMilestones]);

  const calculateProgress = (tasks) => {
    if (!tasks || tasks.length === 0) return 0;
    const doneTasks = tasks.filter((t) => t.status === "DONE").length;
    return Math.round((doneTasks / tasks.length) * 100);
  };

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (formData) => {
    try {
      const newMilestone = await milestoneService.create(formData);
      setMilestones((prev) => {
        const exists = prev.some((m) => m.id === newMilestone.id);
        if (exists) return prev;
        return [newMilestone, ...prev];
      });
      setShowForm(false);
      reset();
    } catch (err) {
      alert(err.response?.data?.error?.message || "Gagal membuat milestone");
    }
  };

  return (
    <div>
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <h1>Daftar Milestone</h1>
          <button className="btn-primary" onClick={() => setShowForm(true)}>+ Milestone Baru</button>
        </div>

        {loading && <p className="state-msg">Memuat milestone...</p>}
        {error && <p className="state-msg error">{error}</p>}
        {!loading && !error && milestones.length === 0 && <p className="state-msg">Belum ada milestone.</p>}

        <div className="task-grid">
          {milestones.map((m) => {
            const progress = calculateProgress(m.tasks);
            return (
              <div key={m.id} className="task-card">
                <div className="task-card-header">
                  <h3 className="task-title">
                    <Link to={`/milestones/${m.id}`} style={{ textDecoration: "none", color: "#1F4E79" }}>{m.title}</Link>
                  </h3>
                </div>
                {m.description && <p className="task-description">{m.description}</p>}
                
                <div style={{ margin: "1rem 0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.25rem" }}>
                    <span>Progres Tugas</span>
                    <strong>{progress}%</strong>
                  </div>
                  <div style={{ width: "100%", background: "#e2e8f0", height: "8px", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ width: `${progress}%`, background: progress === 100 ? "#16a34a" : "#2E75B6", height: "100%", transition: "width 0.4s ease" }} />
                  </div>
                </div>

                <div className="task-card-footer">
                  <span className="badge" style={{ backgroundColor: m.status === "ACHIEVED" ? "#16a34a" : "#d97706" }}>
                    {m.status === "ACHIEVED" ? "Selesai" : "Tertunda"}
                  </span>
                  <span className="due-date">Target: {new Date(m.dueDate).toLocaleDateString("id-ID")}</span>
                </div>
              </div>
            );
          })}
        </div>

        {showForm && (
          <div className="modal-overlay">
            <div className="modal-card">
              <h2>Buat Milestone Baru</h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                  <label>Judul Milestone *</label>
                  <input type="text" {...register("title", { required: "Judul wajib diisi" })} />
                  {errors.title && <span className="error">{errors.title.message}</span>}
                </div>
                <div className="form-group">
                  <label>Deskripsi</label>
                  <textarea rows={3} {...register("description")} />
                </div>
                <div className="form-group">
                  <label>Tenggat Waktu *</label>
                  <input type="date" {...register("dueDate", { required: "Tenggat waktu wajib diisi" })} />
                  {errors.dueDate && <span className="error">{errors.dueDate.message}</span>}
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => { setShowForm(false); reset(); }}>Batal</button>
                  <button type="submit" className="btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? "Menyimpan..." : "Buat Milestone"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}