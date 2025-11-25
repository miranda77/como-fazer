import { LucideIcon } from 'lucide-react';

export enum CategoryType {
  KITCHEN = 'Cozinha',
  HOME = 'Casa e Organização',
  TECH = 'Tecnologia',
  DIY = 'DIY e Artesanato', // Removed slash to fix routing issues
  FINANCE = 'Finanças Pessoais',
  SELF_CARE = 'Cuidados Pessoais',
  TOOLS = 'Ferramentas e Truques',
  GARDENING = 'Jardinagem' // New Category
}

export interface Step {
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ReferenceLink {
  title: string;
  url: string;
}

export interface Article {
  id: string;
  title: string;
  category: CategoryType | string;
  imageUrl?: string;
  estimatedTime: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  introduction: string;
  context: string;
  materials?: string[];
  steps: Step[];
  tips: string[];
  commonErrors: string[];
  faq: FaqItem[];
  references: ReferenceLink[];
  conclusion: string;
  createdAt: string;
  isGenerated?: boolean;
}

export interface NavItem {
  label: string;
  path: string;
  icon?: LucideIcon;
}