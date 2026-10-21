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

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "healthy");
        status.put("service", "Engineers Veedu Java Spring Boot Backend");
        status.put("knowledge_base_size", knowledgeBase.size());
        return ResponseEntity.ok(status);
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

    private String generateFallbackAnswer(String query, List<Map<String, String>> docs) {
        String lower = query.toLowerCase();

        if (lower.contains("service") || lower.contains("offer") || lower.contains("provide") || lower.contains("build") || lower.contains("construction")) {
            return "At Engineers Veedu, we provide end-to-end construction services including residential home builds, commercial buildouts, complete renovations, foundation work, and structural engineering across Chennai, Coimbatore, and Madurai. Feel free to request a quote or contact our team!";
        }
        if (lower.contains("quote") || lower.contains("estimate") || lower.contains("cost") || lower.contains("price") || lower.contains("rate")) {
            return "You can easily request a free, no-obligation quote! Simply use the quick quote form on our homepage or visit any contractor's profile page to submit your project requirements. Our contractors will review your inquiry and get back with an estimate.";
        }
        if (lower.contains("area") || lower.contains("city") || lower.contains("cities") || lower.contains("location") || lower.contains("where")) {
            return "Engineers Veedu currently operates across South India, with active verified contractors serving the Chennai, Coimbatore, and Madurai regions.";
        }
        if (lower.contains("project") || lower.contains("portfolio") || lower.contains("recent") || lower.contains("work")) {
            return "Our recent projects include Modern Commercial Buildouts, Luxury Villa Renovations, and Foundation & Structural engineering works. You can browse our complete portfolio and ongoing milestones on the Projects page!";
        }
        if (lower.contains("contact") || lower.contains("phone") || lower.contains("email") || lower.contains("call") || lower.contains("reach") || lower.contains("address")) {
            return "You can reach Engineers Veedu by phone at +1 (555) 123-4567 or by email at support@contractorpro.com. Our support team is available Monday through Friday, 8:00 AM to 6:00 PM.";
        }
        if (lower.contains("contractor") || lower.contains("builder") || lower.contains("engineer") || lower.contains("verified") || lower.contains("hire")) {
            return "All contractors registered with Engineers Veedu are certified, insured, and verified. You can browse contractor profiles, check client ratings, view their past projects, and directly send quote inquiries.";
        }
        if (lower.contains("track") || lower.contains("progress") || lower.contains("milestone") || lower.contains("status")) {
            return "Clients can track real-time construction progress right from their Client Dashboard! You can see milestone updates from Planning to Foundation, Brick Work, Plastering, and Final Completion.";
        }
        if (lower.contains("hello") || lower.contains("hi") || lower.contains("hey")) {
            return "Hello! 👋 Welcome to Engineers Veedu. How can I help you today? You can ask me about our construction services, request a quote, explore verified contractors, or learn about our recent projects.";
        }

        if (docs != null && !docs.isEmpty()) {
            for (Map<String, String> doc : docs) {
                String c = doc.getOrDefault("content", "").trim();
                if (!c.isEmpty()) {
                    return "According to our records: " + c.replaceAll("\\s+", " ") + " Feel free to call us at +1 (555) 123-4567 or submit a quote request for personalized guidance!";
                }
            }
        }

        return "Engineers Veedu is your trusted construction contractor platform with over 10 years of experience in Chennai, Coimbatore, and Madurai. Please call us at +1 (555) 123-4567 or use our quote form for more details!";
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

            String answer = "";
            try {
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
            } catch (Exception apiEx) {
                System.out.println("Gemini API call failed (" + apiEx.getMessage() + "), using intelligent knowledge base response.");
                answer = generateFallbackAnswer(userMessage, relevantDocs);
            }

            if (answer == null || answer.trim().isEmpty()) {
                answer = generateFallbackAnswer(userMessage, relevantDocs);
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
            Map<String, Object> result = new HashMap<>();
            result.put("response", "At Engineers Veedu, we provide professional residential, commercial, and renovation construction services in Chennai, Coimbatore, and Madurai. How can we help your project today?");
            result.put("sources", Collections.singletonList("company_info"));
            return ResponseEntity.ok(result);
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
