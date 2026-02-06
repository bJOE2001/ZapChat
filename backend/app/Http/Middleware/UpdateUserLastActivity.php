<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UpdateUserLastActivity
{
    /** Update at most once per minute to reduce DB writes. */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if ($user && $this->shouldUpdate($user)) {
            $user->update(['last_activity_at' => now()]);
        }

        return $next($request);
    }

    private function shouldUpdate($user): bool
    {
        $at = $user->last_activity_at;
        if ($at === null) {
            return true;
        }
        return $at->lt(now()->subMinute());
    }
}
