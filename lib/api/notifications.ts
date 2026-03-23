import client from "./client";

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "error" | "appointment" | "system";
    read: boolean;
    createdAt: string;
    data?: Record<string, any>;
}

export interface NotificationResponse {
    notifications: Notification[];
    unreadCount: number;
}

// Get all notifications for the user
export async function getNotifications(limit = 50): Promise<NotificationResponse> {
    try {
        const response = await client.get("/notifications", {
            params: { limit },
        });
        return response.data.data || { notifications: [], unreadCount: 0 };
    } catch (error) {
        console.error("Error fetching notifications:", error);
        throw error;
    }
}

// Get unread notification count
export async function getNotificationCount(): Promise<number> {
    try {
        const response = await client.get("/notifications/count");
        return response.data.data?.count || 0;
    } catch (error) {
        console.error("Error fetching notification count:", error);
        return 0;
    }
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: string): Promise<void> {
    try {
        await client.put(`/notifications/${notificationId}/read`);
    } catch (error) {
        console.error("Error marking notification as read:", error);
        throw error;
    }
}

// Mark all notifications as read
export async function markAllNotificationsAsRead(): Promise<void> {
    try {
        await client.put("/notifications/read-all");
    } catch (error) {
        console.error("Error marking all notifications as read:", error);
        throw error;
    }
}

// Delete a notification
export async function deleteNotification(notificationId: string): Promise<void> {
    try {
        await client.delete(`/notifications/${notificationId}`);
    } catch (error) {
        console.error("Error deleting notification:", error);
        throw error;
    }
}

// Clear all notifications
export async function clearAllNotifications(): Promise<void> {
    try {
        await client.delete("/notifications");
    } catch (error) {
        console.error("Error clearing notifications:", error);
        throw error;
    }
}
