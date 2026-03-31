"use server";

/**
 * Claude AI Integrations Helper (lib/claude.ts)
 * 8 Required Integrations for EduBridge Project
 *
 * NOTE: This is a Server Action file.
 */

// If relying on Anthropic SDK (defined in package.json)
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || "", // WARNING: usually should be a server-side env (ANTHROPIC_API_KEY) without NEXT_PUBLIC
});

const DEFAULT_MODEL = "claude-3-5-sonnet-20240620"; // Using standard version mapping for Sonnet 3.5

export async function callClaude(prompt: string, systemPrompt?: string): Promise<string> {
  try {
    const msg = await anthropic.messages.create({
      model: DEFAULT_MODEL,
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: prompt }],
    });
    // @ts-ignore
    return msg.content[0].text;
  } catch (error) {
    console.error("Claude API Error:", error);
    throw new Error("Failed to communicate with AI");
  }
}

// 1. SMART MATCHING (Admin)
export async function generateSmartMatches(unassignedStudents: any[], availableVolunteers: any[]) {
  const prompt = `Given these unassigned students: ${JSON.stringify(unassignedStudents)} and available volunteers: ${JSON.stringify(availableVolunteers)}, suggest best pairings. For each explain why they match. Return JSON strictly in this format: [{"studentId": "...", "volunteerId": "...", "reason": "...", "confidenceScore": 95}]`;
  const response = await callClaude(prompt);
  return response; // Ideally we'd parse the JSON here
}

// 2. LESSON PLAN GENERATOR (Volunteer)
export async function generateLessonPlan(grade: string, topic: string) {
  const prompt = `Create a structured 45-minute lesson plan for Grade ${grade} on topic "${topic}". Include: learning objectives, warm-up (5min), main activity (25min), practice (10min), wrap-up (5min), materials needed. Make it engaging and age-appropriate for Indian students.`;
  return await callClaude(prompt);
}

// 3. WORKSHOP OUTLINE GENERATOR (Volunteer)
export async function generateWorkshopOutline(skill: string, audience: string) {
  const prompt = `Create a beginner-friendly workshop outline for teaching ${skill} to ${audience}. Include: session goals, icebreaker, 3 main activities with time estimates, key takeaways, what students can do after. Keep it fun and hands-on.`;
  return await callClaude(prompt);
}

// 4. PRE-SESSION BRIEFING (Volunteer)
export async function generatePreSessionBriefing(studentName: string, grade: string, weakAreas: string[], lastTopic: string, missedSessions: number) {
  const prompt = `Generate a pre-session briefing for a volunteer about to teach ${studentName} (Grade ${grade}). Weak areas: ${weakAreas.join(", ")}. Last session: ${lastTopic}. Sessions missed: ${missedSessions}. Recommend: focus area for today, one teaching tip, one encouragement note for the student.`;
  return await callClaude(prompt);
}

// 5. AI STUDY BUDDY (Student)
export async function aiStudyBuddyChat(studentGrade: string, language: string, userMessage: string) {
  const systemPrompt = `You are a friendly study buddy for a Grade ${studentGrade} student in India. Explain concepts simply, use relatable examples from everyday Indian life, be encouraging, keep answers short. Respond in ${language} if asked.`;
  return await callClaude(userMessage, systemPrompt);
}

// 6. DROPOUT RISK DETECTION (Admin - scheduled/batch)
export async function detectDropoutRisk(studentMetrics: any[]) {
  const prompt = `Analyze these students and flag those at risk of disengaging. Data: ${JSON.stringify(studentMetrics)}. Return JSON strictly in this format: [{"studentId": "...", "riskLevel": "medium|high|critical", "reason": "..."}]`;
  return await callClaude(prompt);
}

// 7. IMPACT REPORT GENERATOR (Admin)
export async function generateImpactReport(stats: any) {
  const prompt = `Write a compelling 400-word impact report for an NGO funder. Data: ${JSON.stringify(stats)}. Warm, professional tone. Include specific numbers. End with forward-looking statement.`;
  return await callClaude(prompt);
}

// 8. VOLUNTEER CERTIFICATE (Volunteer)
export async function generateVolunteerCertificate(name: string, sessions: number, studentsTaught: number, skills: string[], duration: string) {
  const prompt = `Write a 3-sentence personalized certificate narrative for volunteer ${name} who completed ${sessions} sessions, taught ${studentsTaught} students, covered ${skills.join(", ")}, over ${duration}. Make it warm, specific, and achievement-focused.`;
  return await callClaude(prompt);
}
