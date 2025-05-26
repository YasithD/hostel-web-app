import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function Dashboard() {
  return (
    <div className="flex items-center justify-center h-full">
      {/* Hero Section */}
      <div className="flex flex-col w-4/5 md:w-[900px] gap-4">
        <div className="flex flex-col items-center gap-4 flex-1 p-4">
          <p className="text-5xl text-center font-semibold">SUSL Hostel Management System</p>
          <p className="text-lg text-justify leading-8 text-gray-500">
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
            <Button className="p-6 rounded-xl w-full md:w-auto" variant="outline">
              View Past Requests
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
