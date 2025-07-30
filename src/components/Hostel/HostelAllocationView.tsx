"use client";

import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { Hostel, HostelAllocation } from "@/db/schema";
import { PlusIcon } from "lucide-react";
import { motion } from "motion/react";
import Dialog from "../Dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Divider from "../Divider";
import HostelCard from "./HostelCard";
import { Button } from "../ui/button";
import HostelAllocationListItem from "./HostelAllocationListItem";

type HostelAllocationProps = PropsWithChildren<{
  maleStudentCount: number;
  femaleStudentCount: number;
  hostels: Hostel[];
  hostelAllocations: HostelAllocation[];
}>;

type CategorizedHostels = {
  male: {
    selected: Hostel[];
    available: Hostel[];
    unavailable: Hostel[];
  };
  female: {
    selected: Hostel[];
    available: Hostel[];
    unavailable: Hostel[];
  };
};

export default function HostelAllocationView(props: HostelAllocationProps) {
  const { maleStudentCount, femaleStudentCount, hostels, hostelAllocations, children } = props;
  const [isAddingMenuOpen, setIsAddingMenuOpen] = useState<boolean>(false);
  const [categorizedHostels, setCategorizedHostels] = useState<CategorizedHostels | null>(null);
  const [currentSelectedHostels, setCurrentSelectedHostels] = useState<Hostel[]>([]);

  useEffect(() => {
    setCategorizedHostels((prevState) => {
      const categorizedHostels: CategorizedHostels = {
        male: {
          selected: prevState?.male.selected ?? [],
          available: hostels.filter((hostel) => hostel.type === "male" && hostel.available_capacity > 0),
          unavailable: hostels.filter((hostel) => hostel.type === "male" && hostel.available_capacity === 0),
        },
        female: {
          selected: prevState?.female.selected ?? [],
          available: hostels.filter((hostel) => hostel.type === "female" && hostel.available_capacity > 0),
          unavailable: hostels.filter((hostel) => hostel.type === "female" && hostel.available_capacity === 0),
        },
      };
      return categorizedHostels;
    });
  }, [hostels]);

  const updateSelectedHostels = (hostel: Hostel, checked: boolean) => {
    const gender = hostel.type;
    if (checked) {
      setCurrentSelectedHostels((prevState) => [...prevState, hostel]);
      setCategorizedHostels((prevState) => {
        if (!prevState) return null;
        return {
          ...prevState,
          [gender]: {
            selected: [...prevState[gender].selected, hostel],
            available: prevState[gender].available.filter((h) => h.id !== hostel.id),
            unavailable: prevState[gender].unavailable,
          },
        };
      });
    } else {
      setCurrentSelectedHostels((prevState) => prevState.filter((h) => h.id !== hostel.id));
      setCategorizedHostels((prevState) => {
        if (!prevState) return null;
        return {
          ...prevState,
          [gender]: {
            selected: prevState[gender].selected.filter((h) => h.id !== hostel.id),
            available: [...prevState[gender].available, hostel],
            unavailable: prevState[gender].unavailable,
          },
        };
      });
    }
  };

  const handleCancel = () => {
    setCategorizedHostels((prevState) => {
      if (!prevState) return null;
      return {
        ...prevState,
        male: {
          selected: prevState.male.selected.filter((h) => !currentSelectedHostels.includes(h)),
          available: [...prevState.male.available, ...currentSelectedHostels],
          unavailable: prevState.male.unavailable,
        },
        female: {
          selected: prevState.female.selected.filter((h) => !currentSelectedHostels.includes(h)),
          available: [...prevState.female.available, ...currentSelectedHostels],
          unavailable: prevState.female.unavailable,
        },
      };
    });
    setCurrentSelectedHostels([]);
    setIsAddingMenuOpen(false);
  };

  const handleShow = (show: boolean) => {
    if (!show) {
      setCategorizedHostels((prevState) => {
        if (!prevState) return null;
        return {
          ...prevState,
          male: {
            selected: prevState.male.selected.filter((h) => !currentSelectedHostels.includes(h)),
            available: [...prevState.male.available, ...currentSelectedHostels],
            unavailable: prevState.male.unavailable,
          },
          female: {
            selected: prevState.female.selected.filter((h) => !currentSelectedHostels.includes(h)),
            available: [...prevState.female.available, ...currentSelectedHostels],
            unavailable: prevState.female.unavailable,
          },
        };
      });
      setCurrentSelectedHostels([]);
    }
    setIsAddingMenuOpen(show);
  };

  const handleAdd = () => {
    setCurrentSelectedHostels([]);
    setIsAddingMenuOpen(false);
  };

  const displaySelectedHostels = useMemo(() => {
    if (hostelAllocations.length > 0) {
      return true;
    }

    if (categorizedHostels) {
      if (categorizedHostels.male.selected.length > 0 || categorizedHostels.female.selected.length > 0) {
        return true;
      }
    }

    return false;
  }, [hostelAllocations, categorizedHostels]);

  const handleAllocationItemDelete = (hostel: Hostel) => {
    setCategorizedHostels((prevState) => {
      if (!prevState) return null;

      const gender = hostel.type;
      return {
        ...prevState,
        [gender]: {
          ...prevState[gender],
          selected: prevState[gender].selected.filter((h) => h.id !== hostel.id),
          available: [...prevState[gender].available, hostel],
        },
      };
    });
  };

  return (
    <div className="flex w-full h-[600px] rounded-md border p-4">
      {/* Allocation view */}
      {displaySelectedHostels ? (
        <div className="w-full flex flex-col gap-4">
          <div className="w-full flex items-center gap-4 border-b pb-4">
            <p className="text-paragraph">Allocations Remaining:</p>
            <p className="text-paragraph">{`Male Students: ${maleStudentCount}`}</p>
            <p className="text-paragraph">{`Female Students: ${femaleStudentCount}`}</p>
            <Button className="ml-auto" onClick={() => setIsAddingMenuOpen(true)}>
              Add Hostels
            </Button>
          </div>
          <div className="w-full flex flex-col flex-1">
            {/* Header */}
            <div className="flex items-center">
              <p className="text-heading-1">Hostels</p>
            </div>
            <div className="grid grid-cols-2 divide-x-[1px] flex-1">
              <div className="h-full flex flex-col gap-2 overflow-y-auto pr-4">
                {/* Allocations */}
                {categorizedHostels && categorizedHostels.male.selected.length > 0 ? (
                  categorizedHostels.male.selected.map((hostel) => (
                    <HostelAllocationListItem
                      key={hostel.id}
                      hostel={hostel}
                      currentAllocations={0}
                      maxAllocations={maleStudentCount}
                      onAllocationsChange={() => console.log("Allocations Change")}
                      onClick={() => console.log("Select")}
                      onDelete={() => handleAllocationItemDelete(hostel)}
                    />
                  ))
                ) : (
                  <p className="h-full flex items-center justify-center text-paragraph">No Male Hostels Added</p>
                )}
              </div>
              <div className="h-full flex flex-col gap-2 overflow-y-auto pl-4">
                {categorizedHostels && categorizedHostels.female.selected.length > 0 ? (
                  categorizedHostels.female.selected.map((hostel) => (
                    <HostelAllocationListItem
                      key={hostel.id}
                      hostel={hostel}
                      currentAllocations={0}
                      maxAllocations={femaleStudentCount}
                      onAllocationsChange={() => console.log("Allocations Change")}
                      onClick={() => console.log("Select")}
                      onDelete={() => handleAllocationItemDelete(hostel)}
                    />
                  ))
                ) : (
                  <p className="h-full flex items-center justify-center text-paragraph">No Female Hostels Added</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <motion.p
            className="text-gray-500 cursor-pointer flex gap-2 items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            onClick={() => setIsAddingMenuOpen(true)}
          >
            <PlusIcon className="w-4 h-4" />
            Add Allocations
          </motion.p>
        </div>
      )}

      {/* Adding menu */}
      <Dialog show={isAddingMenuOpen} setShow={handleShow}>
        <div className="w-[600px] h-[600px] bg-background rounded-md p-4 flex flex-col gap-4">
          <div className="flex">
            <div className="flex flex-col gap-2">
              <h3 className="text-heading-1">Select the Hostels</h3>
              <p className="text-paragraph">Select the hostels to allocate to the students.</p>
            </div>
            <div className="flex gap-2 ml-auto">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                disabled={
                  categorizedHostels?.male.selected.length === 0 && categorizedHostels?.female.selected.length === 0
                }
                onClick={handleAdd}
              >
                Add
              </Button>
            </div>
          </div>
          <Divider />
          <Tabs className="flex-1 overflow-y-auto" defaultValue="male">
            <TabsList>
              <TabsTrigger value="male">Male</TabsTrigger>
              <TabsTrigger value="female">Female</TabsTrigger>
            </TabsList>
            <TabsContent value="male">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <h3 className="text-heading-1">Selected Hostels</h3>
                  {categorizedHostels && categorizedHostels.male.selected.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {categorizedHostels.male.selected.map((hostel) => (
                        <HostelCard
                          key={hostel.id}
                          hostel={hostel}
                          selected={true}
                          onSelectionChange={updateSelectedHostels}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-paragraph">No selected hostels</p>
                  )}
                </div>
                <Divider />
                <div className="flex flex-col gap-2">
                  <h3 className="text-heading-1">Available Hostels</h3>
                  {categorizedHostels && categorizedHostels.male.available.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {categorizedHostels.male.available.map((hostel) => (
                        <HostelCard
                          key={hostel.id}
                          hostel={hostel}
                          selected={false}
                          onSelectionChange={updateSelectedHostels}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-paragraph">No available hostels</p>
                  )}
                </div>
                {categorizedHostels && categorizedHostels.male.unavailable.length > 0 && (
                  <>
                    <Divider />
                    <div className="flex flex-col gap-2">
                      <h3 className="text-heading-1">Unavailable Hostels</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {categorizedHostels.male.unavailable.map((hostel) => (
                          <HostelCard
                            key={hostel.id}
                            hostel={hostel}
                            selected={false}
                            onSelectionChange={updateSelectedHostels}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>
            <TabsContent value="female">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <h3 className="text-heading-1">Selected Hostels</h3>
                  {categorizedHostels && categorizedHostels.female.selected.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {categorizedHostels.female.selected.map((hostel) => (
                        <HostelCard
                          key={hostel.id}
                          hostel={hostel}
                          selected={true}
                          onSelectionChange={updateSelectedHostels}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-paragraph">No selected hostels</p>
                  )}
                </div>
                <Divider />
                <div className="flex flex-col gap-2">
                  <h3 className="text-heading-1">Available Hostels</h3>
                  {categorizedHostels && categorizedHostels.female.available.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {categorizedHostels.female.available.map((hostel) => (
                        <HostelCard
                          key={hostel.id}
                          hostel={hostel}
                          selected={false}
                          onSelectionChange={updateSelectedHostels}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-paragraph">No available hostels</p>
                  )}
                </div>
                {categorizedHostels && categorizedHostels.female.unavailable.length > 0 && (
                  <>
                    <Divider />
                    <div className="flex flex-col gap-2">
                      <h3 className="text-lg font-bold text-primary">Unavailable Hostels</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {categorizedHostels.female.unavailable.map((hostel) => (
                          <HostelCard
                            key={hostel.id}
                            hostel={hostel}
                            selected={false}
                            onSelectionChange={updateSelectedHostels}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Dialog>
    </div>
  );
}
