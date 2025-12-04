-- Check for any triggers on Users table
SELECT 
    t.name AS TriggerName,
    OBJECT_NAME(t.parent_id) AS TableName,
    t.is_disabled AS IsDisabled,
    m.definition AS TriggerDefinition
FROM sys.triggers t
INNER JOIN sys.sql_modules m ON t.object_id = m.object_id
WHERE OBJECT_NAME(t.parent_id) = 'Users';

-- Check all registrations
SELECT 
    r.id,
    r.studentId,
    u.username,
    u.email,
    c.code,
    c.name,
    r.createdAt
FROM Registrations r
INNER JOIN Users u ON r.studentId = u.id
INNER JOIN Courses c ON r.courseId = c.id
ORDER BY r.createdAt DESC;
