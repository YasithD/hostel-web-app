import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="flex items-center justify-center h-full bg-banner-image relative">
      <div className="absolute top-0 left-0 w-full h-full bg-blackOverlay" />
      {/* Hero Section */}
      <div className="flex flex-col w-4/5 md:w-[900px] gap-4 z-10">
        <div className="flex flex-col items-center gap-8 flex-1 p-4">
          <p className="text-7xl w-[800px] text-center font-semibold text-background">SUSL Hostel Management System</p>
          <p className="text-base text-justify leading-8 text-background">
            A streamlined solution for managing accommodation requests. Deans can easily submit new hostel assignments,
            while designated authorities can quickly review, approve, or reject each request with full transparency.
            Enjoy a secure, efficient process that keeps everyone informed and on schedule.
          </p>
        </div>
        <div className="flex justify-center md:flex-row flex-col gap-4">
          <Link href="/dashboard/request-accommodation">
            <Button className="p-6 rounded-xl w-full md:w-auto">Request Accommodation</Button>
          </Link>
          <Link href="/dashboard/view-requests">
            <Button className="p-6 rounded-xl w-full md:w-auto" variant="secondary">
              View Past Requests
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
