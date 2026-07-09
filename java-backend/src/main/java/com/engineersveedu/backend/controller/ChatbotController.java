package com.engineersveedu.backend.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import jakarta.annotation.PostConstruct;
import java.io.InputStream;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*")
public class ChatbotController {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private List<Map<String, String>> knowledgeBase = new ArrayList<>();
    private Map<String, List<Map<String, String>>> conversationHistories = new HashMap<>();

    private final String SYSTEM_PROMPT = "You are a helpful, friendly AI assistant for Engineers Veedu, a professional construction contractor company based in India.\n" +
            "Your role is to:\n" +
            "1. Help customers learn about our construction services\n" +
            "2. Answer questions about our projects and expertise\n" +
            "3. Provide information about quotes and consultations\n" +
            "4. Be professional yet warm and approachable\n" +
            "Key information about Engineers Veedu:\n" +
            "- Over 10 years of experience in construction\n" +
            "- Services: residential construction, commercial buildouts, renovations, foundation work, structural engineering\n" +
            "- Service areas: Chennai, Coimbatore, and Madurai regions\n" +
            "- Certified and insured contractor\n" +
            "- Contact: Phone +1 (555) 123-4567, Email support@contractorpro.com\n" +
            "- Hours: Monday-Friday 8AM-6PM EST\n" +
            "Guidelines:\n" +
            "- Use the provided context to answer questions accurately\n" +
            "- Keep responses concise but helpful (2-4 sentences typically)\n" +
            "- Use emojis sparingly to add friendliness \n" +
            "- If you don't know something specific, encourage them to contact us\n" +
            "- Never make up information about pricing or timelines\n" +
            "- Always maintain a professional, trustworthy tone";

    @PostConstruct
    public void init() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            InputStream is = new ClassPathResource("knowledge_base.json").getInputStream();
            knowledgeBase = mapper.readValue(is, new TypeReference<List<Map<String, String>>>() {});
            System.out.println("Loaded " + knowledgeBase.size() + " documents from knowledge base.");
        } catch (Exception e) {
            System.err.println("Could not load knowledge_base.json: " + e.getMessage());
        }
    }

    private List<Map<String, String>> keywordSearch(String query, int topK) {
        String lowerQuery = query.toLowerCase();
        String[] words = lowerQuery.split("\\s+");
        
        List<Map<String, Object>> results = new ArrayList<>();
        for (Map<String, String> doc : knowledgeBase) {
            String content = doc.get("content").toLowerCase();
            int score = 0;
            for (String word : words) {
                if (word.length() > 3 && content.contains(word)) {
                    score++;
                }
            }
            if (score > 0) {
                Map<String, Object> result = new HashMap<>();
                result.put("doc", doc);
                result.put("score", score);
                results.add(result);
            }
        }
        
        results.sort((a, b) -> Integer.compare((Integer) b.get("score"), (Integer) a.get("score")));
        
        return results.stream()
                .limit(topK)
                .map(r -> (Map<String, String>) r.get("doc"))
                .collect(Collectors.toList());
    }

    @PostMapping("/chat")
    public ResponseEntity<?> chat(@RequestBody Map<String, String> requestBody) {
        try {
            String userMessage = requestBody.getOrDefault("message", "").trim();
            String sessionId = requestBody.getOrDefault("session_id", "default");

            if (userMessage.isEmpty()) {
                Map<String, String> err = new HashMap<>();
                err.put("error", "No message provided");
                return ResponseEntity.badRequest().body(err);
            }

            conversationHistories.putIfAbsent(sessionId, new ArrayList<>());
            List<Map<String, String>> history = conversationHistories.get(sessionId);

            List<Map<String, String>> relevantDocs = keywordSearch(userMessage, 3);
            
            StringBuilder contextBuilder = new StringBuilder();
            List<String> sources = new ArrayList<>();
            for (Map<String, String> doc : relevantDocs) {
                contextBuilder.append("📄 ").append(doc.get("title")).append(":\n").append(doc.get("content")).append("\n\n");
                sources.add(doc.get("source"));
            }

            StringBuilder convContext = new StringBuilder();
            if (!history.isEmpty()) {
                convContext.append("\n\nRecent conversation:\n");
                int start = Math.max(0, history.size() - 2);
                for (int i = start; i < history.size(); i++) {
                    Map<String, String> h = history.get(i);
                    convContext.append("Customer: ").append(h.get("question")).append("\n");
                    convContext.append("Assistant: ").append(h.get("answer")).append("\n");
                }
            }

            String fullPrompt = SYSTEM_PROMPT + "\n\n---\nRelevant Context from Our Website:\n" + 
                                contextBuilder.toString() + convContext.toString() +
                                "\n---\n\nCustomer Question: " + userMessage + "\n\nPlease provide a helpful, friendly response:";

            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + geminiApiKey;

            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> requestPayload = new HashMap<>();
            Map<String, Object> part = new HashMap<>();
            part.put("text", fullPrompt);
            Map<String, Object> content = new HashMap<>();
            content.put("parts", Collections.singletonList(part));
            requestPayload.put("contents", Collections.singletonList(content));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestPayload, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            String answer = "";
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> body = response.getBody();
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) body.get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> candidateContent = (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) candidateContent.get("parts");
                    if (parts != null && !parts.isEmpty()) {
                        answer = (String) parts.get(0).get("text");
                    }
                }
            }

            Map<String, String> newHistory = new HashMap<>();
            newHistory.put("question", userMessage);
            newHistory.put("answer", answer);
            history.add(newHistory);

            if (history.size() > 10) {
                history = history.subList(history.size() - 10, history.size());
                conversationHistories.put(sessionId, history);
            }

            Map<String, Object> result = new HashMap<>();
            result.put("response", answer);
            result.put("sources", sources);
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> errBody = new HashMap<>();
            errBody.put("error", "I apologize, but I'm having trouble processing your request. Please try again or contact us directly.");
            errBody.put("details", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errBody);
        }
    }

    @PostMapping("/clear")
    public ResponseEntity<?> clearHistory(@RequestBody Map<String, String> requestBody) {
        String sessionId = requestBody.getOrDefault("session_id", "default");
        conversationHistories.put(sessionId, new ArrayList<>());
        Map<String, String> res = new HashMap<>();
        res.put("message", "Conversation history cleared");
        return ResponseEntity.ok(res);
    }
}
