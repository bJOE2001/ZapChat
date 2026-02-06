<?php

namespace App\Chatbot;

use App\Models\Conversation;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiChatService
{
    private const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent';

    /**
     * Keyword-based replies when no API key is set. No external API, no account needed.
     */
    private const KEYWORD_REPLIES = [
        'hello' => "Hi! I'm Bototoy. How can I help you today?",
        'hi' => "Hey there! What's on your mind?",
        'hey' => "Hey! How can I help?",
        'good morning' => "Good morning! Hope you're having a great day.",
        'good afternoon' => "Good afternoon! What can I do for you?",
        'good evening' => "Good evening! How can I help?",
        'how are you' => "I'm doing well, thanks for asking! How about you?",
        'what is your name' => "I'm Bototoy, your friendly chat assistant!",
        'who are you' => "I'm Bototoy — a simple bot that replies based on keywords. No AI API needed!",
        'help' => "I'm a keyword-based bot. Try saying hello, asking how I am, or what I can do!",
        'thanks' => "You're welcome! Anything else?",
        'thank you' => "You're welcome! Glad I could help.",
        'bye' => "Bye! Talk to you later.",
        'goodbye' => "Goodbye! Have a good one.",
        'ok' => "Got it! Anything else?",
        'yes' => "Great! What would you like to do?",
        'no' => "No problem. Let me know if you need anything!",
        'what can you do' => "I can reply to simple phrases like hello, help, thanks, and more. I'm a keyword bot — no AI API required!",
        'bototoy' => "That's me! I'm Bototoy, your chat buddy.",
    ];

    public function getReply(Conversation $conversation, string $userMessage): ?string
    {
        $apiKey = config('ai.gemini.api_key');
        $trimmed = trim($userMessage);

        if (empty($apiKey)) {
            return $this->replyByKeywords($trimmed);
        }

        $model = config('ai.gemini.model', 'gemini-1.5-flash');
        $contents = $this->buildContents($conversation, $userMessage);
        $url = sprintf(self::GEMINI_URL, $model);

        try {
            $response = Http::withHeaders([
                'x-goog-api-key' => $apiKey,
                'Content-Type' => 'application/json',
            ])
                ->timeout(30)
                ->post($url, [
                    'system_instruction' => [
                        'parts' => [
                            ['text' => 'You are Bototoy, a helpful and friendly assistant in this chat app. Keep replies concise and conversational.'],
                        ],
                    ],
                    'contents' => $contents,
                    'generationConfig' => [
                        'maxOutputTokens' => config('ai.gemini.max_output_tokens', 1024),
                    ],
                ]);

            if (!$response->successful()) {
                $body = $response->body();
                $parsed = $response->json();
                $reason = isset($parsed['error']['message']) ? $parsed['error']['message'] : (isset($parsed['error']['status']) ? $parsed['error']['status'] : substr($body, 0, 200));
                Log::warning('Gemini API error', [
                    'status' => $response->status(),
                    'body' => $body,
                ]);
                $hint = config('app.debug') ? ' (Gemini: ' . $reason . ')' : '';
                return 'Sorry, the AI service is temporarily unavailable. Please try again.' . $hint;
            }

            $data = $response->json();
            $parts = $data['candidates'][0]['content']['parts'] ?? [];
            $text = $parts[0]['text'] ?? null;
            return $text ? trim($text) : null;
        } catch (\Throwable $e) {
            Log::error('AiChatService error', ['message' => $e->getMessage()]);
            return 'Sorry, something went wrong. Please try again.';
        }
    }

    /**
     * Reply based on detected keywords. No API, unlimited, safe.
     */
    private function replyByKeywords(string $message): string
    {
        if ($message === '') {
            return "I'm Bototoy! Say something like hello, help, or ask what I can do.";
        }

        $lower = mb_strtolower($message);

        foreach (self::KEYWORD_REPLIES as $keyword => $reply) {
            if (str_contains($lower, $keyword)) {
                return $reply;
            }
        }

        return "I'm a simple keyword bot — I didn't match that. Try: hello, help, how are you, or what can you do!";
    }

    /**
     * Build Gemini contents array (multi-turn: user / model) from conversation history + new user message.
     *
     * @return array<int, array{role: string, parts: array<int, array{text: string}>}>
     */
    private function buildContents(Conversation $conversation, string $userMessage): array
    {
        $contents = [];
        $recent = $conversation->messages()
            ->with('user')
            ->orderByDesc('created_at')
            ->limit(20)
            ->get()
            ->reverse()
            ->values();

        foreach ($recent as $msg) {
            $role = $msg->user->email === AiChat::AI_USER_EMAIL ? 'model' : 'user';
            $text = $msg->body ?: '(attachment)';
            $contents[] = [
                'role' => $role,
                'parts' => [['text' => $text]],
            ];
        }

        $contents[] = [
            'role' => 'user',
            'parts' => [['text' => $userMessage]],
        ];
        return $contents;
    }
}
