// lib/seedData.js
// Mock data for SIH 2025 Government Issue Management Platform

export const departments = [
  { id: 1, name: "Sanitation", code: "SAN", description: "Waste collection, garbage disposal", defaultPriority: "medium" },
  { id: 2, name: "Public Works", code: "PWC", description: "Road maintenance, potholes, buildings", defaultPriority: "high" },
  { id: 3, name: "Electricity", code: "ELC", description: "Streetlights, wiring, electrical safety", defaultPriority: "high" },
  { id: 4, name: "Water Supply", code: "WAT", description: "Pipelines, water supply, leakages", defaultPriority: "medium" },
  { id: 5, name: "Parks & Recreation", code: "PRK", description: "Maintenance of public parks & gardens", defaultPriority: "low" }
];

export const users = [
  // Admin
  { id: 1, name: "Central Admin", email: "admin@gov.in", role: "admin", isActive: true },

  // Department Heads
  { id: 2, name: "Ravi Kumar", email: "ravi.sanitation@gov.in", role: "department_head", department: 1, isActive: true },
  { id: 3, name: "Meena Sharma", email: "meena.publicworks@gov.in", role: "department_head", department: 2, isActive: true },
  { id: 4, name: "Arjun Verma", email: "arjun.electricity@gov.in", role: "department_head", department: 3, isActive: true },
  { id: 5, name: "Neha Singh", email: "neha.water@gov.in", role: "department_head", department: 4, isActive: true },
  { id: 6, name: "Amit Patel", email: "amit.parks@gov.in", role: "department_head", department: 5, isActive: true },

  // Staff
  { id: 7, name: "Staff A", email: "staffa.san@gov.in", role: "staff", department: 1, manager: 2, isActive: true },
  { id: 8, name: "Staff B", email: "staffb.san@gov.in", role: "staff", department: 1, manager: 2, isActive: true },
  { id: 9, name: "Staff C", email: "staffc.pwc@gov.in", role: "staff", department: 2, manager: 3, isActive: true },
  { id: 10, name: "Staff D", email: "staffd.pwc@gov.in", role: "staff", department: 2, manager: 3, isActive: true },
  { id: 11, name: "Staff E", email: "staffe.elc@gov.in", role: "staff", department: 3, manager: 4, isActive: true },
  { id: 12, name: "Staff F", email: "stafff.elc@gov.in", role: "staff", department: 3, manager: 4, isActive: true },
  { id: 13, name: "Staff G", email: "staffg.wat@gov.in", role: "staff", department: 4, manager: 5, isActive: true },
  { id: 14, name: "Staff H", email: "staffh.wat@gov.in", role: "staff", department: 4, manager: 5, isActive: true },
  { id: 15, name: "Staff I", email: "staffi.prk@gov.in", role: "staff", department: 5, manager: 6, isActive: true },
  { id: 16, name: "Staff J", email: "staffj.prk@gov.in", role: "staff", department: 5, manager: 6, isActive: true }
];

export const reports = [
  // Sample sanitation issues
  { id: 101, reporterId: 2, title: "Overflowing garbage near market", category: "garbage", department: 1, priority: "high", status: "submitted", assignedTo: 7, createdAt: "2025-09-01" },
  { id: 102, reporterId: 2, title: "Uncollected trash in colony", category: "garbage", department: 1, priority: "medium", status: "in_progress", assignedTo: 8, createdAt: "2025-09-05" },

  // Public works
  { id: 103, reporterId: 3, title: "Pothole on main road", category: "pothole", department: 2, priority: "critical", status: "assigned", assignedTo: 9, createdAt: "2025-09-02" },
  { id: 104, reporterId: 3, title: "Broken footpath tiles", category: "infrastructure", department: 2, priority: "low", status: "resolved", assignedTo: 10, createdAt: "2025-09-03" },

  // Electricity
  { id: 105, reporterId: 4, title: "Streetlight not working in Sector 7", category: "streetlight", department: 3, priority: "medium", status: "submitted", assignedTo: 11, createdAt: "2025-09-04" },
  { id: 106, reporterId: 4, title: "Loose electric wire", category: "electrical hazard", department: 3, priority: "high", status: "in_progress", assignedTo: 12, createdAt: "2025-09-07" },

  // Water supply
  { id: 107, reporterId: 5, title: "Water leakage near school", category: "leakage", department: 4, priority: "high", status: "assigned", assignedTo: 13, createdAt: "2025-09-06" },
  { id: 108, reporterId: 5, title: "No water supply in Sector 10", category: "supply", department: 4, priority: "critical", status: "submitted", assignedTo: 14, createdAt: "2025-09-08" },

  // Parks
  { id: 109, reporterId: 6, title: "Broken swings in park", category: "equipment", department: 5, priority: "low", status: "resolved", assignedTo: 15, createdAt: "2025-09-01" },
  { id: 110, reporterId: 6, title: "Overgrown grass", category: "maintenance", department: 5, priority: "medium", status: "in_progress", assignedTo: 16, createdAt: "2025-09-09" },

  // Extra reports for realism
  { id: 111, reporterId: 2, title: "Overflowing bins near bus stop", category: "garbage", department: 1, priority: "medium", status: "resolved", assignedTo: 7, createdAt: "2025-09-10" },
  { id: 112, reporterId: 3, title: "Bridge railing broken", category: "infrastructure", department: 2, priority: "high", status: "in_progress", assignedTo: 10, createdAt: "2025-09-11" },
  { id: 113, reporterId: 4, title: "Transformer spark near colony", category: "electrical hazard", department: 3, priority: "critical", status: "submitted", assignedTo: 12, createdAt: "2025-09-12" },
  { id: 114, reporterId: 5, title: "Pipe leakage at main road", category: "leakage", department: 4, priority: "high", status: "assigned", assignedTo: 14, createdAt: "2025-09-13" },
  { id: 115, reporterId: 6, title: "Playground fence damaged", category: "maintenance", department: 5, priority: "medium", status: "submitted", assignedTo: 16, createdAt: "2025-09-14" }
];

export const notifications = [
  { id: 1, userId: 7, type: "assigned", message: "New sanitation issue assigned to you." },
  { id: 2, userId: 8, type: "in_progress", message: "You started working on trash collection." },
  { id: 3, userId: 9, type: "assigned", message: "Pothole issue assigned to you." },
  { id: 4, userId: 10, type: "resolved", message: "You resolved broken footpath tiles." },
  { id: 5, userId: 11, type: "assigned", message: "Streetlight repair assigned to you." },
  { id: 6, userId: 12, type: "in_progress", message: "Handling electrical hazard issue." },
  { id: 7, userId: 13, type: "assigned", message: "Water leakage case assigned to you." },
  { id: 8, userId: 14, type: "submitted", message: "New water supply issue reported." },
  { id: 9, userId: 15, type: "resolved", message: "Swings repair completed successfully." },
  { id: 10, userId: 16, type: "in_progress", message: "Grass cutting in progress." }
];
