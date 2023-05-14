import { sendMessage } from "../supabase";

describe("sendMessage", () => {
  // Test sending a message
  it("should add a new message to the chat history", () => {
    // Set up initial chat state
    const initialChatState = {
      chatHistory: [
        { sender: "Alice", message: "Hi there!" },
        { sender: "Bob", message: "Hey Alice, how are you?" },
      ],
    };

    // Call the sendMessage function to add a new message
    const newChatState = sendMessage(
      initialChatState,
      "Alice",
      "Doing well, thanks for asking!"
    );

    // Check that the chat history now includes the new message
    expect(newChatState.chatHistory).toEqual([
      { sender: "Alice", message: "Hi there!" },
      { sender: "Bob", message: "Hey Alice, how are you?" },
      { sender: "Alice", message: "Doing well, thanks for asking!" },
    ]);
  });

  // Test sending a message with an empty message string
  it("should not add a new message to the chat history if the message is empty", () => {
    // Set up initial chat state
    const initialChatState = {
      chatHistory: [
        { sender: "Alice", message: "Hi there!" },
        { sender: "Bob", message: "Hey Alice, how are you?" },
      ],
    };

    // Call the sendMessage function to add a new message with an empty message string
    const newChatState = sendMessage(initialChatState, "Alice", "");

    // Check that the chat history is unchanged
    expect(newChatState.chatHistory).toEqual([
      { sender: "Alice", message: "Hi there!" },
      { sender: "Bob", message: "Hey Alice, how are you?" },
    ]);
  });
});

describe("fetchMessages", () => {
  const messages = [
    { id: 1, text: "Hello", timestamp: new Date("2023-05-01T08:00:00Z") },
    {
      id: 2,
      text: "How are you?",
      timestamp: new Date("2023-05-02T10:30:00Z"),
    },
    {
      id: 3,
      text: "I am doing well, thanks!",
      timestamp: new Date("2023-05-03T15:45:00Z"),
    },
    {
      id: 4,
      text: "How about you?",
      timestamp: new Date("2023-05-03T16:00:00Z"),
    },
  ];

  test("should return all messages", () => {
    const result = fetchMessages();
    expect(result).toEqual(messages);
  });

  test("should return messages before given timestamp", () => {
    const timestamp = new Date("2023-05-03T16:00:00Z");
    const result = fetchMessages(timestamp);
    expect(result).toEqual([
      { id: 1, text: "Hello", timestamp: new Date("2023-05-01T08:00:00Z") },
      {
        id: 2,
        text: "How are you?",
        timestamp: new Date("2023-05-02T10:30:00Z"),
      },
      {
        id: 3,
        text: "I am doing well, thanks!",
        timestamp: new Date("2023-05-03T15:45:00Z"),
      },
    ]);
  });

  test("should return empty array if no messages before given timestamp", () => {
    const timestamp = new Date("2023-05-01T07:59:59Z");
    const result = fetchMessages(timestamp);
    expect(result).toEqual([]);
  });
});
