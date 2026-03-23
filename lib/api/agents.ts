import client from "./client";

export interface Agent {
    id: string;
    name: string;
    mobileNumber: string;
    email?: string;
    status?: "online" | "offline" | "busy";
    department?: string;
    specialization?: string;
}

export interface AgentResponse {
    agent: Agent;
}

// Get agent details (for patient to call)
export async function getAgentDetails(): Promise<Agent> {
    try {
        const response = await client.get("/agents/current");
        return response.data.data?.agent || response.data.data;
    } catch (error) {
        console.error("Error fetching agent details:", error);
        throw error;
    }
}

// Get all agents (for admin)
export async function getAllAgents(): Promise<Agent[]> {
    try {
        const response = await client.get("/agents");
        return response.data.data?.agents || [];
    } catch (error) {
        console.error("Error fetching agents:", error);
        throw error;
    }
}

// Get agent by ID
export async function getAgentById(agentId: string): Promise<Agent> {
    try {
        const response = await client.get(`/agents/${agentId}`);
        return response.data.data?.agent || response.data.data;
    } catch (error) {
        console.error("Error fetching agent:", error);
        throw error;
    }
}

// Update agent mobile number (admin only)
export async function updateAgentMobileNumber(
    agentId: string,
    mobileNumber: string
): Promise<Agent> {
    try {
        const response = await client.put(`/agents/${agentId}`, {
            mobileNumber,
        });
        return response.data.data?.agent || response.data.data;
    } catch (error) {
        console.error("Error updating agent:", error);
        throw error;
    }
}
