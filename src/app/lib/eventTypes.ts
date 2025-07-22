// Event Types Constants
// Centralized event types to ensure consistency across the application

export const EVENT_TYPES = [
  "Workshop & Seminar",
  "Hackathon",
  "Tech Fest",
  "Cultural Fest",
  "Sports Event",
  "Conference",
  "Academic/Departmental Fest",
  "Art and Literary Fest",
  "Social Impact Fest", 
  "Film and Media Fest",
  "Wellness and Mental Health",
  "MUN",
  "Entrepreneurship/Business Fest",
  "Comedy Event"
] as const;

export type EventType = typeof EVENT_TYPES[number];

// Event type options for dropdowns and multi-selects
export const EVENT_TYPE_OPTIONS = EVENT_TYPES.map(type => ({
  value: type,
  label: type
}));

// Legacy mapping for backward compatibility if needed
export const EVENT_TYPE_LEGACY_MAP: Record<string, string> = {
  "Sports Meet": "Sports Event",
  "Technical Fest": "Tech Fest",
  "Workshop": "Workshop & Seminar",
  "Seminar": "Workshop & Seminar"
};
