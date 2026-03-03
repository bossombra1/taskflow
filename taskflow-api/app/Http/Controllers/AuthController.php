<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create($request->validated());
        $token = auth('api')->login($user);

        return response()->json([
            'user'  => new UserResource($user),
            'token' => $token,
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $token = auth('api')->attempt($request->validated());

        if (!$token) {
            return response()->json(['message' => 'Identifiants incorrects'], 401);
        }

        return response()->json([
            'user'  => new UserResource(auth('api')->user()),
            'token' => $token,
        ]);
    }

    public function logout(): JsonResponse
    {
        auth('api')->logout();
        return response()->json(['message' => 'Déconnecté avec succès']);
    }

    public function me(): JsonResponse
    {
        return response()->json(new UserResource(auth('api')->user()));
    }
}