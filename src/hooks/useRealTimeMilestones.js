import { useEffect } from "react";
import { useSocket } from "../contexts/SocketContext";
import { useNotif } from "../contexts/NotifContext";

export function useRealTimeMilestones(setMilestones) {
    const { socket } = useSocket();
    const { addToast } = useNotif();

    useEffect(() => {
        if (!socket) return;

        const onMilestoneCreated = ({ milestone }) => {
            setMilestones(prev => {
                const exists = prev.some(m => Number(m.id) === Number(milestone.id));
                if (exists) return prev;
                return [milestone, ...prev];
            });
        };

        const onMilestoneUpdated = ({ milestone }) => {
            setMilestones(prev => prev.map(m => m.id === milestone.id ? milestone : m));
            
            addToast({
                type: "INFO",
                title: "Milestone Diperbarui",
                message: `Progress "${milestone.title}" telah diperbarui.`,
            });
        };

        const onMilestoneDeleted = ({ milestoneId }) => {
            setMilestones(prev => prev.filter(m => m.id !== milestoneId));
        };

        socket.on("milestone:created", onMilestoneCreated);
        socket.on("milestone:updated", onMilestoneUpdated);
        socket.on("milestone:deleted", onMilestoneDeleted);

        return () => {
            socket.off("milestone:created", onMilestoneCreated);
            socket.off("milestone:updated", onMilestoneUpdated);
            socket.off("milestone:deleted", onMilestoneDeleted);
        };
    }, [socket, setMilestones, addToast]);
}