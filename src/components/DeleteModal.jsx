import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

const DeleteModal = ({ title, children, disclosure, onButtonClick, processing }) => {
  return (
    <Modal
    radius="none"
      backdrop={"opaque"}
      isOpen={disclosure.isOpen}
      onClose={disclosure.onClose}
      className="border-[1px] w-full md:w-1/2 rounded-sm"
      size="md"
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
            <ModalHeader className="flex flex-col gap-1 text-red-500 font-bold">
              {title}
            </ModalHeader>
            <ModalBody className="rounded-none">{children}</ModalBody>
            <ModalFooter>
              <Button
                className="font-medium"
                color="default"
                variant="flat"
                onPress={onCloseModal}
              >
                Cancel
              </Button>
              <Button
                isLoading={processing}
                className="font-medium bg-[#ff0404] text-white"
                // color="danger"
                type="submit"
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

export default DeleteModal;
