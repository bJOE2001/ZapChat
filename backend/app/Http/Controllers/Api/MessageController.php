<?php

namespace App\Http\Controllers\Api;

use App\Chatbot\AiChat;
use App\Chatbot\AiChatService;
use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\ConversationParticipant;
use App\Models\Message;
use App\Models\MessageAttachment;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MessageController extends Controller
{
    public function __construct(
        private AiChatService $aiChat
    ) {}

    private function getAiUser(): ?User
    {
        return User::where('email', AiChat::AI_USER_EMAIL)->first();
    }
    public function index(Request $request, int $conversationId): JsonResponse
    {
        $conversation = Conversation::findOrFail($conversationId);
        if (! $conversation->participants->contains('id', $request->user()->id)) {
            abort(403);
        }
        $pivot = ConversationParticipant::where('conversation_id', $conversationId)->where('user_id', $request->user()->id)->first();
        if (! $pivot || ! $pivot->accepted_at) {
            abort(403, 'Accept the message request first.');
        }

        $afterId = $request->integer('after_id', 0);
        $query = $conversation->messages()
            ->with(['user:id,name', 'attachments'])
            ->orderBy('created_at');

        if ($afterId > 0) {
            $messages = $query->where('id', '>', $afterId)->get();
            return response()->json(['data' => $messages]);
        }

        $messages = $query->paginate(50);
        return response()->json($messages);
    }

    public function store(Request $request, int $conversationId): JsonResponse
    {
        $conversation = Conversation::findOrFail($conversationId);
        if (! $conversation->participants->contains('id', $request->user()->id)) {
            abort(403);
        }
        $pivot = ConversationParticipant::where('conversation_id', $conversationId)->where('user_id', $request->user()->id)->first();
        if (! $pivot || ! $pivot->accepted_at) {
            abort(403, 'Accept the message request first.');
        }

        $validated = $request->validate([
            'body' => 'nullable|string|max:65535',
            'attachments' => 'array|max:5',
            'attachments.*' => 'file|max:10240', // 10MB per file
        ]);

        $message = Message::create([
            'conversation_id' => $conversationId,
            'user_id' => $request->user()->id,
            'body' => $validated['body'] ?? '',
        ]);

        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('attachments/'.$conversationId, 'public');
                MessageAttachment::create([
                    'message_id' => $message->id,
                    'filename' => $file->getClientOriginalName(),
                    'path' => $path,
                    'mime_type' => $file->getMimeType(),
                    'size' => $file->getSize(),
                ]);
            }
        }

        $message->load(['user:id,name', 'attachments']);
        event(new \App\Events\MessageSent($message));

        $aiUser = $this->getAiUser();
        $conversation->load('participants');
        $participantIds = $conversation->participants->pluck('id')->all();
        $isAiConversation = $aiUser && in_array($aiUser->id, $participantIds, true);

        if ($isAiConversation && $message->user_id !== $aiUser->id) {
            $body = $validated['body'] ?? '';
            $replyText = $this->aiChat->getReply($conversation->fresh(), $body ?: '(User sent an attachment)');
            if ($replyText !== null) {
                $aiMessage = Message::create([
                    'conversation_id' => $conversationId,
                    'user_id' => $aiUser->id,
                    'body' => $replyText,
                ]);
                $aiMessage->load(['user:id,name', 'attachments']);
                event(new \App\Events\MessageSent($aiMessage));
            }
        }

        return response()->json(['message' => $message], 201);
    }
}
