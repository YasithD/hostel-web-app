"use client";

import { useMemo, useState } from "react";
import { debounce } from "lodash";
import { Hostel } from "@/db/schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import NumberInput from "./NumberInput";
import { Button } from "../ui/button";

type HostelAllocationProps = {
  maleStudentCount: number;
  femaleStudentCount: number;
  hostels: Hostel[];
  onSelect: (allocations: AllocationProps[]) => void;
};

export type AllocationProps = {
  hostelId: string;
  gender: string;
  studentsAllocated: number;
};

export default function HostelAllocationView(props: HostelAllocationProps) {
  const { maleStudentCount, femaleStudentCount, hostels, onSelect } = props;
  const [editable, setEditable] = useState(true);
  const [gender, setGender] = useState<string>("male");
  const [allocations, setAllocations] = useState<AllocationProps[]>(() => {
    return hostels.map((hostel) => ({
      hostelId: hostel.id,
      gender: hostel.type,
      studentsAllocated: 0,
    }));
  });
  const [remainingMaleAllocations, setRemainingMaleAllocations] = useState(maleStudentCount);
  const [remainingFemaleAllocations, setRemainingFemaleAllocations] = useState(femaleStudentCount);

  const updateAllocations = debounce((allocation: AllocationProps) => {
    const filteredAllocations = allocations.filter((al) => al.hostelId !== allocation.hostelId);
    setAllocations([...filteredAllocations, allocation]);
  }, 300);

  const handleBtnAction = () => {
    if (editable) {
      onSelect(allocations.filter((al) => al.studentsAllocated > 0));
    }
    setEditable(!editable);
  };

  const handleEdit = () => {
    setEditable(true);
  };

  const isDisabled = useMemo(() => {
    return editable && (remainingMaleAllocations > 0 || remainingFemaleAllocations > 0);
  }, [editable, remainingMaleAllocations, remainingFemaleAllocations]);

  return (
    <div className="flex flex-col gap-4 rounded-md border">
      <div className="flex flex-col gap-4 relative p-4">
        {!editable && <div className="absolute inset-0 bg-muted/50" />}
        <div className="flex gap-4 items-center">
          <p className="text-lg font-bold text-primary">Hostel Allocations</p>
          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Male: {remainingMaleAllocations}, Female: {remainingFemaleAllocations}
          </p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hostel</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Available</TableHead>
              <TableHead>Allocated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hostels.map((hostel) => {
              if (hostel.type === gender && hostel.available_capacity > 0) {
                return (
                  <TableRow key={hostel.id}>
                    <TableCell>{hostel.name}</TableCell>
                    <TableCell>{hostel.total_capacity}</TableCell>
                    <TableCell>{hostel.available_capacity}</TableCell>
                    <TableCell>
                      <NumberInput
                        max={hostel.available_capacity}
                        limit={gender === "male" ? remainingMaleAllocations : remainingFemaleAllocations}
                        onChange={(value) =>
                          updateAllocations({ hostelId: hostel.id, gender: gender, studentsAllocated: value })
                        }
                        onLimitChange={(limit) => {
                          if (gender === "male") {
                            setRemainingMaleAllocations(limit);
                          } else {
                            setRemainingFemaleAllocations(limit);
                          }
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              }
            })}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end p-4">
        <Button variant={editable ? "outline" : "default"} disabled={isDisabled} onClick={handleBtnAction}>
          {editable ? "Select" : "Edit"}
        </Button>
      </div>
    </div>
  );
}
