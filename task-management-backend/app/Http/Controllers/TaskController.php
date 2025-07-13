<?php
// app/Http/Controllers/TaskController.php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
use App\Mail\TaskAssigned;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $query = Task::with(['assignedUser', 'assignedByUser']);

        if (!$request->user()->isAdmin()) {
            $query->where('assigned_to', $request->user()->id);
        }

        $tasks = $query->get();
        return response()->json($tasks);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'assigned_to' => 'required|exists:users,id',
            'deadline' => 'required|date|after:now',
        ]);

        $task = Task::create([
            'title' => $request->title,
            'description' => $request->description,
            'assigned_to' => $request->assigned_to,
            'assigned_by' => $request->user()->id,
            'deadline' => $request->deadline,
        ]);

        $task->load(['assignedUser', 'assignedByUser']);

        // Send email notification
        $assignedUser = User::find($request->assigned_to);
        Mail::to($assignedUser->email)->send(new TaskAssigned($task));

        return response()->json($task, 201);
    }

    public function show($id)
    {
        $task = Task::with(['assignedUser', 'assignedByUser'])->findOrFail($id);
        return response()->json($task);
    }

    public function update(Request $request, $id)
    {
        $task = Task::findOrFail($id);

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'status' => 'sometimes|required|in:pending,in_progress,completed',
            'assigned_to' => 'sometimes|required|exists:users,id',
            'deadline' => 'sometimes|required|date|after:now',
        ]);

        $task->update($request->only([
            'title', 'description', 'status', 'assigned_to', 'deadline'
        ]));

        $task->load(['assignedUser', 'assignedByUser']);

        return response()->json($task);
    }

    public function destroy($id)
    {
        $task = Task::findOrFail($id);
        $task->delete();

        return response()->json(['message' => 'Task deleted successfully']);
    }

    public function updateStatus(Request $request, $id)
    {
        $task = Task::findOrFail($id);

        $request->validate([
            'status' => 'required|in:pending,in_progress,completed',
        ]);

        $task->update(['status' => $request->status]);

        return response()->json($task);
    }
}