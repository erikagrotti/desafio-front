export interface Task {
  listID: string;
  taskID: string;
  title: string;
  status: string;
}

export interface TaskGroup {
  listID: string;
  listTitle: string;
  listStatus: string;
  tasks: Task[];
  newTasks?: Task[]; // Opciona   l, pois você pode não sempre precisar dela
}

export interface EditTaskListData {
  listID: string;
  listTitle: string;
  listStatus: string;
  tasks: Task[];
  newTasks: Task[];
}
