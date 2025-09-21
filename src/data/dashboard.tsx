import { ReactNode } from "react";
import { MonitorCog, Upload } from "lucide-react";

type DashboardContentType = {
  title: string;
  description: string;
  actionBtns: {
    requestAccommodation: {
      label: string;
    };
    viewRequests: {
      label: string;
    };
  };
  instructions: {
    title: string;
    steps: {
      title: string;
      icon: () => ReactNode;
      description: string;
    }[];
  };
};

const dashboardContent: DashboardContentType = {
  title: "SUSL Hostel Management System",
  description:
    "A streamlined solution for managing accommodation requests. Deans can easily submit new hostel assignments, while designated authorities can quickly review, approve, or reject each request with full transparency. Enjoy a secure, efficient process that keeps everyone informed and on schedule.",
  actionBtns: {
    requestAccommodation: {
      label: "Request Accommodation",
    },
    viewRequests: {
      label: "View Requests",
    },
  },
  instructions: {
    title: "How does it work?",
    steps: [
      {
        title: "Submit a request",
        icon: () => <Upload />,
        description: "Fill in the request form with the necessary details and submit it.",
      },
      {
        title: "Monitor your requests",
        icon: () => <MonitorCog />,
        description: "Monitor your requests and view the status of your requests.",
      },
    ],
  },
};

export default dashboardContent;
