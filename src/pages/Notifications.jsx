// UserNotificationsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Card, CardHeader, CardBody, CardFooter,
  Button, Divider, Avatar, ScrollShadow, Chip, Select, SelectItem,
} from "@heroui/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "@/utils/axiosConfig";
import { toast } from "react-hot-toast";
import { FiBell, FiAlertTriangle, FiMessageSquare, FiMail, FiInfo } from "react-icons/fi";
import HomeHeader from "@/components/HomeHeader";
import Footer from "@/components/Footer";

// --- helpers ---
const relTime = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso).getTime();
  const diff = Math.max(0, Date.now() - d);
  const m = Math.floor(diff / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const days = Math.floor(h / 24);
  return `${days}d`;
};

const iconFor = (type) => {
  switch (type) {
    case "alert": return <FiAlertTriangle size={18} className="text-red-600"/>;
    case "comment": return <FiMessageSquare size={18}/>;
    case "mail": return <FiMail size={18}/>;
    default: return <FiInfo size={18}/>;
  }
};

const TYPES = [
  { key: "", label: "All types" },
  { key: "alert", label: "Alerts" },
  { key: "info", label: "Info" },
  { key: "comment", label: "Comments" },
  { key: "mail", label: "Mail" },
];

export default function Notifications() {
  const navigate = useNavigate();
  const [sp, setSp] = useSearchParams();

  // query state (URL-driven)
  const page = parseInt(sp.get("page") || "1", 10);
  const perPage = parseInt(sp.get("per_page") || "12", 10);
  const only = sp.get("only") || "all";            // 'all' | 'unread' | 'read'
  const type = sp.get("type") || "";               // '', 'alert', ...

  // data state
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0, unread_count: 0 });
  const [loading, setLoading] = useState(true);

  // fetch list
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await axios.get("/institution/notifications", {
        });

        const data = res.data?.data?.notifications || [];
        const m = res.data?.meta || {};
        if (!cancelled) {
          setItems(data);
          setMeta({
            current_page: m.current_page || page,
            last_page: m.last_page || 1,
            total: m.total || data.length,
            unread_count: m.unread_count ?? 0,
            per_page: m.per_page || perPage,
          });
        }
      } catch (err) {
        if (!cancelled) toast.error(err.response?.data?.message || "Failed to load notifications.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [page, perPage, only, type]);

  const setQuery = (next) => {
    const nextParams = new URLSearchParams(sp);
    Object.entries(next).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "") nextParams.delete(k);
      else nextParams.set(k, String(v));
    });
    setSp(nextParams, { replace: false });
  };

  const badge = useMemo(() => meta.unread_count > 0 ? (meta.unread_count > 99 ? "99+" : meta.unread_count) : null, [meta.unread_count]);

  // actions (implement these endpoints in your backend if you haven't)
  const markAllRead = async () => {
    try {
      await axios.patch("/notifications/mark-all-read");
      toast.success("All notifications marked as read.");
      // refetch current page
      setQuery({ page: 1 }); // optional: jump to first page
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to mark all read.");
    }
  };

  const toggleRead = async (n) => {
    const read = !n.read_at; // if currently unread, we'll mark as read
    try {
      await axios.patch(`/notifications/${encodeURIComponent(n.id)}/read`, { read });
      setItems((prev) => prev.map((it) => (it.id === n.id ? { ...it, read_at: read ? new Date().toISOString() : null } : it)));
      setMeta((m) => ({
        ...m,
        unread_count: Math.max(0, m.unread_count + (read ? -1 : +1)),
      }));
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to update notification.");
    }
  };

  const openNotification = (n) => {
    const path = n?.data?.path || n?.action_url;
    if (!path) return;
    if (path.startsWith("/")) {
      navigate(path);
    } else {
      window.open(path, "_blank", "noopener");
    }
  };

  // pagination control
  const pages = useMemo(() => {
    const total = meta.last_page || 1;
    const cur = meta.current_page || 1;
    const windowSize = 5;
    const start = Math.max(1, cur - Math.floor(windowSize / 2));
    const end = Math.min(total, start + windowSize - 1);
    const arr = [];
    for (let i = start; i <= end; i++) arr.push(i);
    return { arr, total, cur };
  }, [meta.current_page, meta.last_page]);

  return (
    <div className="flex flex-col min-h-screen">

      <main className="flex-1 w-11/12 xl:w-4/5 mx-auto py-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FiBell className="w-6 h-6" />
            <h1 className="text-xl md:text-2xl font-semibold">Notifications</h1>
            {badge && <Chip color="danger" size="sm" variant="solid">{badge}</Chip>}
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="light" onPress={() => setQuery({ only: "all", page: 1 })} className={only === "all" ? "font-semibold" : ""}>All</Button>
            <Button size="sm" variant="light" onPress={() => setQuery({ only: "unread", page: 1 })} className={only === "unread" ? "font-semibold" : ""}>Unread</Button>
            <Button size="sm" variant="light" onPress={() => setQuery({ only: "read", page: 1 })} className={only === "read" ? "font-semibold" : ""}>Read</Button>

            <Select
              aria-label="Type"
              size="sm"
              radius="none"
              selectedKeys={new Set([type])}
              onSelectionChange={(keys) => {
                const v = Array.from(keys)[0] ?? "";
                setQuery({ type: v, page: 1 });
              }}
              className="w-40 text-sm"
              disallowEmptySelection={false}
            >
              {TYPES.map((t) => (
                <SelectItem key={t.key} value={t.key}>{t.label}</SelectItem>
              ))}
            </Select>

            <Button size="sm" radius="none" variant="flat" onPress={markAllRead} isDisabled={!meta.unread_count}>
              Mark all read
            </Button>
          </div>
        </div>

        <Card className="border-none bg-content1" shadow="sm">
          <CardHeader className="px-4 py-3">
            <div className="text-sm text-default-600">
              Showing page <span className="font-semibold">{meta.current_page}</span> of <span className="font-semibold">{meta.last_page}</span> — {meta.total} total
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="p-0">
            {loading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-3 animate-pulse">
                    <div className="w-8 h-8 rounded-full bg-default-100" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-default-100 w-2/3 rounded" />
                      <div className="h-3 bg-default-100 w-1/2 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="p-8 text-center text-default-500">No notifications.</div>
            ) : (
              <ScrollShadow className="max-h-[70vh] py-2">
                {items.map((n, idx) => {
                  const isUnread = !n.read_at;
                  return (
                    <div key={n.id}>
                      <div className={`flex items-start gap-3 px-4 py-3 ${isUnread ? "bg-default-50" : ""}`}>
                        <Avatar size="md" radius="full" className="shrink-0" icon={iconFor(n.type)} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <p className={`font-medium truncate ${isUnread ? "text-foreground" : "text-default-700"}`}>{n.title || "Notification"}</p>
                            <span className="text-[11px] text-default-500 ml-2 flex-shrink-0">{relTime(n.created_at)}</span>
                          </div>
                          {n.message && <p className="text-sm text-default-600 break-words">{n.message}</p>}
                          <div className="mt-2 flex items-center gap-2">
                            {(n?.data?.path || n?.action_url) && (
                              <Button size="sm" variant="flat" onPress={() => openNotification(n)}>
                                Open
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="light"
                              onPress={() => toggleRead(n)}
                            >
                              {isUnread ? "Mark read" : "Mark unread"}
                            </Button>
                            {isUnread && <span className="inline-block h-2 w-2 rounded-full bg-primary" />}
                          </div>
                        </div>
                      </div>
                      {idx < items.length - 1 && <Divider />}
                    </div>
                  );
                })}
              </ScrollShadow>
            )}
          </CardBody>
          <Divider />
          <CardFooter className="px-4 py-3">
            <div className="flex items-center gap-2 ml-auto">
              <Button
                size="sm"
                variant="light"
                isDisabled={meta.current_page <= 1}
                onPress={() => setQuery({ page: page - 1 })}
              >
                Prev
              </Button>
              {/* page window */}
              {pages.arr.map((p) => (
                <Button
                  key={p}
                  size="sm"
                  variant={p === pages.cur ? "flat" : "light"}
                  onPress={() => setQuery({ page: p })}
                >
                  {p}
                </Button>
              ))}
              <Button
                size="sm"
                variant="light"
                isDisabled={meta.current_page >= meta.last_page}
                onPress={() => setQuery({ page: page + 1 })}
              >
                Next
              </Button>
            </div>
          </CardFooter>
        </Card>
      </main>

    </div>
  );
}
