import { Can, Disc, LucideIcon, Salad, Soup } from 'lucide-react-native';

export const CONTAINER_KEYS = [
  'chen', 'to', 'to_lon', 'dia_nho', 'dia', 'dia_lon', 'hop',
] as const;

export type ContainerKey = (typeof CONTAINER_KEYS)[number];

export interface ContainerConfig {
  key: ContainerKey;
  label: string;
  subtitle: string;
  icon: LucideIcon;
  defaultSize?: number;    // width (rect)
  defaultHeight?: number; // height only for rect
  shape: 'circle' | 'rect';
}

export const CONTAINERS: ContainerConfig[] = [
  { key: 'chen', label: 'Chén', subtitle: '~200g', icon: Salad, shape: 'circle' },
  { key: 'to', label: 'Tô vừa', subtitle: '~550g', icon: Soup, shape: 'circle' },
  { key: 'to_lon', label: 'Tô Lớn', subtitle: '~750g', icon: Soup, shape: 'circle' },
  { key: 'dia_nho', label: 'Đĩa nhỏ', subtitle: '~110g', icon: Disc, shape: 'circle' },
  { key: 'dia', label: 'Đĩa vừa', subtitle: '~180g', icon: Disc, shape: 'circle' },
  { key: 'dia_lon', label: 'manglớn', subtitle: '~250g', icon: Disc, shape: 'circle' },
  { key: 'hop', label: 'Hộp mang đi', subtitle: 'Hộp chuẩn', icon: Can, shape: 'rect' },
];

export const MIN_SIZE = 10;
export const MAX_SIZE = 40;
