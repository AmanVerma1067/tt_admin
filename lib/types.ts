export interface Session {
  time: string
  subject: string
  room: string
  teacher: string
}

export interface Batch {
  batch: string
  Monday: Session[]
  Tuesday: Session[]
  Wednesday: Session[]
  Thursday: Session[]
  Friday: Session[]
  Saturday: Session[]
}

export interface LoginResponse {
  token: string
}

export interface ApiError {
  message: string
  status?: number
}
