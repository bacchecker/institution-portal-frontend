import React from "react";
import CustomTable from "@components/CustomTable";
import { Spinner, TableCell, TableRow } from "@nextui-org/react";

function LetterTemplatesTable({ letterTemplates, letterTemplatesLoading }) {
  console.log("letterTemplates", letterTemplates);

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
              "Successful Validation Letter",
              "Unsuccessful Validation Letter",
              "Successful Verification Letter",
              "Unsuccessful Verification Letter",
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
            {letterTemplates?.data?.map((item) => (
              <TableRow key={item?.id}>
                <TableCell>{item?.document_type?.name}</TableCell>
                <TableCell>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: item?.positive_validation_response,
                    }}
                  />
                </TableCell>
                <TableCell>GH¢ {item?.base_fee}</TableCell>
                <TableCell>GH¢ {item?.printing_fee}</TableCell>
                <TableCell>GH¢ {item?.validation_fee}</TableCell>
                <TableCell> GH¢ {item?.verification_fee}</TableCell>
                
              </TableRow>
            ))}
          </CustomTable>
        </>
      )}
    </section>
  );
}

export default LetterTemplatesTable;
