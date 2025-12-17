export type UserRole =
  | "student"
  | "mess_manager"
  | "hostel_office";

export interface AuthUser {
  uid: string;
  email: string;
  role: UserRole;
}
