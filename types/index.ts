export type UserRole = "student" | "volunteer" | "admin";

export interface User {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  language?: string;
  createdAt: string;
}

export interface Student extends User {
  role: "student";
  grade: string;
  subjects: string[];
  learningPace: string;
  curiosities: string[];
  assignedVolunteerId?: string;
  streak: number;
  progressScore: number;
  status: "on-track" | "needs-attention" | "at-risk" | "unassigned";
  badges: string[];
  hasSmartphone: boolean;
  hasInternet: string;
}

export interface VolunteerApplication {
  id?: string;
  uid: string;
  status: "pending" | "approved" | "rejected";
  personalInfo: {
    fullName: string;
    age: number;
    gender: string;
    mobile: string;
    whatsapp: string;
    email: string;
    state: string;
    city: string;
    languages: string[];
  };
  qualification: {
    status: string;
    institution?: string;
    course?: string;
    year?: string;
    profession?: string;
    organization?: string;
    highestQualification: string;
    bio: string;
  };
  deliveryType: "academic" | "skill" | "both" | "one-time";
  academic?: {
    subjects: string[];
    grades: string[];
    teachingStyle: string;
  };
  skills?: {
    skills: string[];
    format: string;
    duration: string;
  };
  oneTime?: {
    description: string;
    proposedDate: string;
  };
  availability: {
    days: string[];
    slots: string[];
    hoursPerWeek: string;
    mode: string;
    locality?: string;
  };
  motivation: {
    whyVolunteer: string;
    volunteeredBefore: boolean;
    pastExperience?: string;
    teachingExperience: boolean;
    teachingDetails?: string;
    studentGains: string;
  };
  verification: {
    idUploaded: string;
    linkedin?: string;
    github?: string;
    emergencyContactName: string;
    emergencyContactNumber: string;
    emergencyContactRelation: string;
  };
  submittedAt: string;
}

export interface Volunteer extends User {
  role: "volunteer";
  applicationId: string;
  deliveryType: "academic" | "skill" | "both" | "one-time";
  subjects: string[];
  skills: string[];
  availability: Record<string, any>;
  impactScore: number;
  sessionsCompleted: number;
  workshopsHosted: number;
  studentsAssigned: string[];
  status: "active" | "inactive";
  approvedAt: string;
}

export interface Session {
  id: string;
  studentId: string;
  volunteerId: string;
  scheduledAt: string;
  status: "scheduled" | "completed" | "cancelled" | "missed";
  type: string;
  subject: string;
  mentorNotes?: string;
  studentRating?: number;
  lessonPlan?: any;
  createdAt: string;
}

export interface Workshop {
  id: string;
  volunteerId: string;
  title: string;
  description: string;
  skillCategory: string;
  scheduledAt: string;
  duration: string;
  maxStudents: number;
  registeredStudents: string[];
  status: "pending_approval" | "approved" | "completed" | "cancelled";
  mode: "online" | "offline";
  meetingLink?: string;
  ngoId?: string;
  createdAt: string;
}

export interface Progress {
  studentId: string;
  subject: string;
  milestones: string[];
  currentLevel: number;
  lastUpdated: string;
  sessionCount: number;
}

export interface ResourceItem {
  id?: string;
  title: string;
  topic: string;
  grade: string;
  subject: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  type: "platform" | "volunteer_created";
  creatorId?: string;
  format: "video" | "pdf" | "link" | "text" | "image";
  contentUrl?: string;
  textContent?: string;
  ratingCount: number;
  ratingTotal: number;
  createdAt: string;
}
