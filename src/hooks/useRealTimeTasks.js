import { useEffect } from "react";
import { useSocket } from "../contexts/SocketContext";
import { useNotif } from "../contexts/NotifContext";
import { useAuth } from "../contexts/AuthContext";

export function useRealTimeTasks(setTasks) {
    const { socket } = useSocket();
    const { addToast } = useNotif();
    const { user } = useAuth();

    useEffect(() => {
        if (!socket || !user) return;

        const onTaskCreated = (payload) => {
            const task = payload.task || payload.data || payload;
            if (!task || !task.id) return;

            if (user.role !== 'ADMIN' && Number(task.userId) !== Number(user.userId)) return;

            setTasks(prev => {
                const exists = prev.some(t => Number(t.id) === Number(task.id));
                if (exists) return prev;
                return [task, ...prev];
            });
        };

        const onTaskUpdated = (payload) => {
            const task = payload.task || payload.data || payload;
            if (!task || !task.id) return;

            if (user.role !== 'ADMIN' && Number(task.userId) !== Number(user.userId)) return;

            setTasks(prev => prev.map(t => {
                if (Number(t.id) === Number(task.id)) {
                    return {
                        ...t,
                        ...task,
                        user: task.user || t.user,
                        category: task.category || t.category
                    };
                }
                return t;
            }));
            
            addToast({
                type: "INFO",
                title: "Task Diperbarui",
                message: `Task "${task.title}" telah diperbarui.`,
            });
        };

        const onTaskDeleted = (payload) => {
            const taskId = payload.taskId !== undefined ? payload.taskId : payload;
            if (!taskId) return;

            setTasks(prev => prev.filter(t => Number(t.id) !== Number(taskId)));
        };

        const onNotification = (notif) => {
            if (notif) addToast(notif);
        };

        socket.on("task:created", onTaskCreated);
        socket.on("task:updated", onTaskUpdated);
        socket.on("task:deleted", onTaskDeleted);
        socket.on("notification", onNotification);

        return () => {
            socket.off("task:created", onTaskCreated);
            socket.off("task:updated", onTaskUpdated);
            socket.off("task:deleted", onTaskDeleted);
            socket.off("notification", onNotification);
        };
    }, [socket, setTasks, addToast, user]);
}