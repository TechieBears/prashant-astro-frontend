import React, { useEffect, useState, useRef } from "react";
import { Bell, X } from "lucide-react";
import { getNotificationsDropdownCustomer, clearAllNotifications } from "../../api";
import toast from "react-hot-toast";
import moment from "moment";

const NotificationDropdown = ({ className = "" }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notificationsDropdown, setNotificationsDropdown] = useState([]);
    const trigger = useRef(null);
    const dropdown = useRef(null);

    useEffect(() => {
        const clickHandler = ({ target }) => {
            if (!dropdown.current) return;
            if (
                !dropdownOpen ||
                dropdown.current.contains(target) ||
                trigger.current.contains(target)
            )
                return;
            setDropdownOpen(false);
        };
        document.addEventListener("click", clickHandler);
        return () => document.removeEventListener("click", clickHandler);
    });

    useEffect(() => {
        const keyHandler = ({ keyCode }) => {
            if (!dropdownOpen || keyCode !== 27) return;
            setDropdownOpen(false);
        };
        document.addEventListener("keydown", keyHandler);
        return () => document.removeEventListener("keydown", keyHandler);
    });

    const fetchNotificationsDropdown = async () => {
        try {
            const res = await getNotificationsDropdownCustomer();
            if (res?.success) {
                setNotificationsDropdown(res?.data);
            } else {
                setNotificationsDropdown([]);
                toast.error(res?.message || res?.error || 'Failed to fetch notifications dropdown');
            }
        } catch (error) {
            console.log("Error in fetchNotificationsDropdown", error);
        }
    }

    const clearAllNotificationHandler = async () => {
        try {
            const res = await clearAllNotifications();
            if (res?.success) {
                toast.success(res?.message || res?.success || 'Notifications cleared successfully');
                setDropdownOpen(false);
                fetchNotificationsDropdown();
            } else {
                toast.error(res?.message || res?.error || 'Failed to clear notifications');
            }
        }
        catch (error) {
            console.log("Error in clearAllNotifications", error);
            toast.error(error?.message || error?.error || 'Failed to clear notifications');
        }
    }

    useEffect(() => {
        fetchNotificationsDropdown();
    }, []);

    return (
        <div className={`relative inline-block ${className}`}>
            <button 
                className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 group" 
                ref={trigger}
                onClick={() => setDropdownOpen(!dropdownOpen)}
            >
                <Bell size={18} className="text-white group-hover:scale-110 transition-transform duration-200" />
                {notificationsDropdown?.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white">
                        {notificationsDropdown.length > 9 ? '9+' : notificationsDropdown.length}
                    </span>
                )}
            </button>
            
            <div
                ref={dropdown}
                className={`absolute right-0 top-12 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 transition-all duration-300 transform origin-top-right ${dropdownOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}`}
                style={{ zIndex: 9999 }}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-600 rounded-full">
                            {notificationsDropdown?.length || 0} new
                        </span>
                        <button 
                            onClick={() => setDropdownOpen(false)}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={16} className="text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-96 overflow-y-auto">
                    {notificationsDropdown?.length > 0 ? (
                        notificationsDropdown.map((item, i) => (
                            <div key={i} className="p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center">
                                        <Bell size={16} className="text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{item?.title}</h4>
                                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{item?.description}</p>
                                        <span className="text-xs text-gray-400 mt-2 block">{moment(item?.createdAt).fromNow()}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center">
                            <Bell size={32} className="text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 text-sm">No notifications yet</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {notificationsDropdown?.length > 0 && (
                    <div className="p-4 border-t border-gray-100">
                        <button 
                            onClick={clearAllNotificationHandler}
                            className="w-full py-2 px-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-md"
                        >
                            Clear All Notifications
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationDropdown;