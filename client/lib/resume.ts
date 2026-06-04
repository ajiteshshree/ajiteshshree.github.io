const resumeUrlFromEnv = import.meta.env.VITE_RESUME_URL?.trim();

export const resumeUrl = resumeUrlFromEnv || "/resume.pdf";
export const isExternalResume = /^https?:\/\//i.test(resumeUrl);
