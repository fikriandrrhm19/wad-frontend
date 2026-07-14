import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { milestoneService } from "../services/milestone.service";
import { useSocket } from "../contexts/SocketContext";

export function MilestoneDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [milestone, setMilestone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { socket } = useSocket();

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await milestoneService.getById(id);
      setMilestone(data);
    } catch (err) {
      setError(err.response?.data?.error?.message || "Gagal memuat rincian milestone");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  useEffect(() => {
    if (!socket) return;

    const handleTaskUpdateOnMilestone = () => {
      fetchDetail();
    };

    const handleMilestoneUpdate = ({ milestone: updated }) => {
      if (Number(updated.id) === Number(id)) {
        setMilestone((prev) => ({ ...prev, ...updated }));
      }
    };

    socket.on("task:created", handleTaskUpdateOnMilestone);
    socket.on("task:updated", handleTaskUpdateOnMilestone);
    socket.on("task:deleted", handleTaskUpdateOnMilestone);
    socket.on("milestone:updated", handleMilestoneUpdate);

    return () => {
      socket.off("task:created", handleTaskUpdateOnMilestone);
      socket.off("task:updated", handleTaskUpdateOnMilestone);
      socket.off("task:deleted", handleTaskUpdateOnMilestone);
      socket.off("milestone:updated", handleMilestoneUpdate);
    };
  }, [socket, id, fetchDetail]);

  const handleToggleStatus = async () => {
    if (!milestone) return;
    const nextStatus = milestone.status === "ACHIEVED" ? "PENDING" : "ACHIEVED";
    try {
      const updated = await milestoneService.update(id, { status: nextStatus });
      setMilestone((prev) => ({ ...prev, ...updated }));
    } catch (err) {
      alert("Gagal mengubah status milestone");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Yakin ingin menghapus milestone ini secara permanen?")) return;
    try {
      await milestoneService.remove(id);
      navigate("/milestones");
    } catch (err) {
      alert("Gagal menghapus milestone");
    }
  };

  if (loading) return (
    <div>
      <Navbar />
      <main className="main-content"><p className="state-msg">Memuat rincian...</p></main>
    </div>
  );

  if (error) return (
    <div>
      <Navbar />
      <main className="main-content"><p className="state-msg error">{error}</p></main>
    </div>
  );

  if (!milestone) return null;

  const totalTasks = milestone.tasks?.length || 0;
  const doneTasks = milestone.tasks?.filter((t) => t.status === "DONE").length || 0;
  const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div>
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <h1>{milestone.title}</h1>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button className="btn-secondary" onClick={handleToggleStatus}>
              Tandai {milestone.status === "ACHIEVED" ? "Tertunda" : "Selesai"}
            </button>
            <button className="btn-logout" style={{ padding: "0.6rem 1.2rem", borderRadius: "6px" }} onClick={handleDelete}>Hapus</button>
          </div>
        </div>

        <div className="profile-card" style={{ flexDirection: "column", width: "100%", gap: "1rem", marginBottom: "2rem" }}>
          {milestone.description && <p style={{ color: "#475569" }}>{milestone.description}</p>}
          <div style={{ width: "100%", margin: "0.5rem 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", marginBottom: "0.4rem" }}>
              <span>Pencapaian Target Tugas Terkait ({doneTasks}/{totalTasks} Selesai)</span>
              <strong>{progress}%</strong>
            </div>
            <div style={{ width: "100%", background: "#e2e8f0", height: "12px", borderRadius: "6px", overflow: "hidden" }}>
              <div style={{ width: `${progress}%`, background: progress === 100 ? "#16a34a" : "#2E75B6", height: "100%", transition: "width 0.4s ease" }} />
            </div>
          </div>
          <div style={{ fontSize: "0.875rem", color: "#64748b" }}>
            Target Batas Waktu: <strong>{new Date(milestone.dueDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</strong>
          </div>
        </div>

        <h2>Tugas dalam Milestone Ini</h2>
        <div style={{ background: "white", borderRadius: "8px", border: "1px solid #e2e8f0", marginTop: "1rem", overflow: "hidden" }}>
          {totalTasks === 0 ? (
            <p className="state-msg">Belum ada tugas yang dikaitkan ke milestone ini.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                  <th style={{ padding: "1rem" }}>Judul Tugas</th>
                  <th style={{ padding: "1rem" }}>Prioritas</th>
                  <th style={{ padding: "1rem" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {milestone.tasks.map((t) => (
                  <tr key={t.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "1rem", fontWeight: 500 }}>{t.title}</td>
                    <td style={{ padding: "1rem" }}>
                      <span className="badge-outline" style={{ 
                        borderColor: t.priority === "HIGH" ? "#dc2626" : t.priority === "MEDIUM" ? "#d97706" : "#6b7280",
                        color: t.priority === "HIGH" ? "#dc2626" : t.priority === "MEDIUM" ? "#d97706" : "#6b7280"
                      }}>{t.priority}</span>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <span className="badge" style={{ 
                        backgroundColor: t.status === "DONE" ? "#16a34a" : t.status === "IN_PROGRESS" ? "#2563eb" : "#6b7280"
                      }}>{t.status === "DONE" ? "Selesai" : t.status === "IN_PROGRESS" ? "Sedang Jalan" : "Belum Dimulai"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}