import { Button } from "@/components/ui/button";
import Link from "next/link";
import dashboardContent from "@/data/dashboard";

export default function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Hero Section */}
      <div className="flex items-center justify-center bg-banner-image relative h-[calc(100vh-4rem)] w-full">
        <div className="absolute top-0 left-0 w-full h-full bg-blackOverlay" />
        <div className="flex flex-col w-4/5 lg:w-[900px] gap-4 z-10">
          <div className="flex flex-col items-center gap-8 flex-1 p-4">
            <p className="text-3xl md:text-5xl lg:text-7xl lg:w-[800px] text-center font-semibold text-background">
              {dashboardContent.title}
            </p>
            <p className="text-sm md:text-base text-justify leading-8 text-background">
              {dashboardContent.description}
            </p>
          </div>
          <div className="flex justify-center md:flex-row flex-col gap-4">
            <Link href="/dashboard/request-accommodation">
              <Button className="p-6 rounded-xl w-full md:w-auto">
                {dashboardContent.actionBtns.requestAccommodation.label}
              </Button>
            </Link>
            <Link href="/dashboard/view-requests">
              <Button className="p-6 rounded-xl w-full md:w-auto" variant="secondary">
                {dashboardContent.actionBtns.viewRequests.label}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Instructions Section */}
      <div className="my-4 flex flex-col justify-start gap-4 w-4/5 lg:w-[900px]">
        <p className="text-2xl font-semibold">{dashboardContent.instructions.title}</p>
        <div className="grid grid-rows-2 lg:grid-rows-1 lg:grid-cols-2 gap-4 w-full">
          {dashboardContent.instructions.steps.map((step, index) => (
            <div key={index} className="flex flex-col gap-4 rounded-md p-4 shadow-lg card">
              <div className="flex gap-4">
                <step.icon />
                <p className="text-lg font-semibold">{step.title}</p>
              </div>
              <p className="text-sm text-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
