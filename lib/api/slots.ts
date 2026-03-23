import client from "./client";

export interface Slot {
    id: string;
    _id?: string;
    doctorId: string;
    date: string;
    startTime: string;
    endTime: string;
    slotDuration: number;
    location?: string;
    fee: number;
    isBooked?: boolean;
    isBlocked?: boolean;
    blockReason?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateSlotPayload {
    date: string;
    startTime: string;
    endTime: string;
    slotDuration: number;
    location?: string;
    fee: number;
}

export interface BulkUpdatePayload {
    slotIds: string[];
    fee?: number;
    location?: string;
}

export interface BulkDeletePayload {
    slotIds: string[];
}

export interface BlockSlotPayload {
    reason: string;
}

export interface SlotsResponse {
    data: Slot[];
    pagination?: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

/** Raw slot object from backend (using MongoDB _id) */
interface RawSlot {
    _id?: string;
    id?: string;
    doctorId: string;
    date: string;
    startTime: string;
    endTime: string;
    slotDuration: number;
    location?: string;
    fee: number;
    isBooked?: boolean;
    isBlocked?: boolean;
    blockReason?: string;
    createdAt?: string;
    updatedAt?: string;
}

// Transform raw slot from API to frontend format
function transformSlot(rawSlot: RawSlot): Slot {
    return {
        ...rawSlot,
        id: rawSlot.id || rawSlot._id || "",
    };
}

/**
 * Admin: Create slots for a doctor
 * POST /slots/doctor/{doctorId}/add
 */
export async function createDoctorSlots(
    doctorId: string,
    payload: CreateSlotPayload
): Promise<Slot[]> {
    const response = await client.post<any>(
        `/slots/doctor/${doctorId}/add`,
        payload
    );
    const data = response.data.data || response.data;
    const slotsArray = Array.isArray(data) ? data : [];
    return slotsArray.map(transformSlot);
}

/**
 * Admin: View all doctor's slots
 * GET /slots/admin/doctor/{doctorId}?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 */
export async function getDoctorSlots(
    doctorId: string,
    startDate?: string,
    endDate?: string
): Promise<SlotsResponse> {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await client.get<any>(
        `/slots/admin/doctor/${doctorId}`,
        { params }
    );
    const data = response.data.data || response.data;

    const slotsArray = Array.isArray(data) ? data : data?.slots || [];
    return {
        data: slotsArray.map(transformSlot),
        pagination: data?.pagination,
    };
}

/**
 * Admin: Bulk update slots (fee, location, etc.)
 * PUT /slots/admin/bulk-update
 */
export async function bulkUpdateSlots(
    payload: BulkUpdatePayload
): Promise<SlotsResponse> {
    const response = await client.put<any>("/slots/admin/bulk-update", payload);
    const data = response.data.data || response.data;

    const slotsArray = Array.isArray(data) ? data : data?.slots || [];
    return {
        data: slotsArray.map(transformSlot),
    };
}

/**
 * Admin: Block a slot (e.g., for lunch break)
 * PUT /slots/{slotId}/block
 */
export async function blockSlot(
    slotId: string,
    reason: string
): Promise<Slot> {
    const response = await client.put<any>(`/slots/${slotId}/block`, {
        reason,
    });
    const data = response.data.data || response.data;
    return transformSlot(data);
}

/**
 * Admin: Unblock a slot
 * PUT /slots/{slotId}/unblock
 */
export async function unblockSlot(slotId: string): Promise<Slot> {
    const response = await client.put<any>(`/slots/${slotId}/unblock`);
    const data = response.data.data || response.data;
    return transformSlot(data);
}

/**
 * Admin: Bulk delete slots
 * DELETE /slots/admin/bulk-delete
 */
export async function bulkDeleteSlots(
    payload: BulkDeletePayload
): Promise<{ success: boolean; message: string }> {
    const response = await client.delete<any>("/slots/admin/bulk-delete", {
        data: payload,
    });
    return response.data;
}

/**
 * Admin: Delete a single slot
 * DELETE /slots/{slotId}
 */
export async function deleteSlot(slotId: string): Promise<{ success: boolean; message: string }> {
    const response = await client.delete<any>(`/slots/${slotId}`);
    return response.data;
}
