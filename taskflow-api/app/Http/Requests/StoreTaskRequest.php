<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'status'      => 'nullable|in:todo,in_progress,done',
            'priority'    => 'nullable|in:low,medium,high',
            'user_ids'    => 'nullable|array',
            'user_ids.*'  => 'exists:users,id',
        ];
    }
}