import client from "./client";

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone?: string;
    location?: string;
    profileImage?: string;
    bio?: string;
    role: "admin" | "doctor" | "patient";
    createdAt: string;
    updatedAt: string;
}

export interface UpdateProfilePayload {
    name?: string;
    phone?: string;
    location?: string;
    bio?: string;
    profileImage?: string;
}

// Get current user profile
export async function getUserProfile(): Promise<UserProfile> {
    try {
        const response = await client.get("/profile");
        return response.data.data?.user || response.data.data;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
}

// Update user profile
export async function updateUserProfile(
    payload: UpdateProfilePayload
): Promise<UserProfile> {
    try {
        const response = await client.put("/profile", payload);
        return response.data.data?.user || response.data.data;
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
    }
}

// Upload profile picture
export async function uploadProfilePicture(file: File): Promise<string> {
    try {
        const formData = new FormData();
        formData.append("profileImage", file);

        const response = await client.post("/profile/upload-image", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data.data?.url || response.data.data;
    } catch (error) {
        console.error("Error uploading profile picture:", error);
        throw error;
    }
}

// Change password
export async function changePassword(
    currentPassword: string,
    newPassword: string
): Promise<void> {
    try {
        await client.post("/profile/change-password", {
            currentPassword,
            newPassword,
        });
    } catch (error) {
        console.error("Error changing password:", error);
        throw error;
    }
}
