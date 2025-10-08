// NotificationsBell.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Divider,
  Avatar,
  ScrollShadow,
  Chip,
  Spinner,
} from "@heroui/react";
import {
  FiBell,
  FiInfo,
  FiCheckCircle,
  FiFileText,
  FiAlertTriangle,
  FiChevronRight,
  FiRefreshCw,
} from "react-icons/fi";
import { NavLink } from "react-router-dom";
import axios from "@/utils/axiosConfig";

// --- helpers -------------------------------------------------
const relTime = (iso) => {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "";
  const diff = Date.now() - t;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
};

const safeParse = (s) => {
  try {
    if (!s) return {};
    return typeof s === "string" ? JSON.parse(s) : s;
  } catch {
    return {};
  }
};

const iconFor = (type) => {
  switch (type) {
    case "verification_request":
      return <FiCheckCircle className="w-4 h-4" />;
    case "verification_report":
      return <FiFileText className="w-4 h-4" />;
    case "alert":
      return <FiAlertTriangle className="w-4 h-4" />;
    default:
      return <FiInfo className="w-4 h-4" />;
  }
};

const statusChip = (status) => {
  if (!status) return null;
  const s = String(status).toLowerCase();
  if (["approve", "approved", "success"].includes(s))
    return <Chip size="sm" color="success" variant="flat">Approved</Chip>;
  if (["reject", "rejected", "failed"].includes(s))
    return <Chip size="sm" color="danger" variant="flat">Rejected</Chip>;
  if (["pending", "processing"].includes(s))
    return <Chip size="sm" color="warning" variant="flat">Pending</Chip>;
  return <Chip size="sm" variant="flat">{status}</Chip>;
};

const mapApiToUi = (n) => {
  const meta = safeParse(n.data);
  return {
    id: n.id,
    type: n.type || "info",
    title: n.title || "Notification",
    message: n.message || "",
    createdAt: n.created_at || n.createdAt || new Date().toISOString(),
    read: !!n.read_at || n.is_read === true,
    meta,
  };
};

export default function NotificationsBell({
  limit = 5,
  onItemClick,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const unreadCount = useMemo(() => items.filter((n) => !n.read).length, [items]);

  const fetchLatest = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/institution/notifications",{ params: { limit } });
      const rows = Array.isArray(res.data?.data?.notifications)
        ? res.data.data?.notifications
        : Array.isArray(res.data?.data)
        ? res.data.data
        : [];
      setItems(rows.map(mapApiToUi));
    } catch (e) {
      console.error(e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatest();
  }, []);

  const handleClickItem = async (n) => {
    onItemClick?.(n);

    setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
    try {
      await axios.post(`/institution/notifications/${encodeURIComponent(n.id)}`, { read: true });
    } catch (e) {
      setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: false } : x)));
      console.error(e);
    }
  };

  return (
    <Popover placement="bottom-end" offset={8} showArrow>
      <PopoverTrigger>
        <button
          className="relative p-2 rounded-full hover:bg-default-100 transition"
          aria-label="Notifications"
        >
          <FiBell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-5 min-w-5 px-1 rounded-full bg-bChkRed text-white text-[10px] leading-5 text-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent className="p-0 w-[380px]">
        <Card shadow="sm" className="border-none w-full">
          <CardHeader className="flex items-center justify-between px-4 py-3">
            <div className="font-semibold">Notifications</div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="light"
                startContent={<FiRefreshCw className="w-4 h-4" />}
                onPress={fetchLatest}
                isDisabled={loading}
              >
                Refresh
              </Button>
            </div>
          </CardHeader>

          <Divider />

          <CardBody className="p-0">
            {loading ? (
              <div className="p-6 flex items-center justify-center gap-2 text-default-500">
                <Spinner size="sm" />
                <span className="text-sm">Loading…</span>
              </div>
            ) : items.length === 0 ? (
              <div className="p-6 text-sm text-default-500 text-center">
                You’re all caught up 🎉
              </div>
            ) : (
              <ScrollShadow className="max-h-[360px] py-2 bg-gray-100">
                {items.map((n, idx) => {
                  const { meta } = n;
                  const docType =
                    meta.document_type ||
                    meta.verification_request_document_type ||
                    meta.doc_type;
                  const code =
                    meta.verification_request_unique_code ||
                    meta.unique_code ||
                    meta.code;
                  const route =
                    meta.sending_institution && meta.receiving_institution
                      ? `${meta.sending_institution} → ${meta.receiving_institution}`
                      : null;

                  return (
                    <div key={n.id}>
                      <button
                        className={[
                          "w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-default-100 transition",
                          !n.read ? "bg-default-50 border-l-2 border-l-primary" : "",
                        ].join(" ")}
                        onClick={() => handleClickItem(n)}
                      >
                        <Avatar
                          size="sm"
                          radius="full"
                          className="shrink-0"
                          color={n.type === "verification_request" ? "primary" : "default"}
                          icon={iconFor(n.type)}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-medium truncate">{n.title}</p>
                            <span className="text-[11px] text-default-500 flex-shrink-0">
                              {relTime(n.createdAt)}
                            </span>
                          </div>

                          <p className="text-sm text-default-600 line-clamp-2">
                            {n.message}
                          </p>

                          {/* Meta row: status/doc type/code/route */}
                          <div className="mt-1 flex flex-wrap items-center gap-1.5">
                            {/* {statusChip(meta.status)} */}
                            {docType && (
                              <Chip size="sm" variant="flat">
                                {docType}
                              </Chip>
                            )}
                            {code && (
                              <Chip size="sm" variant="flat">
                                #{code}
                              </Chip>
                            )}
                            {route && (
                              <Chip size="sm" variant="flat">
                                {route}
                              </Chip>
                            )}
                          </div>
                        </div>

                        <FiChevronRight className="w-4 h-4 opacity-60 mt-1" />
                      </button>
                      {idx < items.length - 1 && <Divider />}
                    </div>
                  );
                })}
              </ScrollShadow>
            )}
          </CardBody>

          <Divider />

          {/* <CardFooter className="px-4 py-3">
            <NavLink
              to="/admin/notifications"
              className="w-full bg-foreground text-background py-1.5 rounded-sm text-center hover:opacity-90 transition"
            >
              View all notifications
            </NavLink>
          </CardFooter> */}
        </Card>
      </PopoverContent>
    </Popover>
  );
}
