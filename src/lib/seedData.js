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
  { 
    id: 101, 
    reporterId: 2, 
    title: "Overflowing garbage near market", 
    category: "garbage", 
    department: 1, 
    priority: "high", 
    status: "submitted", 
    assignedTo: 7, 
    createdAt: "2025-09-01",
    description: "Large garbage bins are overflowing near the main market area, causing health hazards and bad smell. Immediate attention required.",
    location: "Main Road Market, Ranchi, Jharkhand",
    coordinates: { lat: 23.3441, lng: 85.3096 },
    image: "https://images.unsplash.com/photo-1586899028174-e7098604235b?w=400&h=300&fit=crop"
  },
  { 
    id: 102, 
    reporterId: 2, 
    title: "Uncollected trash in colony", 
    category: "garbage", 
    department: 1, 
    priority: "medium", 
    status: "in_progress", 
    assignedTo: 8, 
    createdAt: "2025-09-05",
    description: "Household waste has not been collected for 4 days in residential colony. Multiple houses affected.",
    location: "Ashok Nagar Colony, Ranchi, Jharkhand",
    coordinates: { lat: 23.3569, lng: 85.3347 },
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop"
  },

  // Public works
  { 
    id: 103, 
    reporterId: 3, 
    title: "Pothole on main road", 
    category: "pothole", 
    department: 2, 
    priority: "critical", 
    status: "assigned", 
    assignedTo: 9, 
    createdAt: "2025-09-02",
    description: "Deep pothole on main road causing accidents and vehicle damage. Traffic is getting affected during peak hours.",
    location: "Circular Road, Jamshedpur, Jharkhand",
    coordinates: { lat: 22.8046, lng: 86.2029 },
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop"
  },
  { 
    id: 104, 
    reporterId: 3, 
    title: "Broken footpath tiles", 
    category: "infrastructure", 
    department: 2, 
    priority: "low", 
    status: "resolved", 
    assignedTo: 10, 
    createdAt: "2025-09-03",
    description: "Footpath tiles are broken and uneven, making it difficult for pedestrians to walk safely.",
    location: "Sakchi Area, Jamshedpur, Jharkhand",
    coordinates: { lat: 22.7925, lng: 86.1842 },
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=300&fit=crop"
  },

  // Electricity
  { 
    id: 105, 
    reporterId: 4, 
    title: "Streetlight not working in Sector 7", 
    category: "streetlight", 
    department: 3, 
    priority: "medium", 
    status: "submitted", 
    assignedTo: 11, 
    createdAt: "2025-09-04",
    description: "Multiple streetlights are not working in Sector 7, making the area unsafe during night hours.",
    location: "HEC Colony, Ranchi, Jharkhand",
    coordinates: { lat: 23.4241, lng: 85.4419 },
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop"
  },
  { 
    id: 106, 
    reporterId: 4, 
    title: "Loose electric wire", 
    category: "electrical hazard", 
    department: 3, 
    priority: "high", 
    status: "in_progress", 
    assignedTo: 12, 
    createdAt: "2025-09-07",
    description: "Electrical wire hanging dangerously low near residential area. High risk of electrocution.",
    location: "Bistupur Market, Jamshedpur, Jharkhand",
    coordinates: { lat: 22.7739, lng: 86.1478 },
    image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=300&fit=crop"
  },

  // Water supply
  { 
    id: 107, 
    reporterId: 5, 
    title: "Water leakage near school", 
    category: "leakage", 
    department: 4, 
    priority: "high", 
    status: "assigned", 
    assignedTo: 13, 
    createdAt: "2025-09-06",
    description: "Major water pipeline leakage near government school causing waterlogging and wastage.",
    location: "Government High School, Dhanbad, Jharkhand",
    coordinates: { lat: 23.7957, lng: 86.4304 },
    image: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=400&h=300&fit=crop"
  },
  { 
    id: 108, 
    reporterId: 5, 
    title: "No water supply in Sector 10", 
    category: "supply", 
    department: 4, 
    priority: "critical", 
    status: "submitted", 
    assignedTo: 14, 
    createdAt: "2025-09-08",
    description: "Complete water supply failure in Sector 10. Residents facing severe water shortage for 2 days.",
    location: "Bank More Area, Dhanbad, Jharkhand",
    coordinates: { lat: 23.8103, lng: 86.4538 },
    image: "https://images.unsplash.com/photo-1597149958500-2cdf92eca7f0?w=400&h=300&fit=crop"
  },

  // Parks
  { 
    id: 109, 
    reporterId: 6, 
    title: "Broken swings in park", 
    category: "equipment", 
    department: 5, 
    priority: "low", 
    status: "resolved", 
    assignedTo: 15, 
    createdAt: "2025-09-01",
    description: "Children's swings are broken and unsafe. Need immediate repair or replacement.",
    location: "Oxygen Park, Ranchi, Jharkhand",
    coordinates: { lat: 23.3629, lng: 85.3371 },
    image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400&h=300&fit=crop"
  },
  { 
    id: 110, 
    reporterId: 6, 
    title: "Overgrown grass", 
    category: "maintenance", 
    department: 5, 
    priority: "medium", 
    status: "in_progress", 
    assignedTo: 16, 
    createdAt: "2025-09-09",
    description: "Park grass has grown too high and needs cutting. Also requires general maintenance.",
    location: "Jublee Park, Jamshedpur, Jharkhand",
    coordinates: { lat: 22.7868, lng: 86.1890 },
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop"
  },

  // Extra reports for realism
  { 
    id: 111, 
    reporterId: 2, 
    title: "Overflowing bins near bus stop", 
    category: "garbage", 
    department: 1, 
    priority: "medium", 
    status: "resolved", 
    assignedTo: 7, 
    createdAt: "2025-09-10",
    description: "Garbage bins near bus stop are overflowing, creating unhygienic conditions for commuters.",
    location: "Bus Stand, Bokaro Steel City, Jharkhand",
    coordinates: { lat: 23.6693, lng: 86.1511 },
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop"
  },
  { 
    id: 112, 
    reporterId: 3, 
    title: "Bridge railing broken", 
    category: "infrastructure", 
    department: 2, 
    priority: "high", 
    status: "in_progress", 
    assignedTo: 10, 
    createdAt: "2025-09-11",
    description: "Bridge railing is damaged and poses safety risk for pedestrians and vehicles.",
    location: "Kharkai Bridge, Jamshedpur, Jharkhand",
    coordinates: { lat: 22.8033, lng: 86.2025 },
    image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=300&fit=crop"
  },
  { 
    id: 113, 
    reporterId: 4, 
    title: "Transformer spark near colony", 
    category: "electrical hazard", 
    department: 3, 
    priority: "critical", 
    status: "submitted", 
    assignedTo: 12, 
    createdAt: "2025-09-12",
    description: "Electrical transformer is sparking and making loud noises. Immediate attention required to prevent accidents.",
    location: "Kadma Area, Jamshedpur, Jharkhand",
    coordinates: { lat: 22.8144, lng: 86.2108 },
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=300&fit=crop"
  },
  { 
    id: 114, 
    reporterId: 5, 
    title: "Pipe leakage at main road", 
    category: "leakage", 
    department: 4, 
    priority: "high", 
    status: "assigned", 
    assignedTo: 14, 
    createdAt: "2025-09-13",
    description: "Underground water pipe has burst, causing road flooding and water wastage.",
    location: "Main Road, Deoghar, Jharkhand",
    coordinates: { lat: 24.4824, lng: 86.6977 },
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop"
  },
  { 
    id: 115, 
    reporterId: 6, 
    title: "Playground fence damaged", 
    category: "maintenance", 
    department: 5, 
    priority: "medium", 
    status: "submitted", 
    assignedTo: 16, 
    createdAt: "2025-09-14",
    description: "Playground boundary fence is damaged allowing stray animals to enter and making it unsafe for children.",
    location: "Sector 4 Park, Bokaro Steel City, Jharkhand",
    coordinates: { lat: 23.6642, lng: 86.1513 },
    image: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=400&h=300&fit=crop"
  }
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

export const initialReports = [
  { id: 101, reporterId: 2, title: "Overflowing garbage near market", category: "garbage", department: 1, priority: "high", status: "submitted", assignedTo: 7, createdAt: "2025-09-01" },
  { id: 102, reporterId: 2, title: "Uncollected trash in colony", category: "garbage", department: 1, priority: "medium", status: "in_progress", assignedTo: 8, createdAt: "2025-09-05" },
  { id: 103, reporterId: 3, title: "Pothole on main road", category: "pothole", department: 2, priority: "critical", status: "assigned", assignedTo: 9, createdAt: "2025-09-02" },
  { id: 104, reporterId: 3, title: "Broken footpath tiles", category: "infrastructure", department: 2, priority: "low", status: "resolved", assignedTo: 10, createdAt: "2025-09-03" },
  { id: 105, reporterId: 4, title: "Streetlight not working in Sector 7", category: "streetlight", department: 3, priority: "medium", status: "submitted", assignedTo: 11, createdAt: "2025-09-04" },
]