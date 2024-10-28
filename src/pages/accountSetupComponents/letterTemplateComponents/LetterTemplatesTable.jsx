import React from "react";
import CustomTable from "@components/CustomTable";
import { Spinner, TableCell, TableRow } from "@nextui-org/react";
import secureLocalStorage from "react-secure-storage";

function LetterTemplatesTable({
  letterTemplates,
  letterTemplatesLoading,
  setCurrentScreen,
}) {
  const institution = secureLocalStorage.getItem("institution");
  const setInstitution = (newInstitution) => {
    secureLocalStorage.setItem("institution", newInstitution);
  };

  const templateScreen = JSON.parse(institution?.template_screens);

  const handleSelectedTemplate = (item) => {
    secureLocalStorage.setItem("selectedTemplate", item);
    setCurrentScreen(3);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    const updatedInstitution = {
      ...institution,
      template_screens: JSON.stringify([3, 1, 1]),
    };
    setInstitution(updatedInstitution);
    secureLocalStorage.setItem("institution", updatedInstitution);
  };

  console.log("templateScreen", templateScreen);

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
                <TableCell>
                  {item?.document_type?.document_type?.name}
                </TableCell>
                <TableCell>
                  <div
                    className="ellipsis"
                    dangerouslySetInnerHTML={{
                      __html:
                        item?.positive_validation_response ||
                        "<p>No template</p>",
                    }}
                  />
                </TableCell>

                <TableCell>
                  <div
                    className="ellipsis"
                    dangerouslySetInnerHTML={{
                      __html:
                        item?.negative_validation_response ||
                        "<p>No template</p>",
                    }}
                  />
                </TableCell>
                <TableCell>
                  <div
                    className="ellipsis"
                    dangerouslySetInnerHTML={{
                      __html:
                        item?.positive_verification_response ||
                        "<p>No template</p>",
                    }}
                  />
                </TableCell>
                <TableCell>
                  <div
                    className="ellipsis"
                    dangerouslySetInnerHTML={{
                      __html:
                        item?.negative_verification_response ||
                        "<p>No template</p>",
                    }}
                  />
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => handleSelectedTemplate(item)}
                    className="w-fit h-fit border border-[#000] text-[0.9rem] px-4 py-1 text-[#000] rounded-[0.3rem] hover:bg-black hover:text-white transition-all duration-200"
                  >
                    view
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </CustomTable>
        </>
      )}
    </section>
  );
}

export default LetterTemplatesTable;
