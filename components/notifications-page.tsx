"use client";

import { useState, useEffect } from "react";
import {
    Bell,
    Trash2,
    CheckCircle,
    AlertCircle,
    Info,
    Check,
    X,
    Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    getNotifications,
    markNotificationAsRead,
    deleteNotification,
    clearAllNotifications,
    Notification,
} from "@/lib/api/notifications";
import { useAuth } from "@/lib/auth-context";

export default function NotificationsPage() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            setIsLoading(true);
            const data = await getNotifications();
            setNotifications(data.notifications);
            setUnreadCount(data.unreadCount);
        } catch (error: any) {
            console.error("Error loading notifications:", error);
            toast.error("Failed to load notifications");
        } finally {
            setIsLoading(false);
        }
    };

    const handleMarkAsRead = async (notificationId: string) => {
        try {
            await markNotificationAsRead(notificationId);
            setNotifications((prev) =>
                prev.map((notif) =>
                    notif.id === notificationId
                        ? { ...notif, read: true }
                        : notif
                )
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
            toast.success("Marked as read");
        } catch (error) {
            toast.error("Failed to mark as read");
        }
    };

    const handleDelete = async (notificationId: string) => {
        try {
            await deleteNotification(notificationId);
            setNotifications((prev) =>
                prev.filter((notif) => notif.id !== notificationId)
            );
            toast.success("Notification deleted");
        } catch (error) {
            toast.error("Failed to delete notification");
        }
    };

    const handleClearAll = async () => {
        if (!window.confirm("Are you sure you want to clear all notifications?")) {
            return;
        }

        try {
            await clearAllNotifications();
            setNotifications([]);
            setUnreadCount(0);
            toast.success("All notifications cleared");
        } catch (error) {
            toast.error("Failed to clear notifications");
        }
    };

    const getFilteredNotifications = () => {
        switch (filter) {
            case "unread":
                return notifications.filter((n) => !n.read);
            case "read":
                return notifications.filter((n) => n.read);
            default:
                return notifications;
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case "success":
                return <CheckCircle className="w-5 h-5 text-green-400" />;
            case "warning":
                return <AlertCircle className="w-5 h-5 text-yellow-400" />;
            case "error":
                return <X className="w-5 h-5 text-red-400" />;
            case "appointment":
                return <Clock className="w-5 h-5 text-blue-400" />;
            case "system":
                return <Info className="w-5 h-5 text-slate-400" />;
            default:
                return <Info className="w-5 h-5 text-slate-400" />;
        }
    };

    const getNotificationColor = (type: string) => {
        switch (type) {
            case "success":
                return "bg-green-500/10 border-green-500/30";
            case "warning":
                return "bg-yellow-500/10 border-yellow-500/30";
            case "error":
                return "bg-red-500/10 border-red-500/30";
            case "appointment":
                return "bg-blue-500/10 border-blue-500/30";
            case "system":
                return "bg-slate-700/30 border-slate-600";
            default:
                return "bg-slate-700/30 border-slate-600";
        }
    };

    const filteredNotifications = getFilteredNotifications();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-50 flex items-center gap-3">
                        <Bell className="w-8 h-8 text-blue-400" />
                        Notifications
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Stay updated with your latest notifications
                    </p>
                </div>
                {unreadCount > 0 && (
                    <Badge className="text-lg px-3 py-1 bg-red-500/20 text-red-300 border border-red-500/30">
                        {unreadCount} Unread
                    </Badge>
                )}
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 bg-slate-700/30 p-1 rounded-lg border border-slate-700">
                {(["all", "unread", "read"] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`flex-1 py-2 px-4 rounded-md transition-all font-medium text-sm capitalize ${
                            filter === f
                                ? "bg-blue-600 text-white"
                                : "text-slate-400 hover:text-slate-300"
                        }`}
                    >
                        {f}
                        {f === "unread" && unreadCount > 0 && (
                            <span className="ml-2 text-xs bg-red-500 px-2 py-1 rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
                <Button
                    onClick={loadNotifications}
                    className="bg-slate-700/50 hover:bg-slate-700 text-slate-300"
                >
                    Refresh
                </Button>
                {notifications.length > 0 && (
                    <Button
                        onClick={handleClearAll}
                        variant="destructive"
                        className="ml-auto"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear All
                    </Button>
                )}
            </div>

            {/* Notifications List */}
            {isLoading ? (
                <div className="space-y-4">
                    {Array(5)
                        .fill(0)
                        .map((_, i) => (
                            <Skeleton key={i} className="h-24" />
                        ))}
                </div>
            ) : filteredNotifications.length === 0 ? (
                <Card className="p-16 bg-slate-800/30 border-slate-700 text-center">
                    <Bell className="w-16 h-16 mx-auto text-slate-600 mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold text-slate-300 mb-2">
                        No Notifications
                    </h3>
                    <p className="text-slate-400">
                        {filter === "unread"
                            ? "All caught up! You have no unread notifications."
                            : "You don't have any notifications yet."}
                    </p>
                </Card>
            ) : (
                <div className="space-y-3">
                    {filteredNotifications.map((notification) => (
                        <Card
                            key={notification.id}
                            className={`p-4 border transition-all hover:border-slate-600 ${
                                notification.read
                                    ? "bg-slate-800/30 border-slate-700"
                                    : "bg-slate-800/50 border-slate-600 ring-1 ring-blue-500/20"
                            } ${getNotificationColor(notification.type)}`}
                        >
                            <div className="flex items-start gap-4">
                                {/* Icon */}
                                <div className="flex-shrink-0 mt-1">
                                    {getNotificationIcon(notification.type)}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-slate-50">
                                                {notification.title}
                                            </h3>
                                            <p className="text-sm text-slate-300 mt-1">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-2">
                                                {new Date(
                                                    notification.createdAt
                                                ).toLocaleString()}
                                            </p>
                                        </div>

                                        {/* Status Badge */}
                                        <div className="flex-shrink-0">
                                            {!notification.read && (
                                                <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                                    New
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 mt-3">
                                        {!notification.read && (
                                            <button
                                                onClick={() =>
                                                    handleMarkAsRead(
                                                        notification.id
                                                    )
                                                }
                                                className="text-xs px-3 py-1 rounded bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1"
                                            >
                                                <Check className="w-3 h-3" />
                                                Mark as Read
                                            </button>
                                        )}
                                        <button
                                            onClick={() =>
                                                handleDelete(notification.id)
                                            }
                                            className="text-xs px-3 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-300 transition-colors flex items-center gap-1"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
