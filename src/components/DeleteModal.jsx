import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

const DeleteModal = ({ title, children, disclosure, onButtonClick }) => {
  return (
    <Modal
      backdrop={"opaque"}
      isOpen={disclosure.isOpen}
      onClose={disclosure.onClose}
      className="dark:bg-slate-900 border-[1px] dark:border-slate-700/20 w-full md:w-1/2"
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
            <ModalBody>{children}</ModalBody>
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
                // isLoading={processing}
                className="font-medium"
                color="danger"
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
