// Dummy data for the dashboard

export interface Call {
    id: string;
    patientName: string;
    phoneNumber: string;
    callTime: Date;
    duration: number; // in seconds
    status: "completed" | "missed" | "ongoing";
    recordingUrl?: string;
}

export interface Patient {
    id: string;
    name: string;
    age: number;
    phoneNumber: string;
    symptoms: string[];
    isEmergency: boolean;
    lastCallDate?: Date;
    conversationTranscript?: string;
}

export interface Appointment {
    id: string;
    patientName: string;
    patientId: string;
    appointmentTime: Date;
    status: "pending" | "confirmed" | "cancelled";
    reason: string;
    doctorName: string;
}

export const callsData: Call[] = [
    {
        id: "1",
        patientName: "John Anderson",
        phoneNumber: "+1-555-0101",
        callTime: new Date(Date.now() - 3600000),
        duration: 420,
        status: "completed",
        recordingUrl: "#",
    },
    {
        id: "2",
        patientName: "Sarah Mitchell",
        phoneNumber: "+1-555-0102",
        callTime: new Date(Date.now() - 7200000),
        duration: 180,
        status: "completed",
        recordingUrl: "#",
    },
    {
        id: "3",
        patientName: "Michael Chen",
        phoneNumber: "+1-555-0103",
        callTime: new Date(Date.now() - 10800000),
        duration: 0,
        status: "missed",
    },
    {
        id: "4",
        patientName: "Emily Rodriguez",
        phoneNumber: "+1-555-0104",
        callTime: new Date(Date.now() - 1800000),
        duration: 540,
        status: "completed",
        recordingUrl: "#",
    },
    {
        id: "5",
        patientName: "Robert Thompson",
        phoneNumber: "+1-555-0105",
        callTime: new Date(Date.now() - 14400000),
        duration: 300,
        status: "completed",
        recordingUrl: "#",
    },
];

export const patientsData: Patient[] = [
    {
        id: "1",
        name: "John Anderson",
        age: 45,
        phoneNumber: "+1-555-0101",
        symptoms: ["Fever", "Headache", "Cough"],
        isEmergency: false,
        lastCallDate: new Date(Date.now() - 3600000),
        conversationTranscript:
            "AI: Good morning, how can I help you today?\nPatient: I have been having a fever and cough for the past 3 days.\nAI: I understand. Do you have any other symptoms?\nPatient: Yes, I have a headache as well.\nAI: Thank you for that information. Let me schedule an appointment for you.",
    },
    {
        id: "2",
        name: "Sarah Mitchell",
        age: 32,
        phoneNumber: "+1-555-0102",
        symptoms: ["Stomach pain", "Nausea"],
        isEmergency: true,
        lastCallDate: new Date(Date.now() - 7200000),
        conversationTranscript:
            "AI: Good afternoon, what seems to be the problem?\nPatient: I have severe stomach pain and nausea.\nAI: This sounds urgent. Are you able to come to the hospital now?\nPatient: Yes, I can.\nAI: Emergency appointment has been created. Please head to the ER immediately.",
    },
];

export const appointmentsData: Appointment[] = [
    {
        id: "1",
        patientName: "John Anderson",
        patientId: "1",
        appointmentTime: new Date(Date.now() + 86400000),
        status: "confirmed",
        reason: "Follow-up",
        doctorName: "Dr. Lisa Park",
    },
    {
        id: "2",
        patientName: "Sarah Mitchell",
        patientId: "2",
        appointmentTime: new Date(Date.now() + 3600000),
        status: "pending",
        reason: "Emergency",
        doctorName: "Dr. James Wilson",
    },
    {
        id: "3",
        patientName: "Michael Chen",
        patientId: "3",
        appointmentTime: new Date(Date.now() + 172800000),
        status: "confirmed",
        reason: "Routine Checkup",
        doctorName: "Dr. Sarah Ahmed",
    },
    {
        id: "4",
        patientName: "Emily Rodriguez",
        patientId: "4",
        appointmentTime: new Date(Date.now() - 3600000),
        status: "cancelled",
        reason: "Check-up",
        doctorName: "Dr. Robert Kim",
    },
];

export const statsData = {
    totalCallsToday: 47,
    activeCalls: 3,
    missedCalls: 5,
    appointmentsBooked: 12,
};

export const callChartData = [
    { time: "00:00", calls: 2 },
    { time: "04:00", calls: 1 },
    { time: "08:00", calls: 5 },
    { time: "12:00", calls: 8 },
    { time: "16:00", calls: 12 },
    { time: "20:00", calls: 6 },
];

export const appointmentChartData = [
    { date: "Mon", appointments: 12 },
    { date: "Tue", appointments: 19 },
    { date: "Wed", appointments: 15 },
    { date: "Thu", appointments: 22 },
    { date: "Fri", appointments: 18 },
    { date: "Sat", appointments: 8 },
    { date: "Sun", appointments: 4 },
];
