<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\ConversationParticipant;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ConversationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $conversations = $user->conversations()
            ->with(['participants'])
            ->wherePivotNotNull('accepted_at')
            ->get()
            ->map(function (Conversation $c) use ($user) {
                $lastMessage = $c->messages()->with('user')->latest()->first();
                $otherParticipants = $c->participants->where('id', '!=', $user->id);
                $other = $otherParticipants->first();
                $online = $otherParticipants->contains(fn ($p) => $p->last_activity_at
                    && $p->last_activity_at->gt(now()->subMinutes(5)));
                return [
                    'id' => $c->id,
                    'type' => $c->type,
                    'name' => $c->type === 'group' ? $c->name : $other?->name,
                    'participants' => $c->participants->map(fn ($p) => ['id' => $p->id, 'name' => $p->name]),
                    'online' => $online,
                    'last_message' => $lastMessage ? [
                        'body' => $lastMessage->body,
                        'user_name' => $lastMessage->user->name,
                        'created_at' => $lastMessage->created_at->toIso8601String(),
                    ] : null,
                    'unread_count' => $this->getUnreadCount($c->id, $user->id),
                    'updated_at' => $c->updated_at->toIso8601String(),
                ];
            });

        $conversations = $conversations->sortByDesc(function ($c) {
            return $c['last_message']['created_at'] ?? $c['updated_at'] ?? '';
        })->values();

        return response()->json(['conversations' => $conversations]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'required|in:direct,group',
            'participant_ids' => 'required|array',
            'participant_ids.*' => 'exists:users,id',
            'name' => 'required_if:type,group|nullable|string|max:255',
        ]);

        $user = $request->user();
        $participantIds = array_unique(array_merge($validated['participant_ids'], [$user->id]));

        if ($validated['type'] === 'direct') {
            $participantIds = array_slice($participantIds, 0, 2);
            if (count($participantIds) !== 2) {
                return response()->json(['message' => 'Direct chat must have exactly 2 participants.'], 422);
            }
        }

        $existing = Conversation::where('type', 'direct')
            ->whereHas('participants', fn ($q) => $q->where('user_id', $user->id))
            ->whereHas('participants', fn ($q) => $q->where('user_id', $participantIds[0] === $user->id ? $participantIds[1] : $participantIds[0]))
            ->first();

        if ($existing && $validated['type'] === 'direct') {
            return response()->json(['conversation' => $existing->load('participants')], 200);
        }

        $conversation = Conversation::create([
            'type' => $validated['type'],
            'name' => $validated['name'] ?? null,
        ]);

        foreach ($participantIds as $id) {
            ConversationParticipant::create([
                'conversation_id' => $conversation->id,
                'user_id' => $id,
                'role' => $id === $user->id ? 'admin' : 'member',
                'accepted_at' => $id === $user->id ? now() : null,
            ]);
        }

        $conversation->load('participants');
        return response()->json(['conversation' => $conversation], 201);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $conversation = Conversation::with('participants')->findOrFail($id);
        if (! $conversation->participants->contains('id', $request->user()->id)) {
            abort(403);
        }
        $pivot = ConversationParticipant::where('conversation_id', $id)->where('user_id', $request->user()->id)->first();
        if (! $pivot || ! $pivot->accepted_at) {
            abort(403, 'Accept the message request first.');
        }
        ConversationParticipant::where('conversation_id', $id)
            ->where('user_id', $request->user()->id)
            ->update(['last_read_at' => now()]);
        return response()->json(['conversation' => $conversation]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $conversation = Conversation::with('participants')->findOrFail($id);
        if (! $conversation->participants->contains('id', $request->user()->id)) {
            abort(403);
        }
        ConversationParticipant::where('conversation_id', $id)
            ->where('user_id', $request->user()->id)
            ->delete();
        $remaining = $conversation->participants()->count();
        if ($remaining === 0) {
            $conversation->delete();
        }
        return response()->json(['message' => 'Conversation removed']);
    }

    public function messageRequests(Request $request): JsonResponse
    {
        $user = $request->user();
        $conversations = $user->conversations()
            ->with(['participants'])
            ->wherePivotNull('accepted_at')
            ->get()
            ->map(function (Conversation $c) use ($user) {
                $lastMessage = $c->messages()->with('user')->latest()->first();
                $otherParticipants = $c->participants->where('id', '!=', $user->id);
                $other = $otherParticipants->first();
                return [
                    'id' => $c->id,
                    'type' => $c->type,
                    'name' => $c->type === 'group' ? $c->name : $other?->name,
                    'participants' => $c->participants->map(fn ($p) => ['id' => $p->id, 'name' => $p->name]),
                    'last_message' => $lastMessage ? [
                        'body' => $lastMessage->body,
                        'user_name' => $lastMessage->user->name,
                        'created_at' => $lastMessage->created_at->toIso8601String(),
                    ] : null,
                    'unread_count' => $this->getUnreadCount($c->id, $user->id),
                    'updated_at' => $c->updated_at->toIso8601String(),
                ];
            });

        $conversations = $conversations->sortByDesc(function ($c) {
            return $c['last_message']['created_at'] ?? $c['updated_at'] ?? '';
        })->values();

        return response()->json(['conversations' => $conversations]);
    }

    public function accept(Request $request, int $id): JsonResponse
    {
        $updated = ConversationParticipant::where('conversation_id', $id)
            ->where('user_id', $request->user()->id)
            ->whereNull('accepted_at')
            ->update(['accepted_at' => now()]);

        if ($updated === 0) {
            $pivot = ConversationParticipant::where('conversation_id', $id)
                ->where('user_id', $request->user()->id)
                ->first();
            if (! $pivot) {
                abort(404);
            }
            return response()->json(['message' => 'Already accepted', 'conversation_id' => $id]);
        }

        $conversation = Conversation::with('participants')->findOrFail($id);
        return response()->json(['message' => 'Accepted', 'conversation' => $conversation]);
    }

    private function getUnreadCount(int $conversationId, int $userId): int
    {
        $p = ConversationParticipant::where('conversation_id', $conversationId)->where('user_id', $userId)->first();
        if (! $p || ! $p->last_read_at) {
            return \App\Models\Message::where('conversation_id', $conversationId)->count();
        }
        return \App\Models\Message::where('conversation_id', $conversationId)->where('created_at', '>', $p->last_read_at)->count();
    }
}
