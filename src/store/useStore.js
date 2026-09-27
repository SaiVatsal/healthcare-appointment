import { create } from 'zustand';

export const useStore = create((set, get) => ({
  currentUser: {
    id: 'pat-101',
    name: 'Eleanor Sterling',
    dob: '1992-06-14',
    bloodGroup: 'O+',
    allergies: ['Penicillin', 'Dust mites'],
    phone: '+1 (555) 234-8910',
    email: 'eleanor.sterling@medtrust.org',
    insuranceProvider: 'BlueShield Horizon Platinum',
    policyNumber: 'BS-8839210-A'
  },

  activeRole: 'patient', // 'patient' | 'doctor' | 'admin'
  setActiveRole: (role) => set({ activeRole: role }),

  doctors: [
    {
      id: 'doc-1',
      name: 'Dr. Julian Vance, MD',
      specialty: 'Cardiology',
      rating: 4.9,
      reviewsCount: 124,
      experience: '14 years',
      fee: '$160',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
      hospital: 'St. Jude Clinical Pavilion',
      availability: ['Today 2:30 PM', 'Tomorrow 10:00 AM', 'Tomorrow 3:15 PM'],
      bio: 'Board-certified cardiovascular specialist focusing on preventive cardiology and rhythm management.',
      telehealthReady: true
    },
    {
      id: 'doc-2',
      name: 'Dr. Sarah Lin, MD, PhD',
      specialty: 'Neurology',
      rating: 4.95,
      reviewsCount: 98,
      experience: '11 years',
      fee: '$190',
      avatar: 'https://images.unsplash.com/photo-1594824813620-1c39050d5f81?auto=format&fit=crop&w=400&q=80',
      hospital: 'Aura Neuroscience Center',
      availability: ['Tomorrow 11:30 AM', 'Friday 9:00 AM'],
      bio: 'Specialist in neuro-degenerative diagnostics and restorative cognitive therapy.',
      telehealthReady: true
    },
    {
      id: 'doc-3',
      name: 'Dr. Marcus Brody, DO',
      specialty: 'Orthopedics & Sports Med',
      rating: 4.8,
      reviewsCount: 84,
      experience: '9 years',
      fee: '$140',
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
      hospital: 'Metropolitan Mobility Clinic',
      availability: ['Today 4:00 PM', 'Thursday 2:00 PM'],
      bio: 'Joint preservation, robotic arthroplasty, and athletic recovery engineering.',
      telehealthReady: false
    },
    {
      id: 'doc-4',
      name: 'Dr. Amara Thorne, MD',
      specialty: 'Dermatology & Immunology',
      rating: 4.88,
      reviewsCount: 160,
      experience: '16 years',
      fee: '$150',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
      hospital: 'St. Jude Clinical Pavilion',
      availability: ['Tomorrow 1:00 PM', 'Friday 4:30 PM'],
      bio: 'Clinical laser therapeutics, autoimmune skin disorders, and dermato-pathology.',
      telehealthReady: true
    }
  ],

  appointments: [
    {
      id: 'apt-901',
      doctorId: 'doc-1',
      doctorName: 'Dr. Julian Vance, MD',
      doctorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
      specialty: 'Cardiology',
      date: '2026-10-04',
      time: '10:00 AM',
      type: 'Virtual Consultation',
      status: 'Confirmed', // 'Confirmed' | 'Completed' | 'Cancelled'
      videoRoomUrl: 'https://meet.medtrust.org/room/cv-901-vance',
      reminderSent: true,
      notes: 'Follow-up on 24h ECG Holter telemetry report.'
    },
    {
      id: 'apt-902',
      doctorId: 'doc-4',
      doctorName: 'Dr. Amara Thorne, MD',
      doctorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
      specialty: 'Dermatology & Immunology',
      date: '2026-10-12',
      time: '02:30 PM',
      type: 'In-Clinic Checkup',
      status: 'Confirmed',
      videoRoomUrl: null,
      reminderSent: false,
      notes: 'Annual skin mapping & preventative exam.'
    }
  ],

  patientRecords: [
    {
      id: 'rec-1',
      date: '2026-08-14',
      category: 'Diagnostic Lab',
      title: 'Comprehensive Metabolic & Lipid Panel',
      facility: 'LabCorp Diagnostics #402',
      doctor: 'Dr. Julian Vance, MD',
      summary: 'All values within normal baseline. Total cholesterol 172 mg/dL. HDL 58 mg/dL.',
      fileSize: '1.4 MB PDF'
    },
    {
      id: 'rec-2',
      date: '2026-05-20',
      category: 'Prescription Vault',
      title: 'Atorvastatin 10mg / Daily',
      facility: 'CVS Pharmacy Care Central',
      doctor: 'Dr. Julian Vance, MD',
      summary: 'Refills remaining: 3. Take 1 tablet at bedtime with water.',
      fileSize: '840 KB PDF'
    },
    {
      id: 'rec-3',
      date: '2026-02-11',
      category: 'Imaging & Telemetry',
      title: 'Echocardiogram High-Resolution Scan',
      facility: 'St. Jude Radiology Suite B',
      doctor: 'Dr. Sarah Lin, MD, PhD',
      summary: 'Left ventricular ejection fraction 62%. Normal wall kinetics. No regurgitation detected.',
      fileSize: '6.2 MB DICOM/PDF'
    }
  ],

  waitTimesAnalytics: {
    averageWaitMinutes: 8.4,
    patientThroughputToday: 42,
    roomOccupancyRate: '86%',
    satisfactionScore: '4.92 / 5.0',
    scheduleOptimizationScore: '94%',
    alerts: [
      'Room 4B sanitation buffer scheduled for 2:45 PM',
      'Dr. Lin consultation running 3 mins ahead of pace'
    ]
  },

  // Actions
  bookAppointment: (aptData) => set((state) => {
    const isVirtual = aptData.type === 'Virtual Consultation';
    const newApt = {
      id: `apt-${Date.now()}`,
      doctorId: aptData.doctorId,
      doctorName: aptData.doctorName,
      doctorAvatar: aptData.doctorAvatar,
      specialty: aptData.specialty,
      date: aptData.date,
      time: aptData.time,
      type: aptData.type,
      status: 'Confirmed',
      videoRoomUrl: isVirtual ? `https://meet.medtrust.org/room/vc-${Date.now().toString().slice(-6)}` : null,
      reminderSent: true,
      notes: aptData.notes || 'Routine consultation'
    };
    return { appointments: [newApt, ...state.appointments] };
  }),

  cancelAppointment: (aptId) => set((state) => ({
    appointments: state.appointments.map((a) =>
      a.id === aptId ? { ...a, status: 'Cancelled' } : a
    )
  })),

  rescheduleAppointment: (aptId, newDate, newTime) => set((state) => ({
    appointments: state.appointments.map((a) =>
      a.id === aptId ? { ...a, date: newDate, time: newTime, status: 'Confirmed' } : a
    )
  })),

  triggerSmsReminder: (aptId) => set((state) => ({
    appointments: state.appointments.map((a) =>
      a.id === aptId ? { ...a, reminderSent: true } : a
    )
  }))
}));
