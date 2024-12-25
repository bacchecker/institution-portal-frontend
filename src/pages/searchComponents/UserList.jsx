import React, { useCallback, useState, useEffect } from "react";
import {
  TableCell,
  TableRow,
} from "@nextui-org/react";
import CustomTable from "@/components/CustomTable";

export default function UserList({data}) {
    const [isLoading, setIsLoading] = useState(false);
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");

  return (
    <div>

        <section className="md:px-3 md:w-full w-[98vw] mx-auto">
            <CustomTable
            columns={[
                "Full Name",
                "Email",
                "Phone Number",
                "Department",
                "Address",
            ]}
            loadingState={isLoading}
            columnSortKeys={{
                ID: "unique_code",
                "Requested By": "user_full_name",
                "Delivery Address": "delivery_address",
                Date: "created_at",
                Document: "document_type_name",
                Format: "document_format",
                Status: "status",
                Amount: "total_amount",
            
            }}
            sortBy={sortBy}
            sortOrder={sortOrder}
            setSortBy={setSortBy}
            setSortOrder={setSortOrder}
            >
            {data?.map((item) => (
                <TableRow key={item?.id} className="odd:bg-gray-100 even:bg-gray-50 border-b">
                    <TableCell>{item?.first_name} {item?.other_name} {item?.last_name}</TableCell>
                    <TableCell>{item?.email}</TableCell>
                    <TableCell>{item?.phone}</TableCell>
                    <TableCell>{item?.department?.name}</TableCell>
                    <TableCell>{item?.address}</TableCell>
                </TableRow>
            ))}
            </CustomTable>
            
        </section>
    </div>
  );
}
