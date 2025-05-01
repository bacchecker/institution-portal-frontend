import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Select,
  SelectItem,
  Spinner,
  Pagination,
  Chip
} from "@nextui-org/react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import axios from "@/utils/axiosConfig";
import { toast } from "sonner";

export default function PaymentAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [formData, setFormData] = useState({
    account_name: "",
    account_number: "",
    bank_name: "",
    bank_branch: "",
    account_type: "savings",
    currency: "USD",
    swift_code: ""
  });
  const [editId, setEditId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose
  } = useDisclosure();
  const [deleteId, setDeleteId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const accountTypes = [
    { value: "savings", label: "Savings Account" },
    { value: "current", label: "Current Account" },
    { value: "domiciliary", label: "Domiciliary Account" }
  ];

  const currencies = [
    { value: "USD", label: "US Dollar (USD)" },
    { value: "EUR", label: "Euro (EUR)" },
    { value: "GBP", label: "British Pound (GBP)" },
    { value: "NGN", label: "Nigerian Naira (NGN)" },
    { value: "GHS", label: "Ghanaian Cedi (GHS)" },
    { value: "KES", label: "Kenyan Shilling (KES)" },
    { value: "ZAR", label: "South African Rand (ZAR)" }
  ];

  useEffect(() => {
    fetchAccounts();
  }, [currentPage, perPage]);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/institution/payment-accounts?page=${currentPage}&per_page=${perPage}`
      );
      setAccounts(response.data.accounts.data);
      setTotalPages(Math.ceil(response.data.accounts.total / perPage));
    } catch (error) {
      console.error("Error fetching payment accounts:", error);
      toast.error("Failed to load payment accounts");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (account = null) => {
    if (account) {
      setFormData({
        account_name: account.account_name,
        account_number: account.account_number,
        bank_name: account.bank_name,
        bank_branch: account.bank_branch,
        account_type: account.account_type,
        currency: account.currency || "USD",
        swift_code: account.swift_code || ""
      });
      setEditId(account.id);
    } else {
      setFormData({
        account_name: "",
        account_number: "",
        bank_name: "",
        bank_branch: "",
        account_type: "savings",
        currency: "USD",
        swift_code: ""
      });
      setEditId(null);
    }
    onOpen();
  };

  const handleInputChange = (key, value) => {
    setFormData({
      ...formData,
      [key]: value
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (editId) {
        // Update existing account
        await axios.post(`/institution/payment-accounts/${editId}`, formData);
        toast.success("Payment account updated successfully");
      } else {
        // Create new account
        await axios.post("/institution/payment-accounts", formData);
        toast.success("Payment account created successfully");
      }
      onClose();
      fetchAccounts();
    } catch (error) {
      console.error("Error saving payment account:", error);
      toast.error(
        error.response?.data?.message || "Failed to save payment account"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    onDeleteOpen();
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await axios.delete(`/institution/payment-accounts/${deleteId}`);
      toast.success("Payment account deleted successfully");
      onDeleteClose();
      fetchAccounts();
    } catch (error) {
      console.error("Error deleting payment account:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete payment account"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Payment Accounts</h2>
        <Button
          // color="primary"
          className="bg-bChkRed text-white"
          startContent={<FaPlus />}
          onClick={() => handleOpenModal()}
        >
          Add Account
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <Table aria-label="Payment Accounts">
            <TableHeader>
              <TableColumn>ACCOUNT NAME</TableColumn>
              <TableColumn>BANK</TableColumn>
              <TableColumn>ACCOUNT NUMBER</TableColumn>
              <TableColumn>ACCOUNT TYPE</TableColumn>
              <TableColumn>CURRENCY</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No payment accounts found">
              {accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell>{account.account_name}</TableCell>
                  <TableCell>
                    {account.bank_name}
                    <div className="text-xs text-gray-500">
                      {account.bank_branch}
                    </div>
                  </TableCell>
                  <TableCell>{account.account_number}</TableCell>
                  <TableCell>
                    <Chip size="sm" variant="flat" color="primary">
                      {account.account_type.charAt(0).toUpperCase() + account.account_type.slice(1)}
                    </Chip>
                  </TableCell>
                  <TableCell>{account.currency || "USD"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onClick={() => handleOpenModal(account)}
                      >
                        <FaEdit className="text-blue-500" />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onClick={() => handleDeleteClick(account.id)}
                      >
                        <FaTrash className="text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <Pagination
                total={totalPages}
                page={currentPage}
                onChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalContent>
          {() => (
            <>
              <ModalHeader>
                {editId ? "Edit Payment Account" : "Add Payment Account"}
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Account Name"
                    placeholder="Enter account name"
                    value={formData.account_name}
                    onChange={(e) =>
                      handleInputChange("account_name", e.target.value)
                    }
                    isRequired
                  />
                  <Input
                    label="Account Number"
                    placeholder="Enter account number"
                    value={formData.account_number}
                    onChange={(e) =>
                      handleInputChange("account_number", e.target.value)
                    }
                    isRequired
                  />
                  <Input
                    label="Bank Name"
                    placeholder="Enter bank name"
                    value={formData.bank_name}
                    onChange={(e) =>
                      handleInputChange("bank_name", e.target.value)
                    }
                    isRequired
                  />
                  <Input
                    label="Bank Branch"
                    placeholder="Enter bank branch"
                    value={formData.bank_branch}
                    onChange={(e) =>
                      handleInputChange("bank_branch", e.target.value)
                    }
                    isRequired
                  />
                  <Select
                    label="Account Type"
                    placeholder="Select account type"
                    selectedKeys={[formData.account_type]}
                    onChange={(e) =>
                      handleInputChange("account_type", e.target.value)
                    }
                    isRequired
                  >
                    {accountTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select
                    label="Currency"
                    placeholder="Select currency"
                    selectedKeys={[formData.currency]}
                    onChange={(e) =>
                      handleInputChange("currency", e.target.value)
                    }
                    isRequired
                  >
                    {currencies.map((currency) => (
                      <SelectItem key={currency.value} value={currency.value}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </Select>
                  <Input
                    label="SWIFT Code (Optional)"
                    placeholder="Enter SWIFT code for international transfers"
                    value={formData.swift_code}
                    onChange={(e) =>
                      handleInputChange("swift_code", e.target.value)
                    }
                    className="md:col-span-2"
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  // color="primary"
                  className="bg-bChkRed text-white"
                  onPress={handleSubmit}
                  isLoading={submitting}
                >
                  {editId ? "Update" : "Save"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} size="sm">
        <ModalContent>
          {() => (
            <>
              <ModalHeader>Confirm Deletion</ModalHeader>
              <ModalBody>
                <p>Are you sure you want to delete this payment account?</p>
                <p className="text-sm text-gray-500 mt-2">
                  This action cannot be undone.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onDeleteClose}>
                  Cancel
                </Button>
                <Button
                  // color="danger"
                  className="bg-bChkRed text-white"
                  onPress={handleDelete}
                  isLoading={submitting}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
