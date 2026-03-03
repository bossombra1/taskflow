<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $user = auth('api')->user();

        $projectIds = $user->projects()->pluck('id');

        $total    = \App\Models\Task::whereIn('project_id', $projectIds)->count();
        $done     = \App\Models\Task::whereIn('project_id', $projectIds)->where('status', 'done')->count();
        $todo     = \App\Models\Task::whereIn('project_id', $projectIds)->where('status', 'todo')->count();
        $inProgress = \App\Models\Task::whereIn('project_id', $projectIds)->where('status', 'in_progress')->count();

        return response()->json([
            'total_tasks'    => $total,
            'done_tasks'     => $done,
            'todo_tasks'     => $todo,
            'in_progress_tasks' => $inProgress,
        ]);
    }
}