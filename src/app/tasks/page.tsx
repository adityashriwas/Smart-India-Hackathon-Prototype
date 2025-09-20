'use client'

import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import { updateReport } from '@/redux/slices/reportSlice'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { reports, departments } from '@/lib/seedData.js'
import { CheckCircle, Clock, AlertCircle, Play, Square } from 'lucide-react'

export default function TasksPage() {
  const { user } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

  // Only staff can access this page
  if (user?.role !== 'staff') {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Access denied. Staff privileges required.</p>
      </div>
    )
  }

  const myTasks = reports.filter(r => r.assignedTo === user.id)
  const pendingTasks = myTasks.filter(r => r.status === 'assigned')
  const inProgressTasks = myTasks.filter(r => r.status === 'in_progress')
  const completedTasks = myTasks.filter(r => r.status === 'resolved')

  const handleStatusUpdate = (
    reportId: number,
    newStatus: 'submitted' | 'in_progress' | 'assigned' | 'resolved'
  ) => {
    dispatch(updateReport({ id: reportId, updates: { status: newStatus } }))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'assigned': return <AlertCircle className="h-4 w-4 text-blue-500" />
      case 'in_progress': return <Clock className="h-4 w-4 text-orange-500" />
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-500" />
      default: return <Square className="h-4 w-4 text-gray-500" />
    }
  }

  const TaskCard = ({ task, showActions = true }: { task: any, showActions?: boolean }) => {
    const department = departments.find(d => d.id === task.department)
    
    return (
      <div className="border rounded-lg p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {getStatusIcon(task.status)}
              <h3 className="font-semibold">#{task.id} - {task.title}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-1">Category: {task.category}</p>
            <p className="text-sm text-gray-600 mb-1">Department: {department?.name}</p>
            <p className="text-sm text-gray-500">Created: {task.createdAt}</p>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <span className={`px-2 py-1 rounded-full text-xs ${
              task.priority === 'critical' ? 'bg-red-100 text-red-800' :
              task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {task.priority} priority
            </span>
          </div>
        </div>
        
        {showActions && (
          <div className="flex space-x-2 pt-2">
            {task.status === 'assigned' && (
              <Button
                size="sm"
                onClick={() => handleStatusUpdate(task.id, 'in_progress')}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Play className="h-4 w-4 mr-1" />
                Start Working
              </Button>
            )}
            {task.status === 'in_progress' && (
              <Button
                size="sm"
                onClick={() => handleStatusUpdate(task.id, 'resolved')}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Mark Complete
              </Button>
            )}
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
        <p className="text-gray-600">Manage your assigned reports and tasks</p>
      </div>

      {/* Task Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Square className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myTasks.length}</div>
            <p className="text-xs text-muted-foreground">All time assignments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{pendingTasks.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{inProgressTasks.length}</div>
            <p className="text-xs text-muted-foreground">Currently working</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
            <p className="text-xs text-muted-foreground">Successfully resolved</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Tasks */}
      {pendingTasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-blue-500" />
              Pending Tasks ({pendingTasks.length})
            </CardTitle>
            <CardDescription>Tasks waiting for you to start working on them</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* In Progress Tasks */}
      {inProgressTasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-orange-500" />
              In Progress ({inProgressTasks.length})
            </CardTitle>
            <CardDescription>Tasks you are currently working on</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inProgressTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completed Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
            Completed Tasks ({completedTasks.length})
          </CardTitle>
          <CardDescription>Tasks you have successfully resolved</CardDescription>
        </CardHeader>
        <CardContent>
          {completedTasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No completed tasks yet.</p>
          ) : (
            <div className="space-y-4">
              {completedTasks.slice(0, 5).map((task) => (
                <TaskCard key={task.id} task={task} showActions={false} />
              ))}
              {completedTasks.length > 5 && (
                <div className="text-center pt-4">
                  <Button variant="outline">View All Completed Tasks</Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* No Tasks Message */}
      {myTasks.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Square className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Tasks Assigned</h3>
            <p className="text-gray-500">You don&apos;t have any tasks assigned to you yet.</p>
            <p className="text-gray-400 text-sm mt-2">Check back later or contact your department head.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
