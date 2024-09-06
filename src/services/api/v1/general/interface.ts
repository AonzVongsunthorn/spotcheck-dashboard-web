export interface ExecutionLogsAPIResponse {
  data: ExecutionLog[];
}

export interface ExecutionLog {
  id:              number;
  job:             string;
  jobTitle:        string;
  lastExecutionAt: Date;
}
