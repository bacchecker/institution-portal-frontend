import MoneyIcon from "./icons/money";
import {
  CogBagdedIcon,
  DashboardIcon,
  PersonCircleIcon,
  TasksListIcon,
} from "./icons/nav";
import { AnalysisIcon } from "./icons/analysis";
import SupportIcon from "./icons/support";
import { SecurityIcon } from "./icons/security";
import { HiClipboardDocumentList } from "react-icons/hi2";

export const navLinks = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <DashboardIcon />,
    profile_complete: ["yes"],
    showOn: ["inactive", "active"],
    showForRoles: ["Admin", "Finance", "Customer Service", "HR"],
    children: [],
  },
  {
    label: "Manage Documents",
    path: "/manage-requests",
    icon: <HiClipboardDocumentList />,
    profile_complete: ["yes"],
    showOn: ["inactive", "active"],
    showForRoles: ["Admin", "Finance", "Customer Service", "HR"],
    children: [],
  },

  /* {
    label: "Requests",
    path: "/requests",
    icon: <TasksListIcon />,
    profile_complete: ["yes"],
    showOn: ["active"],
    showForRoles: ["Admin", "Customer Service"],
    children: [
      {
        label: "Document Requests",
        path: "/requests/document-requests",
      },
      {
        label: "Validation Requests",
        path: "/requests/validation-requests",
      },
      // {
      //   label: "Verification Requests",
      //   path: "/requests/verification-requests",
      // },
    ],
  }, */
  {
    label: "Account Setup",
    path: "/account-setup",
    icon: <PersonCircleIcon />,
    acl: ["view users", "view institutions"],
    profile_complete: ["no"],
    showOn: ["inactive", "active"],
    showForRoles: ["Admin", "HR"],
    children: [
      // {
      //   label: "Profile",
      //   path: "/account-setup",
      //   // path: "/account-setup/profile",
      //   acl: ["view users"],
      // },
      // {
      //   label: "Document Types",
      //   path: "/account-setup/document-types",
      // },
      // {
      //   label: "Operations Certificate",
      //   path: "/account-setup/operations-certificate",
      // },
      // {
      //   label: "Letter Templates",
      //   path: "/account-setup/letter-templates",
      // },
      // {
      //   label: "Setup Team",
      //   path: "/account-setup/institution-teams",
      // },
      // {
      //   label: "Terms & Conditions",
      //   path: "/account-setup/terms-conditions",
      // },
    ],
  },
  {
    label: "Payment Setup",
    path: "/payment-revenue-setup",
    icon: <MoneyIcon />,
    acl: ["view payments"],
    profile_complete: ["yes"],
    showOn: ["active"],
    showForRoles: ["Admin", "Finance"],
    children: [],
  },
  {
    label: "Reports",
    path: "/reports",
    icon: <AnalysisIcon />,
    acl: ["view payments"],
    profile_complete: ["yes"],
    showOn: ["active"],
    showForRoles: ["Admin", "Finance"],
    children: [
      {
        label: "Report Overview ",
        path: "/reports/revenue-overview",
      },
    ],
  },
  {
    label: "Support",
    path: "/supports",
    icon: <SupportIcon />,
    acl: ["view support tickets", "view support ticket categories"],
    profile_complete: ["yes"],
    showOn: ["active"],
    showForRoles: ["Admin", "Finance", "Customer Service", "HR"],
    children: [
      {
        label: "Tickets",
        path: "/supports/tickets",
        acl: ["view support tickets"],
      },
      // {
      //   label: "Feedback",
      //   path: "/supports/my-tickets",
      //   acl: ["view assigned tickets"],
      // },
      // {
      //     label: "Disputes",
      //     path: "/supports/disputes",
      //     acl: ["view disputes"],
      // },
    ],
  },
  {
    label: "Account Settings",
    path: "/account-settings",
    icon: <SecurityIcon />,
    profile_complete: ["yes"],
    showOn: ["active"],
    showForRoles: ["Admin", "HR"],
    acl: [
      "view security logs",
      "view ip blacklist",
      "view suspicious accounts",
    ],
    children: [
      
      {
        label: "Document Types",
        path: "/account-settings/document-types",
        acl: ["view document types"],
      },
      {
        label: "Letter Templates",
        path: "/account-settings/letter-templates",
        acl: ["view letter templates"],
      },
      // {
      //   label: "Roles and Permissions",
      //   path: "/account-settings/roles-permissions",
      //   acl: ["view roles and permissions"],
      // },
      {
        label: "Department Management",
        path: "/account-settings/departments",
        acl: ["view departments"],
      },
      {
        label: "Users Management",
        path: "/account-settings/users",
        acl: ["view users"],
      },
      {
        label: "Account Management",
        path: "/account-settings/account",
        acl: ["view account"],
      },
      
      // {
      //   label: "Activity Logs",
      //   path: "/security/activity-logs",
      //   acl: ["view system logs"],

      //   //                 1. Activity Logs
      //   // Purpose: Track general user and system activities.
      //   // What It Logs:
      //   // Actions taken by users within the system (e.g., creating, editing, or deleting records).
      //   // System-level activities like scheduled jobs running or automated tasks.
      //   // Example:
      //   // User X created a new project on October 10, 2024.
      //   // The system backed up data at 2:00 AM.
      // },
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
    ],
  },
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
  //       label: "User Management",
  //       path: "/settings/user-management",
  //       acl: ["view user management"],
  //     },
  //   ],
  // },
];
