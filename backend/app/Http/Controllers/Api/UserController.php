<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $q = $request->get('q');
        $users = User::query()
            ->where('id', '!=', $request->user()->id)
            ->when($q, fn ($query) => $query->where('name', 'like', '%'.$q.'%')->orWhere('email', 'like', '%'.$q.'%'))
            ->orderBy('name')
            ->limit(50)
            ->get(['id', 'name', 'email']);

        return response()->json(['users' => $users]);
    }
}
