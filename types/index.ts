export type Role = "CLIENTE" | "SOPORTE" | "ADMIN";

export type SidebarLink = {
  href: string;
  label: string;
};

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: "CLIENTE" | "SOPORTE" | "ADMIN";
  iat: number;
  exp: number;
};

export type SupportUser = {
  id: string;
  name: string;
  email: string;
};
