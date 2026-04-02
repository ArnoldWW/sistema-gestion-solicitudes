export type Role = "CLIENTE" | "SOPORTE" | "ADMIN";

export type SidebarLink = {
  href: string;
  label: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  banned: number;
};

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  iat: number;
  exp: number;
};

export type SupportUser = {
  id: string;
  name: string;
  email: string;
};

export type RequestRow = {
  id: string;
  user_id: string;
  user_name?: string | null;
  title: string;
  description?: string | null;
  status: string;
  response?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  support_id?: string | null;
  support_name?: string;
};
