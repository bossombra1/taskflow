<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'name'        => $this->name,
            'description' => $this->description,
            'color'       => $this->color,
            'owner'       => new UserResource($this->whenLoaded('user')),
            'tasks_count' => $this->whenCounted('tasks'),
            'created_at'  => $this->created_at->toDateTimeString(),
        ];
    }
}