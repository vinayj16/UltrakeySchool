import axios from 'axios';

export interface Ticket {
    id: number;
    category: string;
    priority: string;
    ticketNumber: string;
    title: string;
    status: string;
    assignedTo: { name: string; avatar: string };
    updatedAt: string;
    commentCount: number;
}

export interface Category {
    name: string;
    openTickets: number;
    closedTickets: number;
}

export interface Agent {
    name: string;
    avatar: string;
    openTickets: number;
    closedTickets: number;
}

const API_BASE = '/api'; // Adjust base URL as needed

export const fetchTickets = async (): Promise<Ticket[]> => {
    const response = await axios.get<Ticket[]>(`${API_BASE}/support-tickets`);
    return response.data;
};

export const fetchCategories = async (): Promise<Category[]> => {
    const response = await axios.get<Category[]>(`${API_BASE}/support-tickets/categories`);
    return response.data;
};

export const fetchAgents = async (): Promise<Agent[]> => {
    const response = await axios.get<Agent[]>(`${API_BASE}/support-tickets/agents`);
    return response.data;
};

export const createTicket = async (ticket: Omit<Ticket, 'id' | 'ticketNumber' | 'updatedAt' | 'commentCount'>): Promise<Ticket> => {
    const response = await axios.post<Ticket>(`${API_BASE}/support-tickets`, ticket);
    return response.data;
};

export const deleteTicket = async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE}/support-tickets/${id}`);
};

export const updateTicketStatus = async (id: number, status: string): Promise<Ticket> => {
    const response = await axios.patch<Ticket>(`${API_BASE}/support-tickets/${id}/status`, { status });
    return response.data;
};
