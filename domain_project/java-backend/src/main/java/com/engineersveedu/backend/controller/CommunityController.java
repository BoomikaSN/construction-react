package com.engineersveedu.backend.controller;

import com.engineersveedu.backend.model.CommunityPost;
import com.engineersveedu.backend.repository.CommunityPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/community/posts")
@CrossOrigin(origins = "*")
public class CommunityController {

    @Autowired
    private CommunityPostRepository postRepository;

    @GetMapping
    public ResponseEntity<List<CommunityPost>> getPosts() {
        return ResponseEntity.ok(postRepository.findAllByOrderByCreatedAtDesc());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPostById(@PathVariable Long id) {
        Optional<CommunityPost> postOpt = postRepository.findById(id);
        if (postOpt.isPresent()) {
            return ResponseEntity.ok(postOpt.get());
        }
        Map<String, String> error = new HashMap<>();
        error.put("error", "Post not found");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @PostMapping
    public ResponseEntity<?> createPost(@RequestBody Map<String, String> request) {
        String author = request.getOrDefault("author", "Anonymous");
        String text = request.get("text");

        if (text == null || text.trim().isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Post content text is required");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        CommunityPost post = new CommunityPost(author, text, 0, 0, "Just now", author.equalsIgnoreCase("Engineers Veedu Team"));
        postRepository.save(post);

        return ResponseEntity.status(HttpStatus.CREATED).body(post);
    }

    @PostMapping("/{id}/replies")
    public ResponseEntity<?> addReply(@PathVariable Long id, @RequestBody Map<String, String> request) {
        Optional<CommunityPost> postOpt = postRepository.findById(id);
        if (postOpt.isPresent()) {
            CommunityPost post = postOpt.get();
            post.setComments(post.getComments() + 1);
            postRepository.save(post);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Comment reply added successfully");
            response.put("commentsCount", post.getComments());
            return ResponseEntity.ok(response);
        }

        Map<String, String> error = new HashMap<>();
        error.put("error", "Post not found");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @PutMapping("/{id}/like")
    public ResponseEntity<?> likePost(@PathVariable Long id) {
        Optional<CommunityPost> postOpt = postRepository.findById(id);
        if (postOpt.isPresent()) {
            CommunityPost post = postOpt.get();
            post.setLikes(post.getLikes() + 1);
            postRepository.save(post);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Post liked successfully");
            response.put("likesCount", post.getLikes());
            return ResponseEntity.ok(response);
        }

        Map<String, String> error = new HashMap<>();
        error.put("error", "Post not found");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
}
