interface Skill {
  name: string;
  description: string;
  level: number;
  keywords: string[];
  group?: string;
  id: string;
}

export const getSkillsByGroup = (skills = []) => {
  const groupSkills: { [key: string]: Skill[] } = {};

  for (const skill of skills as Skill[]) {
    if (!skill.group) {
      skill.group = "_default_";
    }
    if (!groupSkills[skill.group]) {
      groupSkills[skill.group] = [];
    }
    groupSkills[skill.group].push(skill);
  }

  return Object.entries(groupSkills).map(([group, skills]) => ({
    group,
    skills,
  }));
};
