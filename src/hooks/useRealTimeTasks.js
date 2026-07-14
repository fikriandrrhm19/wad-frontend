import { useEffect } from "react";
import { useSocket } from "../contexts/SocketContext";
import { useNotif } from "../contexts/NotifContext";

export function useRealTimeTasks(setTasks) {
    const { socket } = useSocket();
    const { addToast } = useNotif();

    useEffect(() => {
        if (!socket) return;

        const onTaskCreated = ({ task }) => {
            setTasks(prev => {
                const exists = prev.some(t => Number(t.id) === Number(task.id));
                if (exists) return prev;
                return [task, ...prev];
            });
        };

        const onTaskUpdated = ({ task }) => {
            setTasks(prev => prev.map(t => t.id === task.id ? task : t));
            
            addToast({
                type: "INFO",
                title: "Task Diperbarui",
                message: `Task "${task.title}" telah diperbarui oleh pengguna lain.`,
            });
        };

        const onTaskDeleted = ({ taskId }) => {
            setTasks(prev => prev.filter(t => t.id !== taskId));
        };

        // Daftarkan listener event task dari backend
        socket.on("task:created", onTaskCreated);
        socket.on("task:updated", onTaskUpdated);
        socket.on("task:deleted", onTaskDeleted);

        return () => {
            socket.off("task:created", onTaskCreated);
            socket.off("task:updated", onTaskUpdated);
            socket.off("task:deleted", onTaskDeleted);
        };
    }, [socket, setTasks, addToast]);
}