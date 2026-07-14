import { useEffect } from "react";
import { useSocket } from "../contexts/SocketContext";
import { useNotif } from "../contexts/NotifContext";
import { useAuth } from "../contexts/AuthContext";

export function useRealTimeMilestones(setMilestones) {
    const { socket } = useSocket();
    const { addToast } = useNotif();
    const { user } = useAuth();

    useEffect(() => {
        if (!socket || !user) return;

        const onMilestoneCreated = (payload) => {
            const milestone = payload.milestone || payload.data || payload;
            if (!milestone || !milestone.id) return;

            if (user.role !== 'ADMIN' && Number(milestone.userId) !== Number(user.userId)) return;

            setMilestones(prev => {
                const exists = prev.some(m => Number(m.id) === Number(milestone.id));
                if (exists) return prev;
                return [milestone, ...prev];
            });
        };

        const onMilestoneUpdated = (payload) => {
            const milestone = payload.milestone || payload.data || payload;
            if (!milestone || !milestone.id) return;

            if (user.role !== 'ADMIN' && Number(milestone.userId) !== Number(user.userId)) return;

            setMilestones(prev => prev.map(m => Number(m.id) === Number(milestone.id) ? milestone : m));
            
            addToast({
                type: "INFO",
                title: "Milestone Diperbarui",
                message: `Progress "${milestone.title}" telah diperbarui.`,
            });
        };

        const onMilestoneDeleted = (payload) => {
            const milestoneId = payload.milestoneId !== undefined ? payload.milestoneId : payload;
            if (!milestoneId) return;

            setMilestones(prev => prev.filter(m => Number(m.id) !== Number(milestoneId)));
        };

        const onNotification = (notif) => {
            if (notif) addToast(notif);
        };

        socket.on("milestone:created", onMilestoneCreated);
        socket.on("milestone:updated", onMilestoneUpdated);
        socket.on("milestone:deleted", onMilestoneDeleted);
        socket.on("notification", onNotification);

        return () => {
            socket.off("milestone:created", onMilestoneCreated);
            socket.off("milestone:updated", onMilestoneUpdated);
            socket.off("milestone:deleted", onMilestoneDeleted);
            socket.off("notification", onNotification);
        };
    }, [socket, setMilestones, addToast, user]);
}