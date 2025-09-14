# Chatbot Feature Implementation

## Feature Overview
Implement an AI-powered chatbot in the AI Academy platform to assist users with course navigation, answer FAQs, and provide learning support. The chatbot should be accessible from the frontend and interact with backend APIs for dynamic responses.

---

## Requirements
- **Frontend:**
  - Add a chatbot UI component (floating button or sidebar widget).
  - Integrate with backend via REST API (e.g., `/api/chatbot/message`).
  - Display conversation history and support both text input and responses.
- **Backend:**
  - Add FastAPI endpoint(s) for chatbot interaction.
  - Integrate with an AI model (e.g., OpenAI, Gemini, or custom LLM) to generate responses.
  - Optionally, log conversations to Firestore for analytics.
- **Authentication:**
  - Only authenticated users can use the chatbot.

---

## Implementation Steps

### 1. Frontend
- Create `ChatbotWidget.tsx` in `Client/src/components/`.
- Add a floating button or sidebar entry to open the chatbot.
- Use `useAuthenticatedFetch` for API calls.
- Update navigation if needed.

### 2. Backend
- Add `/api/chatbot/message` endpoint in `Server/app/routes/api.py`.
- Use dependency injection for authentication.
- Integrate with AI model (e.g., via OpenAI API or Google Gemini).
- Optionally, store chat logs in Firestore.

### 3. Firestore (Optional)
- Create a `chat_logs` collection: `chat_logs/{userId}_{timestamp}`.
- Store messages, timestamps, and user info.

---

## Example API Contract
**POST** `/api/chatbot/message`
- **Request:** `{ "message": "How do I enroll in a course?" }`
- **Response:** `{ "reply": "To enroll, go to the Courses page and click 'Enroll'." }`

---

## References
- See `src/utils/apiUtils.ts` for API call patterns.
- See `app/routes/api.py` for adding new endpoints.
- See `src/components/` for UI component structure.

---

## Next Steps
1. Design the chatbot UI and get feedback.
2. Implement backend endpoint and connect to AI model.
3. Integrate frontend and backend.
4. Test with sample queries and iterate.

---

*For more details, refer to the project guide and code comments in relevant files.*
