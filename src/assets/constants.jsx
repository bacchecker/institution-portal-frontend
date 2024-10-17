import { PiCertificateLight } from "react-icons/pi";
import { ChatIcon } from "./icons/chat";
import MoneyIcon from "./icons/money";
import {
  CogBagdedIcon,
  DashboardIcon,
  PersonCircleIcon,
  TasksListIcon,
} from "./icons/nav";
import { SecurityIcon } from "./icons/security";
import SupportIcon from "./icons/support";
import { FaUsers } from "react-icons/fa";
import { MdAttachEmail } from "react-icons/md";

export const navLinks = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <DashboardIcon />,
    children: [],
    showOn: ["inactive", "active"],
  },

  {
    label: "Requests",
    path: "/requests",
    icon: <TasksListIcon />,
    showOn: ["active"],
    children: [
      {
        label: "Document Requests",
        path: "/requests/document-requests",
      },
      {
        label: "Validation Requests",
        path: "/requests/validation-requests",
      },
      {
        label: "Verification Requests",
        path: "/requests/verification-requests",
      },
    ],
  },
  {
    label: "Account Setup",
    path: "/account-setup",
    icon: <PersonCircleIcon />,
    acl: ["view users", "view institutions"],
    showOn: ["inactive", "active"],
    children: [
      {
        label: "Profile",
        path: "/account-setup/profile",
        acl: ["view users"],
      },
      {
        label: "Document Types",
        path: "/account-setup/document-types",
      },
      {
        label: "Operations Certificate",
        path: "/account-setup/operations-certificate",
      },
      {
        label: "Letter Templates",
        path: "/account-setup/letter-templates",
      },
      {
        label: "Setup Team",
        path: "/account-setup/institution-teams",
      },
    ],
  },

  {
    label: "Payment/Revenue Setup",
    path: "/payment-revenue-setup",
    icon: <MoneyIcon />,
    acl: ["view payments"],
    showOn: ["active"],
    children: [],
  },
  // {
  //   label: "Support",
  //   path: "/supports",
  //   icon: <SupportIcon />,
  //   acl: ["view support tickets", "view support ticket categories"],
  //   children: [
  //     {
  //       label: "Tickets",
  //       path: "/supports/tickets",
  //       acl: ["view support tickets"],
  //     },
  //     {
  //       label: "My Tickets",
  //       path: "/supports/my-tickets",
  //       acl: ["view assigned tickets"],
  //     },
  //     // {
  //     //     label: "Disputes",
  //     //     path: "/supports/disputes",
  //     //     acl: ["view disputes"],
  //     // },
  //     // {
  //     //     label: "Feedback",
  //     //     path: "/supports/feedback/general",
  //     //     acl: ["view general feedback"],
  //     // },
  //   ],
  // },
  // {
  //   label: "Messages",
  //   path: "/messages",
  //   icon: <ChatIcon />,
  //   acl: [
  //     "view messages",
  //     "view chat",
  //     "view compose email",
  //     "view scheduled emails",
  //   ],
  //   children: [
  //     {
  //       label: "Email Templates",
  //       path: "/messages/email-templates",
  //       acl: ["view email templates"],
  //     },
  //     // {
  //     //     label: "Chat",
  //     //     path: "/messages/chat",
  //     //     acl: ["view chat"],
  //     // },
  //     // {
  //     //     label: "Compose Email",
  //     //     path: "/messages/compose-email",
  //     //     acl: ["view compose email"],
  //     // },
  //     // {
  //     //     label: "Scheduled Emails",
  //     //     path: "/messages/scheduled-emails",
  //     //     acl: ["view scheduled emails"],
  //     // },
  //   ],
  // },
  // {
  //   label: "Security",
  //   path: "/security",
  //   icon: <SecurityIcon />,
  //   acl: [
  //     "view security logs",
  //     "view ip blacklist",
  //     "view suspicious accounts",
  //   ],
  //   children: [
  //     {
  //       label: "Roles and Permissions",
  //       path: "/security/roles-permissions",
  //       acl: ["view roles and permissions"],
  //     },
  //     {
  //       label: "Activity Logs",
  //       path: "/security/activity-logs",
  //       acl: ["view system logs"],

  //       //                 1. Activity Logs
  //       // Purpose: Track general user and system activities.
  //       // What It Logs:
  //       // Actions taken by users within the system (e.g., creating, editing, or deleting records).
  //       // System-level activities like scheduled jobs running or automated tasks.
  //       // Example:
  //       // User X created a new project on October 10, 2024.
  //       // The system backed up data at 2:00 AM.
  //     },
  //     {
  //       label: "Access Logs",
  //       path: "/security/access-logs",
  //       acl: ["view system logs"],

  //       //                 Purpose: Track access-related events, usually focused on authentication and authorization.
  //       // What It Logs:
  //       // User login attempts (successful or failed).
  //       // API or admin access points.
  //       // IP addresses, session details, device info.
  //       // Example:
  //       // User Y logged in from IP 192.168.1.1 on October 10, 2024.
  //       // Failed login attempt for user Z at 3:30 PM.
  //     },
  //     {
  //       label: "Audit Trails",
  //       path: "/security/audit-trails",
  //       acl: ["view system logs"],

  //       // Purpose: Provide a chronological record of changes or actions taken, often for compliance or security purposes.
  //       // What It Logs:
  //       // Changes to sensitive or critical data (e.g., user roles, settings, financial transactions).
  //       // Who made the changes, when, and what the changes were.
  //       // Example:
  //       // User X changed the role of User Y from "Viewer" to "Admin" on October 10, 2024.
  //       // User Z updated the payment details for order #12345.
  //     },
  //     // {
  //     //     label: "Security Alerts",
  //     //     path: "/security/suspicious-accounts",
  //     //     acl: ["view suspicious accounts"],
  //     // },
  //     // {
  //     //     label: "IP Blacklist",
  //     //     path: "/security/ip-blacklist",
  //     //     acl: ["view ip blacklist"],
  //     // },
  //     // {
  //     //     label: "Security Logs",
  //     //     path: "/security/security-logs",
  //     //     acl: ["view security logs"],
  //     // },
  //   ],
  // },
  // {
  //   label: "Settings",
  //   path: "/settings",
  //   icon: <CogBagdedIcon />,
  //   acl: [
  //     "view settings",
  //     "view temporary institutions",
  //     "view finance",
  //     "view user management",
  //     "view roles and permissions",
  //     "view system logs",
  //     "view email templates",
  //   ],
  //   children: [
  //     {
  //       label: "General",
  //       path: "/settings/general",
  //       acl: ["view settings"],
  //     },
  //     {
  //       label: "Temporary Insitutions",
  //       path: "/settings/temporary-institutions",
  //       acl: ["view temporary institutions"],
  //     },
  //     {
  //       label: "Document Types",
  //       path: "/settings/document-types",
  //       acl: ["view document types"],
  //     },
  //     // {
  //     //     label: "Finance",
  //     //     path: "/settings/finance",
  //     // },
  //     {
  //       label: "User Management",
  //       path: "/settings/user-management",
  //       acl: ["view user management"],
  //     },
  //   ],
  // },
];
