import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
} from "@/components/ui/table";

export default function RequestInfo({ request }) {
  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">Date</TableCell>
          <TableCell>{request.date}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell className="font-medium">Company</TableCell>
          <TableCell>{request.company}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell className="font-medium">Requester</TableCell>
          <TableCell>{request.requester}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell className="font-medium">Device Model</TableCell>
          <TableCell>{request.device_model}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell className="font-medium">Description</TableCell>
          <TableCell>{request.description}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
