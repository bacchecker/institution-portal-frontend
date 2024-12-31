import { useEffect, useRef } from "react";
import { IoClose, IoExpand } from "react-icons/io5";
import { Button } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Drawer({
  isOpen,
  setIsOpen,
  title,
  children,
  classNames = "w-96",
  detailedView = null,
}) {
  const navigate = useNavigate();
  const bottonDrawerRef = useRef(null);

  // Handle click outside to close drawer
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        bottonDrawerRef.current &&
        !bottonDrawerRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

  }, [isOpen, setIsOpen]);

  const drawerVariants = {
    open: {
      x: 0,
      transition: {
        type: "tween",
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: "100%",
      transition: {
        type: "tween",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "tween" }}
          className="fixed inset-0 bg-black/60 flex justify-end"
        >
          <motion.div
            ref={bottonDrawerRef}
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className={`${classNames} bg-white h-full flex flex-col gap-4 overflow-y-auto vertical-scrollbar`}
          >
            {/* Drawer header */}
            <div className="border-b py-2 px-4 flex justify-between items-center">
              <div className="flex gap-3 items-center">
                {detailedView && (
                  <Button
                    isIconOnly
                    size="sm"
                    variant="bordered"
                    color="primary"
                    startContent={
                      <IoExpand
                        fontSize={18}
                        onClick={() => {
                          navigate(detailedView);
                        }}
                      />
                    }
                  />
                )}
                <h3 className="font-montserrat font-semibold text-gray-900 text-lg">
                  {title}
                </h3>
              </div>
              <Button
                radius="full"
                variant="bordered"
                onPress={() => setIsOpen(false)}
                size="sm"
                isIconOnly
              >
                <IoClose className="size-5" />
              </Button>
            </div>

            {/* Drawer content */}
            <div className="p-4 flex-1">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
