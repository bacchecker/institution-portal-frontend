import React, { useCallback, useState, useEffect } from "react";
import {
  TableCell,
  TableRow,
} from "@nextui-org/react";
import CustomTable from "@/components/CustomTable";

export default function DocumentTypes({data}) {
    const [isLoading, setIsLoading] = useState(false);
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");

  return (
    <div>

        <section className="md:px-3 md:w-full w-[98vw] mx-auto">
            <CustomTable
            columns={[
                "Dcoument Name",
                "Formats",
                "Document Fee",
                "Printing Fee",
                "Validation Fee",
                "Verification Fee",
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
                    <TableCell>{item?.document_type.name} </TableCell>
                    <TableCell>
                    {item.soft_copy && "Soft Copy"}
                    {item.soft_copy && item.hard_copy && ", "}
                    {item.hard_copy && "Hard Copy"}
                    </TableCell>
                    <TableCell>{item?.document_type?.base_fee}</TableCell>
                    <TableCell>{item?.document_type?.printing_fee}</TableCell>
                    <TableCell>{item?.document_type?.validation_fee}</TableCell>
                    <TableCell>{item?.document_type?.verification_fee}</TableCell>
                </TableRow>
            ))}
            </CustomTable>
            
        </section>
    </div>
  );
}
