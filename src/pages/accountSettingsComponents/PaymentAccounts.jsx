import { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
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
  Chip,
} from "@nextui-org/react";
import { FaPlus, FaEdit, FaTrash, FaCheck } from "react-icons/fa";
import axios from "@/utils/axiosConfig";
import { toast } from "sonner";

export default function PaymentAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(10);
  const [formData, setFormData] = useState({
    account_name: "",
    account_number: "",
    bank_name: "",
    bank_branch: "",
    account_type: "savings",
    currency: "NGN",
    swift_code: "",
    bank_code: "",
  });
  const [banks, setBanks] = useState([]);
  const [loadingBanks, setLoadingBanks] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [editId, setEditId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const [deleteId, setDeleteId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const accountTypes = [
    { value: "savings", label: "Savings Account" },
    { value: "current", label: "Current Account" },
    { value: "domiciliary", label: "Domiciliary Account" },
  ];

  const countries = [
    { value: "nigeria", label: "Nigeria", currency: "NGN" },
    { value: "ghana", label: "Ghana", currency: "GHS" },
    { value: "kenya", label: "Kenya", currency: "KES" },
    { value: "south africa", label: "South Africa", currency: "ZAR" },
  ];

  const currencies = [
    { value: "NGN", label: "Nigerian Naira (NGN)" },
    { value: "GHS", label: "Ghanaian Cedi (GHS)" },
    { value: "KES", label: "Kenyan Shilling (KES)" },
    { value: "ZAR", label: "South African Rand (ZAR)" },
    { value: "USD", label: "US Dollar (USD)" },
    { value: "EUR", label: "Euro (EUR)" },
    { value: "GBP", label: "British Pound (GBP)" },
  ];

  useEffect(() => {
    fetchAccounts();
  }, [currentPage, perPage]);

  useEffect(() => {
    if (isOpen) {
      fetchBanks();
    }
  }, [isOpen]);

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

  const [selectedCountry, setSelectedCountry] = useState("nigeria");

  const fetchBanks = useCallback(
    async (country = null, currency = null) => {
      setLoadingBanks(true);
      try {
        // Use provided country/currency or fall back to state values
        const countryToUse = country || selectedCountry;
        const currencyToUse = currency || formData.currency;

        console.log("Fetching banks for:", {
          country: countryToUse,
          currency: currencyToUse,
        });

        const response = await axios.get(
          "/institution/payment-accounts/banks",
          {
            params: {
              country: countryToUse,
              currency: currencyToUse,
            },
          }
        );

        if (response.data.status === "success") {
          // Sort banks alphabetically for better user experience
          const sortedBanks = (response.data.data || []).sort((a, b) =>
            a.name.localeCompare(b.name)
          );
          setBanks(sortedBanks);
        } else {
          toast.error("Failed to load bank list");
        }
      } catch (error) {
        console.error("Error fetching banks:", error);
        toast.error(
          error.response?.data?.message || "Failed to load bank list"
        );
      } finally {
        setLoadingBanks(false);
      }
    },
    [selectedCountry, formData.currency]
  );

  // Debounce verification to prevent too many API calls
  const debouncedVerify = useCallback(
    debounce(async (accountNumber, bankCode) => {
      if (!accountNumber || !bankCode || !selectedCountry) return;

      setVerifying(true);
      setVerified(false);
      try {
        const response = await axios.post(
          "/institution/payment-accounts/verify-account",
          {
            account_number: accountNumber,
            bank_code: bankCode,
            country: selectedCountry,
          }
        );

        if (response.data.status === "success") {
          setVerified(true);
          setFormData((prev) => ({
            ...prev,
            account_name: response.data.data.account_name,
          }));
          toast.success("Account verified successfully");
        } else {
          toast.error(response.data.message || "Failed to verify account");
        }
      } catch (error) {
        console.error("Error verifying account:", error);
        toast.error(
          error.response?.data?.message || "Failed to verify account"
        );
      } finally {
        setVerifying(false);
      }
    }, 2000),
    [selectedCountry]
  );

  const handleInputChange = useCallback(
    (key, value) => {
      setFormData((prev) => {
        const newData = {
          ...prev,
          [key]: value,
        };

        // If account number or bank code changes, trigger verification
        if (
          (key === "account_number" || key === "bank_code") &&
          newData.bank_code &&
          newData.account_number
        ) {
          debouncedVerify(newData.account_number, newData.bank_code);
        }

        // If currency changes, reload the bank list
        if (key === "currency") {
          setBanks([]);
          fetchBanks();
        }

        return newData;
      });
    },
    [debouncedVerify, fetchBanks]
  );

  const handleCountryChange = useCallback(
    (country) => {
      const selectedCountryData = countries.find((c) => c.value === country);
      if (selectedCountryData) {
        // Clear banks and reset verification first
        setBanks([]);
        setVerified(false);

        // Get the currency for this country
        const newCurrency = selectedCountryData.currency;

        // Update state
        setSelectedCountry(country);
        setFormData((prev) => ({
          ...prev,
          currency: newCurrency,
        }));

        // Fetch banks with the new country and currency directly
        // This ensures we use the new values immediately
        fetchBanks(country, newCurrency);
      }
    },
    [countries, fetchBanks]
  );

  const handleOpenModal = (account = null) => {
    if (account) {
      setEditId(account.id);
      setFormData({
        account_name: account.account_name,
        account_number: account.account_number,
        bank_name: account.bank_name,
        bank_branch: account.bank_branch,
        account_type: account.account_type,
        currency: account.currency,
        swift_code: account.swift_code || "",
        bank_code: account.bank_code,
      });
      setVerified(true); // Account is already verified if it exists
    } else {
      setEditId(null);
      setFormData({
        account_name: "",
        account_number: "",
        bank_name: "",
        bank_branch: "",
        account_type: "savings",
        currency: "NGN",
        swift_code: "",
        bank_code: "",
      });
      setVerified(false);
    }
    onOpen();
  };

  const handleBankSelect = (bankCode) => {
    const selectedBank = banks.find((bank) => bank.code === bankCode);
    setFormData({
      ...formData,
      bank_code: bankCode,
      bank_name: selectedBank ? selectedBank.name : "",
    });
    setVerified(false);
  };

  const handleSubmit = async () => {
    // For Nigerian banks, require verification first
    if (formData.currency === "NGN" && !verified && !editId) {
      toast.error("Please verify the account details first");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
      };

      if (editId) {
        // Update existing account
        await axios.put(`/institution/payment-accounts/${editId}`, payload);
        toast.success("Payment account updated successfully");
      } else {
        // Create new account
        await axios.post("/institution/payment-accounts", payload);
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
        <div>
          <Table aria-label="Payment Accounts">
            <TableHeader>
              <TableColumn>ACCOUNT NAME</TableColumn>
              <TableColumn>BANK</TableColumn>
              <TableColumn>ACCOUNT NUMBER</TableColumn>
              <TableColumn>ACCOUNT TYPE</TableColumn>
              <TableColumn>CURRENCY</TableColumn>
              <TableColumn>STATUS</TableColumn>
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
                      {account.account_type.charAt(0).toUpperCase() +
                        account.account_type.slice(1)}
                    </Chip>
                  </TableCell>
                  <TableCell>{account.currency || "NGN"}</TableCell>
                  <TableCell>
                    {account.recipient_code ? (
                      <Chip size="sm" variant="flat" color="success">
                        Verified
                      </Chip>
                    ) : (
                      <Chip size="sm" variant="flat" color="warning">
                        Unverified
                      </Chip>
                    )}
                  </TableCell>
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
        </div>
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
                  <Select
                    helpText="Only the listed countries are supported for payment accounts"
                    label="Country"
                    placeholder="Select country"
                    value={selectedCountry}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    isRequired
                    className="col-span-2"
                  >
                    {countries.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </Select>

                  <Select
                    label="Currency"
                    placeholder="Select currency"
                    value={formData.currency}
                    onChange={(e) =>
                      handleInputChange("currency", e.target.value)
                    }
                    isRequired
                    isDisabled={!selectedCountry}
                    className="col-span-2"
                  >
                    {currencies.map((currency) => (
                      <SelectItem key={currency.value} value={currency.value}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </Select>

                  {selectedCountry ? (
                    <Select
                      label="Bank"
                      placeholder="Select bank"
                      value={formData.bank_code}
                      onChange={(e) => handleBankSelect(e.target.value)}
                      isRequired
                      isLoading={loadingBanks}
                      isDisabled={verifying || loadingBanks}
                      color={verified ? "success" : undefined}
                      className="col-span-2 md:col-span-1"
                    >
                      {banks.map((bank) => (
                        <SelectItem key={bank.code} value={bank.code}>
                          {bank.name}
                        </SelectItem>
                      ))}
                    </Select>
                  ) : (
                    <Input
                      label="Bank Name"
                      placeholder="Enter bank name"
                      value={formData.bank_name}
                      onChange={(e) =>
                        handleInputChange("bank_name", e.target.value)
                      }
                      isRequired
                      className="col-span-2 md:col-span-1"
                    />
                  )}

                  <Input
                    label="Account Number"
                    placeholder="Enter account number"
                    value={formData.account_number}
                    onChange={(e) =>
                      handleInputChange("account_number", e.target.value)
                    }
                    isRequired
                    isDisabled={verifying}
                    description={verifying ? "Verifying account..." : ""}
                    color={verified ? "success" : undefined}
                    className="col-span-2 md:col-span-1"
                  />

                  <Input
                    label="Account Name"
                    placeholder="Enter account name"
                    value={formData.account_name}
                    onChange={(e) =>
                      handleInputChange("account_name", e.target.value)
                    }
                    isRequired
                    isReadOnly={formData.currency === "NGN" && verified}
                    className="col-span-2 md:col-span-1"
                  />

                  <Input
                    label="Bank Branch"
                    placeholder="Enter bank branch"
                    value={formData.bank_branch}
                    onChange={(e) =>
                      handleInputChange("bank_branch", e.target.value)
                    }
                    isRequired
                    className="col-span-2 md:col-span-1"
                  />

                  <Select
                    label="Account Type"
                    placeholder="Select account type"
                    value={formData.account_type}
                    onChange={(e) =>
                      handleInputChange("account_type", e.target.value)
                    }
                    isRequired
                    className="col-span-2 md:col-span-1"
                  >
                    {accountTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
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
                    className="col-span-2"
                  />
                </div>

                {selectedCountry && !editId && (
                  <div className="mt-2 text-sm text-gray-500">
                    <p className="font-semibold">Note:</p>
                    <p>
                      Bank accounts must be verified before saving. This helps
                      ensure your payouts will be processed correctly.
                    </p>
                    <p className="text-red-700">
                      Bank Account Names should be unique.
                    </p>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  className="bg-bChkRed text-white"
                  onPress={handleSubmit}
                  isLoading={submitting}
                  isDisabled={selectedCountry && !verified && !editId}
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
                  This action cannot be undone. This will also remove the
                  account from Paystack.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onDeleteClose}>
                  Cancel
                </Button>
                <Button
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
