<!-- resources/views/emails/task-assigned.blade.php -->
<!DOCTYPE html>
<html>
<head>
    <title>Task Assigned</title>
</head>
<body>
    <h1>New Task Assigned</h1>
    <p>Hello {{ $task->assignedUser->name }},</p>
    <p>A new task has been assigned to you:</p>
    
    <div style="border: 1px solid #ddd; padding: 20px; margin: 20px 0;">
        <h2>{{ $task->title }}</h2>
        <p><strong>Description:</strong> {{ $task->description }}</p>
        <p><strong>Deadline:</strong> {{ $task->deadline->format('F j, Y g:i A') }}</p>
        <p><strong>Assigned by:</strong> {{ $task->assignedByUser->name }}</p>
    </div>
    
    <p>Please log in to your dashboard to view and manage this task.</p>
    
    <p>Best regards,<br>Task Management System</p>
</body>
</html>