export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  bio: string;
  expertise: string[];
}

export interface Project {
  name: string;
  description: string;
  tags: string[];
  image?: string;
}

export interface TeamInfo {
  name: string;
  description: string;
  vision: string;
  mission: string;
  members: TeamMember[];
  projects: Project[];
  contact: {
    email: string;
    phone: string;
    website: string;
    location: string;
  };
}
