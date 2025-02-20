import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import React from "react";

const ConfirmModal = ({
  title,
  size,
  children,
  disclosure,
  onButtonClick,
  processing = false,
}) => {
  return (
    <Modal
      backdrop={"opaque"}
      isOpen={disclosure.isOpen}
      onClose={disclosure.onClose}
      className="border-[1px]  w-full"
      size={size}
      radius="sm"
      motionProps={{
        variants: {
          enter: {
            scale: [1, 0.9],
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            scale: [0.9, 1],
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        },
      }}
    >
      <ModalContent>
        {(onCloseModal) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-green-500 font-bold">
              {title}
            </ModalHeader>
            <ModalBody>{children}</ModalBody>
            <ModalFooter>
              <Button
                className="font-medium"
                color="default"
                variant="flat"
                radius="sm"
                onPress={onCloseModal}
              >
                Cancel
              </Button>
              <Button
                isLoading={processing}
                className="font-medium"
                color="success"
                type="submit"
                radius="sm"
                form="form"
                onClick={onButtonClick}
              >
                Confirm
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ConfirmModal;
