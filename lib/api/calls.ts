import client from "./client";

export interface Call {
    id: string;
    patientName: string;
    phoneNumber: string;
    callTime: string;
    duration: number;
    status: "completed" | "missed" | "ongoing";
    recordingUrl?: string;
    transcript?: string;
}

export interface CallsResponse {
    calls: Call[];
    total: number;
    completed: number;
    missed: number;
    ongoing: number;
}

interface RawCall {
    _id?: string;
    id?: string;
    patientId?: string | null;
    patientName?: string;
    phoneNumber?: string;
    duration?: number;
    status?: string;
    createdAt?: string;
    recordingUrl?: string;
    transcript?: string;
}

export interface WebCallSession {
    callId: string;
    sessionId: string;
    assistantId?: string;
    agentName?: string;
}

export interface WebCallStatus {
    status: string;
    appointmentBooked: boolean;
    appointmentId?: string;
    symptoms?: string;
    collectedData?: Record<string, unknown>;
}

export interface CallDetails {
    callId: string;
    phoneNumber: string;
    status: string;
    duration?: number;
    appointmentBooked: boolean;
    appointmentId?: string;
    symptoms?: string;
    diagnosis?: string;
    isEmergency: boolean;
    createdAt: string;
    updatedAt?: string;
}

interface ApiEnvelope<T> {
    data?: T;
}

type MaybeWrapped<T> = T | ApiEnvelope<T>;

export interface AIBookingPayload {
    patientId: string;
    isEmergency: boolean;
    symptoms?: string;
    phone?: string;
}

export interface AICallResponse {
    callId: string;
    phoneNumber: string;
    estimatedDuration?: number;
    message: string;
}

export interface ManualCallPayload {
    patientId: string;
    agentPhoneNumber: string;
    hospitalName?: string;
    agentName?: string;
}

export interface ManualCallResponse {
    appointmentId?: string;
    message: string;
    success: boolean;
}

function unwrapResponse<T>(payload: MaybeWrapped<T>): T {
    if (
        payload &&
        typeof payload === "object" &&
        "data" in payload &&
        payload.data !== undefined
    ) {
        return payload.data;
    }

    return payload as T;
}

function normalizeCallStatus(status?: string): Call["status"] {
    if (status === "missed" || status === "ongoing" || status === "completed") {
        return status;
    }

    if (status === "ended" || status === "booked" || status === "confirmed") {
        return "completed";
    }

    return "completed";
}

function transformCall(rawCall: RawCall): Call {
    return {
        id: rawCall.id || rawCall._id || "",
        patientName: rawCall.patientName || rawCall.phoneNumber || "Unknown",
        phoneNumber: rawCall.phoneNumber || "N/A",
        callTime: rawCall.createdAt || new Date().toISOString(),
        duration: rawCall.duration || 0,
        status: normalizeCallStatus(rawCall.status),
        recordingUrl: rawCall.recordingUrl,
        transcript: rawCall.transcript,
    };
}

export async function getCalls(): Promise<CallsResponse> {
    const response = await client.get<MaybeWrapped<RawCall[] | { calls?: RawCall[] }>>("/calls");
    const data = unwrapResponse(response.data);
    const calls = (Array.isArray(data) ? data : data.calls || []).map(transformCall);

    return {
        calls,
        total: calls.length,
        completed: calls.filter((call: Call) => call.status === "completed").length,
        missed: calls.filter((call: Call) => call.status === "missed").length,
        ongoing: calls.filter((call: Call) => call.status === "ongoing").length,
    };
}

export async function getCallById(id: string): Promise<Call> {
    const response = await client.get<MaybeWrapped<RawCall>>(`/calls/${id}`);
    const data = unwrapResponse(response.data);
    return transformCall(data);
}

export async function getCallStats(): Promise<{
    total: number;
    completed: number;
    missed: number;
    ongoing: number;
}> {
    const response = await client.get<
        MaybeWrapped<{
            total: number;
            completed: number;
            missed: number;
            ongoing: number;
        }>
    >("/calls/stats");
    return unwrapResponse(response.data);
}

export async function initiateAICall(payload: AIBookingPayload): Promise<AICallResponse> {
    const response = await client.post<
        MaybeWrapped<{
            callId?: string;
            _id?: string;
            phoneNumber?: string;
            estimatedDuration?: number;
            message?: string;
        }>
    >("/calls/ai-booking/initiate", payload);
    const data = unwrapResponse(response.data);

    return {
        callId: data.callId || data._id || "",
        phoneNumber: data.phoneNumber || "",
        estimatedDuration: data.estimatedDuration,
        message: data.message || "AI agent is calling you",
    };
}

export async function initiateWebCall(patientId: string): Promise<WebCallSession> {
    const response = await client.post<
        MaybeWrapped<{
            callId?: string;
            _id?: string;
            sessionToken?: string;
            sessionId?: string;
            assistantId?: string;
            agentName?: string;
        }>
    >("/calls/web-call/initiate", { patientId });
    const data = unwrapResponse(response.data);

    return {
        callId: data.callId || data._id || "",
        sessionId: data.sessionToken || data.sessionId || "",
        assistantId: data.assistantId,
        agentName: data.agentName,
    };
}

export async function endWebCall(sessionId: string): Promise<void> {
    await client.post("/calls/web-call/end", { sessionId });
}

export async function getWebCallStatus(sessionId: string): Promise<WebCallStatus> {
    const response = await client.get<MaybeWrapped<WebCallStatus>>(
        `/calls/web-call/${sessionId}/status`
    );
    const data = unwrapResponse(response.data);

    return {
        status: data.status,
        appointmentBooked: Boolean(data.appointmentBooked),
        appointmentId: data.appointmentId,
        symptoms: data.symptoms,
        collectedData: data.collectedData,
    };
}

export async function getCallDetails(callId: string): Promise<CallDetails> {
    const response = await client.get<MaybeWrapped<CallDetails & { _id?: string }>>(
        `/calls/${callId}/details`
    );
    const data = unwrapResponse(response.data);

    return {
        callId: data._id || data.callId,
        phoneNumber: data.phoneNumber,
        status: data.status,
        duration: data.duration,
        appointmentBooked: Boolean(data.appointmentBooked),
        appointmentId: data.appointmentId,
        symptoms: data.symptoms,
        diagnosis: data.diagnosis,
        isEmergency: Boolean(data.isEmergency),
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
    };
}

export async function pollForAppointmentStatus(
    callId: string,
    maxRetries: number = 30,
    retryInterval: number = 2000
): Promise<{ booked: boolean; appointmentId?: string }> {
    let retries = 0;

    while (retries < maxRetries) {
        try {
            const callDetails = await getCallDetails(callId);

            if (callDetails.appointmentBooked && callDetails.appointmentId) {
                return {
                    booked: true,
                    appointmentId: callDetails.appointmentId,
                };
            }

            if (callDetails.status === "completed") {
                return { booked: false };
            }
        } catch (error) {
            console.error("Error polling for appointment status:", error);
        }

        retries += 1;
        await new Promise((resolve) => setTimeout(resolve, retryInterval));
    }

    return { booked: false };
}

// export async function recordManualCall(
//     payload: ManualCallPayload
// ): Promise<ManualCallResponse> {
//     const response = await client.post<MaybeWrapped<ManualCallResponse>>(
//         "/calls/manual-call/record",
//         payload
//     );
//     const data = unwrapResponse(response.data);

//     return {
//         appointmentId: data.appointmentId,
//         message: data.message || "Call recorded successfully",
//         success: Boolean(data.success),
//     };
// }
