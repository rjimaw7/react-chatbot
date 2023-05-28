/* eslint-disable @typescript-eslint/no-explicit-any */
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import "./App.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  MessageInput,
  Message,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import { useCallback, useMemo, useState } from "react";
import { useGptService } from "@shared/services/gptService";

interface MessageProps {
  message: string;
  sender: string;
  direction: string;
}

const App = () => {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const { sendMessage } = useGptService();
  const { sendMutation } = sendMessage();

  const mappedMessages = useMemo(() => {
    return messages.map((message, i) => <Message key={i} model={message} />);
  }, [messages]);

  const processMessageToChatGPT = useCallback(
    async (chatMessages: MessageProps[]) => {
      const apiMessages = chatMessages.map((messageObject) => {
        const role = messageObject.sender === "Chat GPT" ? "assistant" : "user";
        return { role, content: messageObject.message };
      });

      const systemMessage = {
        role: "system",
        content: "Explain in one sentences only.",
      };

      const apiRequestBody: any = {
        model: "gpt-3.5-turbo",
        messages: [systemMessage, ...apiMessages], // Include systemMessage at the beginning
      };

      sendMutation.mutateAsync(apiRequestBody, {
        onSuccess: async (data: any) => {
          const userQuestion = chatMessages[chatMessages.length - 1].message;
          const responseText = data.choices[0].message.content;

          // Create a new message object
          const responseMessage = {
            message: "", // Initialize an empty message
            sender: "ChatGPT",
            direction: "incoming",
          };

          setMessages((prevMessages) => [
            ...prevMessages.slice(0, prevMessages.length - 1),
            {
              ...prevMessages[prevMessages.length - 1], // Update the last message object
              message: userQuestion,
              direction: "outgoing",
            },
            responseMessage,
          ]);

          // Update the messages state incrementally
          for (let i = 0; i < responseText.length; i++) {
            // Update the message character by character with a delay
            await new Promise((resolve) => setTimeout(resolve, 50));
            responseMessage.message = responseText.slice(0, i + 1); // Update the response message with the current portion of the text

            setMessages((prevMessages) => [
              ...prevMessages.slice(0, prevMessages.length - 1),
              responseMessage,
            ]);

            setTyping(false);
          }
        },
        onError: () => {
          alert("Too Many Requests. Please try again later.");
          setTyping(false);
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sendMutation.mutateAsync]
  );

  const handleSend = useCallback(
    async (message: string) => {
      const newMessage = {
        message: message,
        sender: "user",
        direction: "outgoing",
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]); // Add the new message to the existing messages
      setTyping(true); // Set typing indicator

      const updatedMessages = [...messages, newMessage]; // Capture the current value of messages

      await processMessageToChatGPT(updatedMessages);
    },
    [messages, processMessageToChatGPT]
  );

  console.log(typing);

  return (
    <div className="App">
      <div
        className=""
        style={{ position: "relative", height: "800px", width: "700px" }}
      >
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={
                typing ? <TypingIndicator content="ChatGPT is typing" /> : null
              }
            >
              {mappedMessages}
            </MessageList>
            <MessageInput placeholder="Type Message Here" onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
};

export default App;
