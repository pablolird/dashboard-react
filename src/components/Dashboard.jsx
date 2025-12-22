import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "./ui/data-table";
import { createColumnHelper } from "@tanstack/react-table";
import { useRequestState } from "../RequestContext";
import SubmitActivity from "./SubmitActivity";
import DefaultHeader from "./ui/default-header";
import { WifiOff } from "lucide-react";
import { Wifi } from "lucide-react";
import { Toaster } from "sonner";
// const fakeRequests = Array.from({ length: 200 }).map((_, i) => ({
//   date: `2025-01-${(i % 30) + 1}`,
//   company: `Company ${i}`,
//   requester: `User ${i}`,
//   device_model: `Model ${i}`,
//   description: `This is a long description for item #${i}`,
//   create_activity: `Created at ${new Date().toLocaleString()}`,
// }));

const columnHelper = createColumnHelper();
const pending_columns = [
  columnHelper.accessor("date", {
    header: (info) => <DefaultHeader info={info} name={"Date"} />,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("company", {
    header: (info) => <DefaultHeader info={info} name={"Company"} />,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("requester", {
    header: (info) => <DefaultHeader info={info} name={"Requester"} />,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("device_model", {
    header: (info) => <DefaultHeader info={info} name={"Device Model"} />,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("description", {
    header: (info) => <DefaultHeader info={info} name={"Description"} />,
    cell: (info) => {
      const value = info.getValue();
      return value && value.length > 20 ? value.slice(0, 20) + "…" : value;
    },
  }),
  columnHelper.accessor("create_activity", {
    header: () => "Create Activity",
    cell: (info) => <SubmitActivity request={info.row.original} />,
  }),
];

const scheduled_columns = [
  columnHelper.accessor("date", {
    header: (info) => <DefaultHeader info={info} name={"Scheduled Date"} />,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("company", {
    header: (info) => <DefaultHeader info={info} name={"Company"} />,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("requester", {
    header: (info) => <DefaultHeader info={info} name={"Requester"} />,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("device_model", {
    header: (info) => <DefaultHeader info={info} name={"Device Model"} />,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("description", {
    header: (info) => <DefaultHeader info={info} name={"Description"} />,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("assigned_technician", {
    header: (info) => (
      <DefaultHeader info={info} name={"Assigned Technician"} />
    ),
    cell: (info) => info.getValue(),
  }),
];

export default function Dashboard() {
  const { requests, isSocketConnected } = useRequestState();
  console.log(isSocketConnected);

  const filteredRequests = {
    pending: requests.filter((r) => r.request_status === "PENDING"),
    scheduled: requests.filter((r) => r.request_status === "SCHEDULED"),
    in_progress: requests.filter((r) => r.request_status === "IN PROGRESS"),
    resolved: requests.filter((r) => r.request_status === "RESOLVED"),
    closed: requests.filter((r) => r.request_status === "CLOSED"),
  };

  return (
    <div className="relative w-full h-full  overflow-hidden">
      <Toaster></Toaster>
      <Tabs
        defaultValue="pending"
        className="bg-background w-full h-full flex flex-col justify-start items-center"
      >
        <TabsList className="mt-5">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="in-progress">In progress</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="h-full">
          <DataTable
            columns={pending_columns}
            data={filteredRequests.pending}
          />
        </TabsContent>
        <TabsContent className="h-full" value="scheduled">
          <DataTable
            columns={scheduled_columns}
            data={filteredRequests.scheduled}
          />
        </TabsContent>
        <TabsContent className="h-full" value="in-progress">
          <DataTable
            columns={scheduled_columns}
            data={filteredRequests.in_progress}
          />
        </TabsContent>
        <TabsContent className="h-full" value="resolved">
          <DataTable
            columns={scheduled_columns}
            data={filteredRequests.resolved}
          />
        </TabsContent>
        <TabsContent className="h-full" value="closed">
          <DataTable
            columns={scheduled_columns}
            data={filteredRequests.closed}
          />
        </TabsContent>
      </Tabs>
      <div className="absolute flex gap-1 p-1 bottom-0 left-0">
        {isSocketConnected ? (
          <>
            <Wifi className="text-green-500 animate-blink" />
            <p className="text-green-500 animate-blink">Connected</p>
          </>
        ) : (
          <>
            <WifiOff className="text-red-500 animate-blink" />
            <p className="text-red-500 animate-blink">Disconnected</p>
          </>
        )}
      </div>
    </div>
  );
}
