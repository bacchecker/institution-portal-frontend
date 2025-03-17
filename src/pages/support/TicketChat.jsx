import React, { useEffect, useState, useRef } from "react";
import LoadItems from "@/components/LoadItems";
import axios from "@/utils/axiosConfig";
import Drawer from "../../components/Drawer";
import { IoIosRefresh } from "react-icons/io";
import secureLocalStorage from "react-secure-storage";
import {
  MdSend,
  MdAttachFile,
  MdClose,
  MdOutlineFileDownload,
} from "react-icons/md";
import { BiSend } from "react-icons/bi";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { toast } from "sonner";

function TicketChat({ setOpenModal, openModal, selectedTicket }) {
  const [userInput, setUserInput] = useState([]);
  const [userInitialInput, setUserInitialInput] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const token = JSON?.parse(secureLocalStorage?.getItem("userToken"))?.token;
  const messageContainerRef = useRef(null);
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Handle sending message
  const handleSendMessage = async () => {
    if (!messageText.trim() && selectedFiles.length === 0){
      toast.error('No message or file has been attached');
      return;
    }

    setIsSending(true);
    const formData = new FormData();

    formData.append("message", messageText);

    // Append multiple files
    selectedFiles.forEach((file, index) => {
      formData.append(`attachments[${index}]`, file);
    });

    try {
      const response = await axios.post(
        `/tickets/${selectedTicket.id}/messages`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Update messages in the UI
      setMessages((prevMessages) => [...prevMessages, response.data.data]);

      // Clear input fields after sending
      setMessageText("");
      setSelectedFiles([]);
      setIsSending(false);
    } catch (error) {
      setIsSending(false);
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedTicket]);

  useEffect(() => {
    if (!selectedTicket) return;
    console.log("selectedTicket", selectedTicket);

    // Setup Laravel Echo with Reverb
    window.Pusher = Pusher;
    window.Echo = new Echo({
      broadcaster: "reverb",
      key: import.meta.env.VITE_REVERB_APP_KEY,
      wsHost: import.meta.env.VITE_REVERB_HOST,
      forceTLS: true,
      // encrypted: false,
      auth: {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
      enabledTransports: ["ws", "wss"],
    });

    // Subscribe to the ticket channel - updated to match admin side format
    const channel = window.Echo.channel(`ticket.${selectedTicket.id}`);

    // Log connection status
    channel.subscribed(() => {
      console.log(
        `Successfully subscribed to channel: ticket.${selectedTicket.id}`
      );
    });

    channel.error((err) => {
      console.error(
        `Error connecting to channel: ticket.${selectedTicket.id}`,
        err
      );
    });

    // Listen for admin messages
    channel.listen(".admin-message", (event) => {
      console.log("Received admin message:", event);
      processMessageEvent(event);
    });

    // Listen for user messages
    channel.listen(".user-message", (event) => {
      console.log("Received user message:", event);
      processMessageEvent(event);
    });

    // For backward compatibility
    channel.listen(".new-message", (event) => {
      console.log("Received legacy message:", event);
      processMessageEvent(event);
    });

    // Helper function to process message events
    const processMessageEvent = (event) => {
      try {
        // Handle both object and array formats
        const messageData = event.ticketMessage || event;
        console.log("Processed message data:", messageData);

        // Get the current user ID from the token or another source
        const currentUser = JSON?.parse(secureLocalStorage?.getItem("user"));
        const currentUserId = currentUser?.id;

        // Check if this is our own message (to avoid duplicates)
        const isOwnMessage =
          (messageData.sender && messageData.sender.id === currentUserId) ||
          (messageData.sender_type === "App\\Models\\User" &&
            messageData.sender_id === currentUserId);

        // Only add messages that aren't our own
        if (messageData && messageData.id && !isOwnMessage) {
          setMessages((prevMessages) => {
            // Check if the message is already in the list
            const messageExists = prevMessages.some(
              (msg) => msg.id === messageData.id
            );
            if (!messageExists) {
              // Scroll to bottom when new message arrives
              setTimeout(() => {
                if (messageContainerRef.current) {
                  messageContainerRef.current.scrollTop =
                    messageContainerRef.current.scrollHeight;
                }
              }, 100);
              return [...prevMessages, messageData];
            }
            return prevMessages;
          });
        }
      } catch (error) {
        console.error("Error processing message event:", error);
      }
    };

    // Handle WebSocket errors
    window.Echo.connector.pusher.connection.bind("error", (error) => {
      console.error("WebSocket connection error:", error);
    });

    return () => {
      if (window.Echo) {
        console.log(`Leaving channel: ticket.${selectedTicket.id}`);
        window.Echo.leaveChannel(`ticket.${selectedTicket.id}`);
      }
    };
  }, [selectedTicket, token]);

  useEffect(() => {
    if (openModal && messageContainerRef.current) {
      requestAnimationFrame(() => {
        messageContainerRef.current.scrollTop =
          messageContainerRef.current.scrollHeight;
      });
    }
  }, [openModal, messages]);

  const fetchMessages = async () => {
    if (selectedTicket) {
      setUserInitialInput(selectedTicket);
      setUserInput(selectedTicket);
      try {
        setIsLoading(true);
        const response = await axios.get(
          `/tickets/${selectedTicket.id}/messages`
        );
        const sortedMessages = response.data.data.data.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );

        setMessages(sortedMessages);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
    }
  };

  const handleDownloadAttachment = async (ticketId, messageId, filename) => {
    setIsDownloading(true);
    try {
      const response = await axios.get(
        `/tickets/${ticketId}/messages/${messageId}/attachments/${filename}`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsDownloading(false);
    } catch (error) {
      setIsDownloading(false);
      console.error("Error downloading file:", error);
    }
  };

  const groupedMessages = messages.reduce((acc, message) => {
    const messageDate = new Date(message.created_at).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }
    );

    if (!acc[messageDate]) {
      acc[messageDate] = [];
    }
    acc[messageDate].push(message);
    return acc;
  }, {});

  return (
    <Drawer
      title={"Ticket Messages"}
      setIsOpen={setOpenModal}
      isOpen={openModal}
      classNames="w-full md:w-2/3 lg:w-1/2 xl:w-2/5"
    >
      <div className="flex flex-col h-[100%]">
        <div className="-mt-6 border-b pb-2">
          <div className="flex space-x-2">
            <p>{selectedTicket?.ticket_number}</p>
            <p
              className={`flex items-center px-4 rounded-full text-white text-xs text-center uppercase ${
                selectedTicket?.status === "open"
                  ? "bg-green-500"
                  : selectedTicket?.status === "closed"
                  ? "bg-red-500"
                  : selectedTicket?.status === "in progress"
                  ? "bg-yellow-500"
                  : "bg-gray-500"
              }`}
            >
              {selectedTicket?.status}
            </p>
          </div>
          <div className="w-full flex justify-between">
            <div className="">
              <p className="font-semibold">{selectedTicket?.title}</p>
              <p className="text-xs text-gray-700">
                {selectedTicket?.description}
              </p>
            </div>
            <button
              className="bg-gray-700 text-white px-2 h-8 rounded-full"
              onClick={fetchMessages}
            >
              <IoIosRefresh />
            </button>
          </div>
          <div className="w-full flex justify-end space-x-2 mt-1">
            <div className="bg-black text-white px-2 py-0.5 rounded-sm text-[11px] uppercase">
              {selectedTicket?.type}
            </div>
            <div className="bg-bChkRed 200 text-white px-2 py-0.5 rounded-sm text-[11px] uppercase">
              {selectedTicket?.category}
            </div>
          </div>
        </div>
        {/* Messages Section */}
        <div ref={messageContainerRef} className="flex-1 overflow-y-auto px-1 py-2">
          {isLoading ? (
            <div className="w-full flex items-center justify-center h-full">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-500"></div>
                <p className="text-gray-500 text-sm mt-2">
                  Loading messages...
                </p>
              </div>
            </div>
          ) : Object.keys(groupedMessages).length === 0 ? (
            <div className="w-full flex items-center justify-center h-full">
              <p className="text-gray-500 text-sm">No messages found</p>
            </div>
          ) : (
            Object.keys(groupedMessages).map((date) => (
              <div key={date}>
                {/* Date Header */}
                <div className="w-full flex items-center justify-center mb-2">
                  <p className="bg-gray-800 text-white text-xs py-1 px-2 rounded-md font-light">
                    {date}
                  </p>
                </div>

                {/* Messages for the Date */}
                {groupedMessages[date].map((message) => (
                  <div
                    key={message.id}
                    className={`flex mb-2 ${
                      message.sender_type === "App\\Models\\User"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`${
                        message.sender_type === "App\\Models\\User"
                          ? "bg-gray-300"
                          : "bg-white"
                      } text-gray-800 px-2 pt-2 pb-0.5 rounded-md shadow min-w-[50%] max-w-[70%] relative`}
                    >
                      

                        {/* Attachments */}
                        {message.attachments &&
                            message.attachments.length > 0 && (
                            <div className="w-full mb-1 flex flex-wrap gap-2">
                                {message.attachments.map((attachment, index) => (
                                <div
                                    key={index}
                                    className="w-full flex flex-col"
                                >
                                    {attachment.mime_type.startsWith("image/") ? (
                                    <img
                                        src={`${
                                        import.meta.env.VITE_BACCHECKER_URL
                                        }/storage/${attachment.path}`}
                                        alt={attachment.name}
                                        className="w-full h-auto rounded-md object-contain"
                                        style={{
                                        maxHeight: "200px",
                                        width: "100%",
                                        }}
                                    />
                                    ) : (
                                    <div className="w-full flex items-center justify-between border p-2 rounded-md bg-gray-100">
                                        <span
                                        className="text-sm truncate max-w-[150px]"
                                        title={attachment.name}
                                        >
                                        {attachment.name}
                                        </span>
                                        <button
                                        onClick={() =>
                                            handleDownloadAttachment(
                                            message.ticket_id,
                                            message.id,
                                            attachment.name
                                            )
                                        }
                                        className="text-blue-500 text-xs font-medium hover:underline"
                                        >
                                        {isDownloading ? (
                                            <div className="flex items-center justify-center gap-2">
                                            <LoadItems
                                                color={"#ffffff"}
                                                size={15}
                                            />
                                            </div>
                                        ) : (
                                            <MdOutlineFileDownload size={22} />
                                        )}
                                        </button>
                                    </div>
                                    )}
                                </div>
                                ))}
                            </div>
                        )}
                        <p className="text-sm">{message.message}</p>
                      <div className="flex space-x-1 items-center justify-end mt-1">
                        <span className="text-[11px] text-gray-500 block text-right">
                          {new Date(message.created_at).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Sticky Message Input */}
        <div className="sticky bottom-0 bg-white py-2 border-t flex flex-col items-start">
          {/* File Previews */}
          {selectedFiles.length > 0 && (
            <div className="w-full flex space-x-2 bg-gray-100 px-2 py-1 rounded-md mb-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="w-auto flex items-center space-x-2 bg-white px-3 py-1 rounded-md mb-1 shadow"
                >
                  <span className="text-gray-700 text-sm truncate">
                    {file.name}
                  </span>
                  <button
                    onClick={() => removeSelectedFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <MdClose size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input Field & Buttons */}
          <form 
            className="w-full flex items-center" 
            onSubmit={(e) => {
                e.preventDefault(); // Prevent page reload
                handleSendMessage();
            }}
            >
            {/* File Attachment Button */}
            <label className="cursor-pointer bg-gray-200 text-gray-600 p-2 rounded-md hover:bg-gray-300 mr-2">
                <MdAttachFile size={24} />
                <input
                type="file"
                className="hidden"
                multiple
                onChange={handleFileChange}
                />
            </label>

            {/* Message Input */}
            <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
            />

            {/* Send Button */}
            <button
                type="submit"
                className="ml-2 p-1.5 bg-bChkRed text-white rounded-md hover:bg-opacity-70"
                disabled={isSending}
            >
                {isSending ? (
                <div className="flex items-center justify-center gap-2">
                    <LoadItems color={"#ffffff"} size={24} />
                </div>
                ) : (
                <BiSend size={26} />
                )}
            </button>
            </form>

        </div>
      </div>
    </Drawer>
  );
}

export default TicketChat;
