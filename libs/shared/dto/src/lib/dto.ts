export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  organizations?: Organization[];
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  load?: number;
  organizationId: string;
  skills?: Skill[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
  _count?: {
    skills: number;
    apiKeys: number;
  };
}

export interface Skill {
  id: string;
  name: string;
  description?: string;
  systemPrompt?: string;
  temperature?: number;
  modelName?: string;
  ragEnabled?: boolean;
  projectId: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date | string;
  isStreaming?: boolean;
}

export interface ChatRequest {
  skillId: string;
  user_input: string;
}

export interface ChatResponse {
  content: string;
}

export interface RegisterDto {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  organizationName: string;
}

export interface LoginDto {
  email: string;
  password?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User & { sid?: string };
}
