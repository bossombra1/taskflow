<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request, Project $project): JsonResponse
    {
        $this->authorizeProject($project);

        $tasks = $project->tasks()
            ->with('users')
            ->when($request->status,   fn($q) => $q->where('status',   $request->status))
            ->when($request->priority, fn($q) => $q->where('priority', $request->priority))
            ->get();

        return response()->json(TaskResource::collection($tasks));
    }

    public function store(StoreTaskRequest $request, Project $project): JsonResponse
    {
        $this->authorizeProject($project);

        $data = $request->validated();
        $task = $project->tasks()->create($data);

        if (!empty($data['user_ids'])) {
            $task->users()->sync($data['user_ids']);
        }

        $task->load('users');

        return response()->json(new TaskResource($task), 201);
    }

    public function show(Project $project, Task $task): JsonResponse
    {
        $this->authorizeProject($project);
        $task->load('users');

        return response()->json(new TaskResource($task));
    }

    public function update(UpdateTaskRequest $request, Project $project, Task $task): JsonResponse
    {
        $this->authorizeProject($project);

        $data = $request->validated();
        $task->update($data);

        if (isset($data['user_ids'])) {
            $task->users()->sync($data['user_ids']);
        }

        $task->load('users');

        return response()->json(new TaskResource($task));
    }

    public function destroy(Project $project, Task $task): JsonResponse
    {
        $this->authorizeProject($project);
        $task->delete();

        return response()->json(['message' => 'Tâche supprimée']);
    }

    private function authorizeProject(Project $project): void
    {
        abort_if($project->user_id !== auth('api')->id(), 403, 'Accès refusé');
    }
}