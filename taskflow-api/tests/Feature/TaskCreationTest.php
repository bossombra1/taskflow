<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskCreationTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_create_a_task(): void
    {
        // Créer un utilisateur et un projet
        $user = User::factory()->create();
        $project = Project::factory()->create(['user_id' => $user->id]);

        // Générer le token JWT
        $token = auth('api')->login($user);

        // Envoyer la requête
        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson("/api/projects/{$project->id}/tasks", [
                'title'       => 'Tâche de test',
                'description' => 'Description test',
                'status'      => 'todo',
                'priority'    => 'high',
            ]);

        $response->assertStatus(201)
                 ->assertJsonFragment(['title' => 'Tâche de test'])
                 ->assertJsonFragment(['status' => 'todo'])
                 ->assertJsonFragment(['priority' => 'high']);

        $this->assertDatabaseHas('tasks', ['title' => 'Tâche de test']);
    }

    public function test_unauthenticated_user_cannot_create_a_task(): void
    {
        $user = User::factory()->create();
        $project = Project::factory()->create(['user_id' => $user->id]);

        $response = $this->postJson("/api/projects/{$project->id}/tasks", [
            'title' => 'Tâche non autorisée',
        ]);

        $response->assertStatus(401);
    }
}