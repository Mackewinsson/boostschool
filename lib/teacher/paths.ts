export const teacherPaths = {
  home: "/alumno/profesor",
  leads: "/alumno/profesor/leads",
  lead: (id: string) => `/alumno/profesor/leads/${id}`,
  contacts: "/alumno/profesor/contactos",
  contact: (id: string) => `/alumno/profesor/contactos/${id}`,
  emails: "/alumno/profesor/emails",
  signature: "/alumno/profesor/firma",
} as const;
