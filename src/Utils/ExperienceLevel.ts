export const ExperienceToLevel = (exp: number) => Math.cbrt(exp)

export const LevelToExperience = (level: number) => Math.pow(level, 3)
