import { Soup, Circle, Disc, Package } from 'lucide-react-native';

export type ContainerKey = 'to' | 'chen' | 'dia' | 'hop';

export interface ContainerConfig {
  key: ContainerKey;
  label: string;
  icon: any;
  defaultSize: number;    // diameter (circle) or width (rect)
  defaultHeight?: number; // height only for rect
  shape: 'circle' | 'rect';
}

export const CONTAINERS: ContainerConfig[] = [
  { key: 'to',   label: 'Tô',   icon: Soup,    defaultSize: 20,                shape: 'circle' },
  { key: 'chen', label: 'Chén', icon: Circle,  defaultSize: 12,                shape: 'circle' },
  { key: 'dia',  label: 'Dĩa',  icon: Disc,    defaultSize: 25,                shape: 'circle' },
  { key: 'hop',  label: 'Hộp',  icon: Package, defaultSize: 20, defaultHeight: 15, shape: 'rect' },
];

export const MIN_SIZE = 10;
export const MAX_SIZE = 40;
