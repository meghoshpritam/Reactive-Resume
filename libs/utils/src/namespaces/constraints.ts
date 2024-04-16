export type ExperienceWorkTypes = {
  full_time: string;
  part_time: string;
  internship: string;
  freelance: string;
  contract: string;
};

export type ExperienceJobTypes = {
  remote: string;
  hybrid: string;
  on_site: string;
};

export const experienceWorkTypes: ExperienceWorkTypes = {
  full_time: "Full-time",
  part_time: "Part-time",
  internship: "Internship",
  freelance: "Freelance",
  contract: "Contract",
};

export const experienceJobTypes: ExperienceJobTypes = {
  remote: "Remote",
  hybrid: "Hybrid",
  on_site: "On Site",
};
