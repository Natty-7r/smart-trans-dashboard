// import { User } from "@/types/auth.type";

// // Demo users for authentication
// export const DEMO_USERS: User[] = [
//   {
//     id: "user-001",
//     email: "admin@safaricom.com",
//     name: "John Admin",
//     role: "admin",
//     status: "active",
//     location: {
//       continent: "Africa",
//       country: "Ethiopia",
//       region: "Addis Ababa",
//       district: "Bole",
//     },
//     phone: "+251-911-123-456",
//     assignedSites: [
//       "site-001",
//       "site-002",
//       "site-003",
//       "site-004",
//       "site-005",
//       "site-006",
//       "site-007",
//       "site-008",
//       "site-009",
//       "site-010",
//       "site-011",
//       "site-012",
//       "site-013",
//       "site-014",
//       "site-015",
//     ],
//     createdAt: "2023-01-01T00:00:00Z",
//     updatedAt: "2026-07-01T00:00:00Z",
//     lastActive: "2026-07-07T10:00:00Z",
//   },
//   {
//     id: "user-002",
//     email: "sarah.noc@safaricom.com",
//     name: "Sarah NOC",
//     role: "country_manager",
//     status: "active",
//     location: {
//       continent: "Africa",
//       country: "Ethiopia",
//       region: "Addis Ababa",
//       district: "Bole",
//     },
//     phone: "+251-911-234-567",
//     assignedSites: [
//       "site-001",
//       "site-002",
//       "site-003",
//       "site-004",
//       "site-005",
//       "site-006",
//       "site-007",
//     ],
//     createdAt: "2023-01-15T00:00:00Z",
//     updatedAt: "2026-07-01T00:00:00Z",
//     lastActive: "2026-07-07T09:30:00Z",
//     createdBy: "user-001",
//   },
//   {
//     id: "user-003",
//     email: "mike.field@safaricom.com",
//     name: "Mike Field",
//     role: "field_engineer",
//     status: "active",
//     location: {
//       continent: "Africa",
//       country: "Ethiopia",
//       region: "Addis Ababa",
//       district: "Bole",
//     },
//     phone: "+251-911-456-789",
//     assignedSites: ["site-001", "site-002", "site-003", "site-005", "site-007"],
//     createdAt: "2023-02-01T00:00:00Z",
//     updatedAt: "2026-07-01T00:00:00Z",
//     lastActive: "2026-07-07T08:45:00Z",
//     createdBy: "user-004",
//   },
//   {
//     id: "user-004",
//     email: "lisa.manager@safaricom.com",
//     name: "Lisa Manager",
//     role: "regional_manager",
//     status: "active",
//     location: {
//       continent: "Africa",
//       country: "Ethiopia",
//       region: "Addis Ababa",
//       district: "Kirkos",
//     },
//     phone: "+251-911-345-678",
//     assignedSites: ["site-001", "site-002", "site-003", "site-004"],
//     createdAt: "2023-03-01T00:00:00Z",
//     updatedAt: "2026-07-01T00:00:00Z",
//     lastActive: "2026-07-06T14:30:00Z",
//     createdBy: "user-002",
//   },
// ];

// // Demo passwords (in real app, these would be hashed)
// // For demo: all passwords are "password123"
// export const DEMO_PASSWORDS: Record<string, string> = {
//   "admin@safaricom.com": "password123",
//   "noc@safaricom.com": "password123",
//   "engineer@safaricom.com": "password123",
//   "manager@safaricom.com": "password123",
// };

// // Demo OTP storage (in real app, this would be in a database with TTL)
// export const DEMO_OTP_STORE: Record<
//   string,
//   { otp: string; expiresAt: string }
// > = {};

// // Helper: Find user by email
// export const findUserByEmail = (email: string): User | undefined => {
//   return DEMO_USERS.find((user) => user.email === email);
// };

// // Helper: Validate password
// export const validatePassword = (email: string, password: string): boolean => {
//   return DEMO_PASSWORDS[email] === password;
// };

// // Helper: Generate OTP (6 digits)
// export const generateOTP = (): string => {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// };

// // Helper: Store OTP
// export const storeOTP = (email: string, otp: string): void => {
//   DEMO_OTP_STORE[email] = {
//     otp,
//     expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
//   };
// };

// // Helper: Verify OTP
// export const verifyOTP = (email: string, otp: string): boolean => {
//   const record = DEMO_OTP_STORE[email];
//   if (!record) return false;
//   if (record.otp !== otp) return false;
//   if (new Date(record.expiresAt) < new Date()) return false;
//   return true;
// };

// // Helper: Clear OTP
// export const clearOTP = (email: string): void => {
//   delete DEMO_OTP_STORE[email];
// };
