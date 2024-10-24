import React from "react";
import CustomTable from "@components/CustomTable";
import { Spinner } from "@nextui-org/react";
import useSWR from "swr";
import axios from "@utils/axiosConfig";

function LetterTemplatesTable() {
  const {
    data: letterTemplates,
    error: letterTemplatesError,
    isLoading: letterTemplatesLoading,
  } = useSWR("/institution/letter-templates", (url) =>
    axios.get(url).then((res) => res.data)
  );

  console.log("letterTemplates",letterTemplates);
  

  return (
    <section className="md:w-full w-[98vw] min-h-[60vh] mx-auto">
      {letterTemplatesLoading ? (
        <div className="w-full h-[5rem] flex justify-center items-center">
          <Spinner size="sm" color="danger" />
        </div>
      ) : (
        <>
          <CustomTable
            columns={[
              "Name",
              "Successful Validation Message",
              "Unsuccessful Validation Message",
              "Successful Verification Message",
              "Unsuccessful Verification Message",
              "",
            ]}
            // loadingState={resData ? false : true}
            // page={resData?.current_page}
            // setPage={(page) =>
            //   navigate({
            //     // pathname: "listing",
            //     search: createSearchParams({ ...filters, page }).toString(),
            //   })
            // }
            // totalPages={Math.ceil(resData?.total / resData?.per_page)}
          >
            {/* {institutionDocuments?.data?.types?.map((item) => (
              <TableRow key={item?.id}>
                <TableCell>{item?.document_type?.name}</TableCell>
                <TableCell>
                  {item?.soft_copy && item?.hard_copy
                    ? "hard copy, soft copy"
                    : !item?.soft_copy && item?.hard_copy
                    ? "hard copy"
                    : "soft copy"}
                </TableCell>
                <TableCell>GH¢ {item?.base_fee}</TableCell>
                <TableCell>GH¢ {item?.printing_fee}</TableCell>
                <TableCell>GH¢ {item?.validation_fee}</TableCell>
                <TableCell> GH¢ {item?.verification_fee}</TableCell>
                <TableCell className="flex items-center h-16 gap-3">
                  <Dropdown>
                    <DropdownTrigger>
                      <Button variant="bordered" size="sm" isIconOnly>
                        <Elipsis />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Static Actions">
                      <DropdownItem
                        key="edit"
                        onClick={() => {
                          setSelectedData(item);
                          setOpenEditDrawer(true);
                        }}
                      >
                        Update
                      </DropdownItem>
                      <DropdownItem
                        key="delete"
                        onClick={() => {
                          deleteDisclosure.onOpen();
                          setSelectedData(item);
                        }}
                      >
                        Delete
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </TableCell>
              </TableRow>
            ))} */}
          </CustomTable>
        </>
      )}
    </section>
  );
}

export default LetterTemplatesTable;
