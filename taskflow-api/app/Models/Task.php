<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'title',
        'description',
        'status',
        'priority',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    // Many-to-Many avec Users (assignation)
    public function users()
    {
        return $this->belongsToMany(User::class);
    }
}