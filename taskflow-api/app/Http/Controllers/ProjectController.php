<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Http\JsonResponse;

class ProjectController extends Controller
{
    public function index(): JsonResponse
    {
        $projects = auth('api')->user()
            ->projects()
            ->withCount('tasks')
            ->get();

        return response()->json(ProjectResource::collection($projects));
    }

    public function store(StoreProjectRequest $request): JsonResponse
    {
        $project = auth('api')->user()
            ->projects()
            ->create($request->validated());

        return response()->json(new ProjectResource($project), 201);
    }

    public function show(Project $project): JsonResponse
    {
        $this->authorizeProject($project);
        $project->load('user');

        return response()->json(new ProjectResource($project));
    }

    public function update(UpdateProjectRequest $request, Project $project): JsonResponse
    {
        $this->authorizeProject($project);
        $project->update($request->validated());

        return response()->json(new ProjectResource($project));
    }

    public function destroy(Project $project): JsonResponse
    {
        $this->authorizeProject($project);
        $project->delete();

        return response()->json(['message' => 'Projet supprimé']);
    }

    private function authorizeProject(Project $project): void
    {
        abort_if($project->user_id !== auth('api')->id(), 403, 'Accès refusé');
    }
}