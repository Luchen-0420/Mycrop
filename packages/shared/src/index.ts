// Shared TypeScript types for Me Corp
export interface User {
    id: number
    name: string
    level: number
    xp: number
    credits: number
}

export interface Transaction {
    id: number
    type: 'income' | 'expense'
    amount: number
    description: string
    category: string
    date: string
}

export interface PointsLog {
    id: number
    source: 'habit' | 'budget_reward' | 'exchange'
    amount: number
    description: string
    date: string
}

export interface InventoryItem {
    id: number
    name: string
    category: string
    location: string
    quantity: string
    expiryDate: string | null
    status: 'ok' | 'low' | 'expiring'
}

export interface Contact {
    id: number
    name: string
    relation: string
    phone: string
    birthday: string
    lastContactDate: string
    contactFrequency: string
    notes: string
}

export interface Skill {
    id: number
    name: string
    level: string
    xp: number
    maxXp: number
}

export interface BodyMetric {
    id: number
    date: string
    weight: number
    bodyFat?: number
    waist?: number
}
