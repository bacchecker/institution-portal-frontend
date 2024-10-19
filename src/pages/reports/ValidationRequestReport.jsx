import {
  Button,
  Card,
  CardBody,
  DateRangePicker,
  Input,
  Select,
  SelectItem,
  TableCell,
  TableRow,
} from "@nextui-org/react";
import React, { useState } from "react";
import useSWR from "swr";
import axios from "@utils/axiosConfig";
import CustomTable from "@components/CustomTable";
import moment from "moment";
import StatusChip from "@components/status-chip";
import { createSearchParams, useSearchParams } from "react-router-dom";

function ValidationRequestReport() {
  const institution_id = JSON?.parse(localStorage.getItem("auth-storage"))
    ?.state?.institution?.id;

  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    status: searchParams.get("status") || "",
    date_range: searchParams.get("date_range") || "",
  });

  const queryParams = new URLSearchParams();
  if (filters.status) queryParams.append("status", filters.status);
  if (filters.date_range) queryParams.append("date_range", filters.date_range);

  const { data: resData, error } = useSWR(
    `/institution/reports/validation-requests?institution_id=${institution_id}&${queryParams.toString()}`,
    (url) => axios.get(url).then((res) => res.data)
  );

  return (
    <>
      <section>
        <Card className="my-3 md:w-full w-[98vw] mx-auto dark:bg-slate-900 flex justify-end">
          <CardBody className="w-full flex justify-end">
            <form
              method="get"
              className="flex flex-row gap-3 justify-end"
              onSubmit={(e) => {
                e.preventDefault();
                navigate({
                  search: createSearchParams(filters).toString(),
                });
              }}
            >
              <Select
                size="sm"
                placeholder="Status"
                className="max-w-[130px] min-w-[130px]"
                name="status"
                defaultSelectedKeys={[filters?.status]}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                {[
                  {
                    key: "submitted",
                    label: "submitted",
                  },
                  {
                    key: "received",
                    label: "received",
                  },
                  {
                    key: "processing",
                    label: "processing",
                  },
                  {
                    key: "completed",
                    label: "completed",
                  },
                  {
                    key: "cancelled",
                    label: "cancelled",
                  },
                ].map((item) => (
                  <SelectItem key={item.key}>{item.label}</SelectItem>
                ))}
              </Select>

              <Select
                size="sm"
                placeholder="Time Frame"
                className="max-w-[130px] min-w-[130px]"
                name="date_range"
                defaultSelectedKeys={[filters.date_range]}
                onChange={(e) =>
                  setFilters({ ...filters, date_range: e.target.value })
                }
              >
                {[
                  { key: "week", label: "Weekly" },
                  { key: "month", label: "Monthly" },
                  { key: "quarter", label: "Quarterly" },
                  { key: "year", label: "Yearly" },
                ].map((item) => (
                  <SelectItem key={item.key}>{item.label}</SelectItem>
                ))}
              </Select>
            </form>
          </CardBody>
        </Card>
      </section>
      <section className="md:w-full w-[98vw] mx-auto">
        <CustomTable
          columns={[
            "Unique Code",
            "Document Type",
            "Date",
            "Status",
            "Revenue",
          ]}
          loadingState={!resData}
          page={resData?.current_page}
          setPage={(page) =>
            navigate({
              search: createSearchParams({ ...filters, page }).toString(),
            })
          }
          totalPages={Math.ceil(resData?.total / resData?.per_page)}
        >
          {resData?.data?.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-semibold">
                {item.unique_code}
              </TableCell>
              <TableCell>{item.document_type?.name}</TableCell>
              <TableCell>
                {moment(item.created_at).format("MM-DD-YYYY")}
              </TableCell>
              <TableCell>
                <StatusChip status={item.status} />
              </TableCell>
              <TableCell>GH¢ {item.total_amount}</TableCell>
            </TableRow>
          ))}
        </CustomTable>
      </section>
    </>
  );
}

export default ValidationRequestReport;
