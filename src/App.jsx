import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Search,
  ShieldCheck,
  FileText,
  Activity,
  User,
  Users,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  ChevronRight,
  Phone,
  Mail,
  VideoOff,
  Mic,
  MicOff,
  X,
  Plus
} from 'lucide-react';
import { useStore } from './store/useStore';

export default function App() {
  const {
    currentUser,
    activeRole,
    setActiveRole,
    doctors,
    appointments,
    patientRecords,
    waitTimesAnalytics,
    bookAppointment,
    cancelAppointment,
    rescheduleAppointment,
    triggerSmsReminder
  } = useStore();

  const [activeTab, setActiveTab] = useState('find-doctors');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null);
  const [activeVideoModal, setActiveVideoModal] = useState(null);
  const [rescheduleModalApt, setRescheduleModalApt] = useState(null);

  // Booking Form State
  const [bookingDate, setBookingDate] = useState('2026-10-08');
  const [bookingTime, setBookingTime] = useState('11:00 AM');
  const [bookingType, setBookingType] = useState('Virtual Consultation');
  const [bookingNotes, setBookingNotes] = useState('');

  // Video call controls state
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  // Reschedule Form State
  const [newReschedDate, setNewReschedDate] = useState('2026-10-15');
  const [newReschedTime, setNewReschedTime] = useState('03:30 PM');

  const specialties = ['All', 'Cardiology', 'Neurology', 'Orthopedics & Sports Med', 'Dermatology & Immunology'];

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.hospital.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpec = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
    return matchesSearch && matchesSpec;
  });

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (!selectedDoctorForBooking) return;
    bookAppointment({
      doctorId: selectedDoctorForBooking.id,
      doctorName: selectedDoctorForBooking.name,
      doctorAvatar: selectedDoctorForBooking.avatar,
      specialty: selectedDoctorForBooking.specialty,
      date: bookingDate,
      time: bookingTime,
      type: bookingType,
      notes: bookingNotes
    });
    setSelectedDoctorForBooking(null);
    setActiveTab('my-appointments');
  };

  const handleConfirmReschedule = (e) => {
    e.preventDefault();
    if (!rescheduleModalApt) return;
    rescheduleAppointment(rescheduleModalApt.id, newReschedDate, newReschedTime);
    setRescheduleModalApt(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between">
      {/* Top Clinical Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-teal-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-600/20">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-teal-900 block leading-none">
                AURA CLINICAL
              </span>
              <span className="text-[10px] uppercase tracking-wider text-teal-600 font-semibold">
                Healthcare Network & Telehealth
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-600">
            <button
              onClick={() => setActiveTab('find-doctors')}
              className={`px-4 py-2 rounded-xl transition ${activeTab === 'find-doctors' ? 'bg-white text-teal-800 shadow-sm font-bold' : 'hover:text-slate-900'}`}
            >
              Find Doctors
            </button>
            <button
              onClick={() => setActiveTab('my-appointments')}
              className={`px-4 py-2 rounded-xl transition ${activeTab === 'my-appointments' ? 'bg-white text-teal-800 shadow-sm font-bold' : 'hover:text-slate-900'}`}
            >
              Appointments ({appointments.filter(a => a.status === 'Confirmed').length})
            </button>
            <button
              onClick={() => setActiveTab('vault')}
              className={`px-4 py-2 rounded-xl transition ${activeTab === 'vault' ? 'bg-white text-teal-800 shadow-sm font-bold' : 'hover:text-slate-900'}`}
            >
              Patient Vault
            </button>
            <button
              onClick={() => setActiveTab('schedule-optimizer')}
              className={`px-4 py-2 rounded-xl transition ${activeTab === 'schedule-optimizer' ? 'bg-white text-teal-800 shadow-sm font-bold' : 'hover:text-slate-900'}`}
            >
              Doctor Schedule
            </button>
            <button
              onClick={() => setActiveTab('admin-analytics')}
              className={`px-4 py-2 rounded-xl transition ${activeTab === 'admin-analytics' ? 'bg-white text-teal-800 shadow-sm font-bold' : 'hover:text-slate-900'}`}
            >
              Clinic Analytics
            </button>
          </div>

          {/* Patient Quick Profile */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-slate-900 block leading-tight">{currentUser.name}</span>
              <span className="text-[10px] text-teal-600 font-medium">Policy: {currentUser.policyNumber}</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-teal-100 border border-teal-300 flex items-center justify-center font-bold text-teal-800 text-xs">
              ES
            </div>
          </div>
        </div>
      </header>

      {/* Main App Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-8 w-full flex-1">
        {/* VIEW 1: FIND DOCTORS & DIRECT BOOKING */}
        {activeTab === 'find-doctors' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-teal-700 to-teal-900 rounded-3xl p-8 text-white shadow-lg shadow-teal-900/10">
              <div className="max-w-2xl space-y-3">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-teal-600/50 text-teal-100 text-xs font-semibold backdrop-blur">
                  <ShieldCheck className="w-3.5 h-3.5" /> HIPAA-Compliant & Board-Certified Specialists
                </span>
                <h1 className="text-3xl font-extrabold tracking-tight">
                  Seamless Clinical Care & Telehealth Consultations
                </h1>
                <p className="text-teal-100 text-sm leading-relaxed">
                  Book same-day virtual visits or clinic appointments with premier physicians across Cardiology, Neurology, and Sports Medicine.
                </p>
              </div>

              {/* Search & Filters */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/20">
                <div className="md:col-span-2 relative">
                  <Search className="w-4 h-4 text-teal-200 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="Search doctor name, specialty, or clinic facility..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/90 text-slate-900 pl-10 pr-4 py-2.5 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                </div>
                <div>
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="w-full bg-white/90 text-slate-900 px-3 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-400"
                  >
                    {specialties.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Doctors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredDoctors.map((doc) => (
                <div key={doc.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <img src={doc.avatar} alt={doc.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-100" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-bold text-slate-900">{doc.name}</h3>
                          <span className="text-xs font-extrabold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                            ★ {doc.rating} ({doc.reviewsCount})
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-teal-600">{doc.specialty}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" /> {doc.hospital} • {doc.experience}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      {doc.bio}
                    </p>

                    <div>
                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
                        Earliest Availability:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {doc.availability.map((slot, i) => (
                          <span key={i} className="text-xs bg-teal-50 text-teal-800 font-medium px-2.5 py-1 rounded-lg border border-teal-200/60 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-teal-600" /> {slot}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Consultation Fee</span>
                      <div className="text-lg font-black text-slate-900">{doc.fee}</div>
                    </div>

                    <button
                      onClick={() => setSelectedDoctorForBooking(doc)}
                      className="px-5 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition flex items-center gap-1.5"
                    >
                      Book Visit <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 2: APPOINTMENTS & TELEHEALTH */}
        {activeTab === 'my-appointments' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Scheduled Consultations</h2>
                <p className="text-xs text-slate-500">Live booking status, virtual video call room links & reschedule controls</p>
              </div>
              <button
                onClick={() => setActiveTab('find-doctors')}
                className="px-4 py-2 bg-teal-600 text-white rounded-2xl text-xs font-bold shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> New Appointment
              </button>
            </div>

            <div className="space-y-4">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className={`bg-white rounded-3xl p-6 border transition shadow-sm ${apt.status === 'Cancelled' ? 'opacity-60 border-rose-200' : 'border-slate-200'}`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <img src={apt.doctorAvatar} alt={apt.doctorName} className="w-14 h-14 rounded-2xl object-cover border border-teal-100" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900">{apt.doctorName}</h3>
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                            apt.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                            apt.status === 'Cancelled' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {apt.status}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-teal-600">{apt.specialty} • {apt.type}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs font-medium text-slate-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-teal-600" /> {apt.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-teal-600" /> {apt.time}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      {apt.status === 'Confirmed' && apt.videoRoomUrl && (
                        <button
                          onClick={() => setActiveVideoModal(apt)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition"
                        >
                          <Video className="w-3.5 h-3.5" /> Join Telehealth Room
                        </button>
                      )}

                      {apt.status === 'Confirmed' && (
                        <>
                          <button
                            onClick={() => setRescheduleModalApt(apt)}
                            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                          >
                            Reschedule
                          </button>
                          <button
                            onClick={() => cancelAppointment(apt.id)}
                            className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold transition"
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => triggerSmsReminder(apt.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 ${apt.reminderSent ? 'text-teal-700 bg-teal-50' : 'text-slate-500 hover:text-slate-800'}`}
                      >
                        <Phone className="w-3 h-3" />
                        {apt.reminderSent ? 'SMS Active' : 'Enable SMS'}
                      </button>
                    </div>
                  </div>

                  {apt.notes && (
                    <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 bg-slate-50/50 p-2.5 rounded-xl">
                      <strong className="text-slate-700">Clinical Focus:</strong> {apt.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: PATIENT RECORD VAULT */}
        {activeTab === 'vault' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                  Encrypted Health Records Vault
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-2">Eleanor Sterling's Medical Portfolio</h2>
                <p className="text-xs text-slate-500 mt-0.5">Blood Group: O+ • Known Allergies: Penicillin, Dust Mites</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl text-xs space-y-1">
                <div className="font-bold text-slate-800">Primary Insurer:</div>
                <div className="text-slate-600">{currentUser.insuranceProvider}</div>
                <div className="text-teal-700 font-mono text-[11px]">ID: {currentUser.policyNumber}</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Historical Diagnostic & Lab Vault</h3>
              {patientRecords.map((rec) => (
                <div key={rec.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:border-teal-300 transition flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-teal-700 uppercase">{rec.category} • {rec.date}</span>
                      <h4 className="font-bold text-slate-900 text-sm mt-0.5">{rec.title}</h4>
                      <p className="text-xs text-slate-600 mt-1">{rec.summary}</p>
                      <span className="text-[11px] text-slate-400 font-medium mt-1 block">Physician: {rec.doctor} • {rec.facility}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => alert(`Simulated downloading encrypted record: ${rec.title} (${rec.fileSize})`)}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1 flex-shrink-0"
                  >
                    Download {rec.fileSize}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 4: DOCTOR SCHEDULE OPTIMIZER */}
        {activeTab === 'schedule-optimizer' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">Dr. Julian Vance // Daily Schedule Optimizer</h2>
              <p className="text-xs text-slate-500 mt-0.5">Automated AI slot buffering, gap compression & tele-consult orchestration</p>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-100">
                  <span className="text-[10px] uppercase font-bold text-teal-800">Schedule Efficiency</span>
                  <div className="text-2xl font-black text-teal-900 mt-1">94.8%</div>
                  <span className="text-[10px] text-teal-600">Optimal 15-min diagnostic buffers</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-600">Total Consultations</span>
                  <div className="text-2xl font-black text-slate-900 mt-1">12 Booked</div>
                  <span className="text-[10px] text-slate-500">7 Virtual • 5 In-Person</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-600">Buffer Compliance</span>
                  <div className="text-2xl font-black text-emerald-600 mt-1">100%</div>
                  <span className="text-[10px] text-slate-500">Zero overlap collisions</span>
                </div>
              </div>

              {/* Timeline */}
              <div className="mt-8 space-y-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Live Time Slot Allocation</h3>
                <div className="border-l-2 border-teal-500 pl-4 space-y-4">
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex justify-between items-center">
                    <div>
                      <span className="text-xs font-extrabold text-teal-700">09:00 AM - 09:45 AM</span>
                      <h5 className="font-bold text-xs text-slate-900 mt-0.5">Patient: Marcus Kane (In-Clinic Cardiology Review)</h5>
                      <span className="text-[10px] text-slate-500">Status: Completed • Blood pressure baseline updated</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">Done</span>
                  </div>

                  <div className="bg-teal-50 p-3.5 rounded-2xl border border-teal-200 flex justify-between items-center">
                    <div>
                      <span className="text-xs font-extrabold text-teal-700">10:00 AM - 10:30 AM</span>
                      <h5 className="font-bold text-xs text-slate-900 mt-0.5">Patient: Eleanor Sterling (Virtual Telehealth)</h5>
                      <span className="text-[10px] text-teal-600 font-semibold">Status: Up Next • Telehealth room armed</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-teal-600 text-white text-[10px] font-bold animate-pulse">Live</span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex justify-between items-center">
                    <div>
                      <span className="text-xs font-extrabold text-slate-600">10:30 AM - 10:45 AM</span>
                      <h5 className="font-bold text-xs text-slate-700 mt-0.5">Automated Sanitation & Record Charting Buffer</h5>
                      <span className="text-[10px] text-slate-500">Optimizer allocated buffer to prevent clinic delays</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">Buffer</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: CLINIC ADMIN & WAIT-TIME ANALYTICS */}
        {activeTab === 'admin-analytics' && (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">Clinic Administration & Wait-Time Intelligence</h2>
              <p className="text-xs text-slate-500 mt-0.5">Real-time throughput metrics, room utilization & patient wait-time distribution</p>

              <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-teal-50/80 rounded-2xl border border-teal-100">
                  <span className="text-[10px] uppercase font-bold text-teal-800">Avg Patient Wait</span>
                  <div className="text-2xl font-black text-teal-900 mt-1">{waitTimesAnalytics.averageWaitMinutes} min</div>
                  <span className="text-[10px] text-teal-600">Target &lt; 10.0 min</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-600">Daily Throughput</span>
                  <div className="text-2xl font-black text-slate-900 mt-1">{waitTimesAnalytics.patientThroughputToday}</div>
                  <span className="text-[10px] text-slate-500">Patients serviced</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-600">Room Occupancy</span>
                  <div className="text-2xl font-black text-slate-900 mt-1">{waitTimesAnalytics.roomOccupancyRate}</div>
                  <span className="text-[10px] text-slate-500">14 Active suites</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-600">Patient Trust Score</span>
                  <div className="text-2xl font-black text-emerald-600 mt-1">{waitTimesAnalytics.satisfactionScore}</div>
                  <span className="text-[10px] text-slate-500">Post-visit reviews</span>
                </div>
              </div>

              {/* Real-time Alerts */}
              <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-teal-600" /> Operational Signals & Queue Telemetry
                </h4>
                {waitTimesAnalytics.alerts.map((alert, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                    <span>{alert}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: BOOK APPOINTMENT */}
      {selectedDoctorForBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Schedule Medical Consultation</h3>
                <p className="text-xs text-teal-700 font-semibold">{selectedDoctorForBooking.name} • {selectedDoctorForBooking.specialty}</p>
              </div>
              <button onClick={() => setSelectedDoctorForBooking(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Time Slot</label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="02:30 PM">02:30 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Encounter Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBookingType('Virtual Consultation')}
                    className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 transition ${bookingType === 'Virtual Consultation' ? 'bg-teal-50 border-teal-600 text-teal-800' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
                  >
                    <Video className="w-4 h-4 text-teal-600" />
                    <span>Virtual Telehealth</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingType('In-Clinic Checkup')}
                    className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 transition ${bookingType === 'In-Clinic Checkup' ? 'bg-teal-50 border-teal-600 text-teal-800' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
                  >
                    <MapPin className="w-4 h-4 text-teal-600" />
                    <span>In-Clinic Visit</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Symptoms or Reason for Consultation</label>
                <textarea
                  rows={2}
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  placeholder="E.g., Routine cardiac follow-up, sudden fatigue or headache..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDoctorForBooking(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RESCHEDULE */}
      {rescheduleModalApt && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Reschedule Consultation</h3>
              <button onClick={() => setRescheduleModalApt(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleConfirmReschedule} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">New Date</label>
                <input
                  type="date"
                  value={newReschedDate}
                  onChange={(e) => setNewReschedDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">New Time Slot</label>
                <select
                  value={newReschedTime}
                  onChange={(e) => setNewReschedTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-teal-500"
                >
                  <option value="09:30 AM">09:30 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="03:30 PM">03:30 PM</option>
                </select>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRescheduleModalApt(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs"
                >
                  Save New Time
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LIVE TELEHEALTH VIDEO ROOM */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-3xl w-full border border-slate-800 overflow-hidden shadow-2xl flex flex-col">
            {/* Video Header */}
            <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-bold text-white">
                  Encrypted Telehealth Room // {activeVideoModal.doctorName}
                </span>
                <span className="text-[10px] text-teal-400 font-mono bg-teal-950/80 px-2 py-0.5 rounded-full border border-teal-800">
                  256-Bit TLS End-to-End
                </span>
              </div>
              <button onClick={() => setActiveVideoModal(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Stream Stage */}
            <div className="relative aspect-video bg-slate-950 flex items-center justify-center p-4">
              {camOn ? (
                <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center bg-slate-900">
                  <img
                    src={activeVideoModal.doctorAvatar}
                    alt={activeVideoModal.doctorName}
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded-xl text-xs font-bold text-white">
                    {activeVideoModal.doctorName} (Physician Live)
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-500">
                  <VideoOff className="w-12 h-12" />
                  <span className="text-xs font-semibold">Physician Video Muted</span>
                </div>
              )}

              {/* Self Video PIP */}
              <div className="absolute top-8 right-8 w-32 h-24 rounded-2xl overflow-hidden border-2 border-teal-500 shadow-xl bg-slate-800 flex items-center justify-center">
                <span className="text-[10px] font-bold text-teal-300">You (Patient)</span>
              </div>
            </div>

            {/* Video Controls Bar */}
            <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMicOn(!micOn)}
                  className={`p-3 rounded-full transition ${micOn ? 'bg-slate-800 text-white' : 'bg-rose-600 text-white'}`}
                >
                  {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setCamOn(!camOn)}
                  className={`p-3 rounded-full transition ${camOn ? 'bg-slate-800 text-white' : 'bg-rose-600 text-white'}`}
                >
                  {camOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </button>
              </div>

              <button
                onClick={() => setActiveVideoModal(null)}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-bold uppercase tracking-wider"
              >
                End Consultation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clinical Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-400">
        © 2026 AURA CLINICAL NETWORK. SUPABASE / POSTGRESQL RELATIONAL HEALTH RECORDS.
      </footer>
    </div>
  );
}
