import { Soup, Disc, Salad, Can, LucideIcon } from 'lucide-react-native';

export type ContainerKey = 'chen' | 'to' | 'to_lon' | 'dia_nho' | 'dia' | 'dia_lon' | 'hop';

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
  { key: 'chen',    label: 'Chén',     subtitle: '~200g',       icon: Salad,   shape: 'circle' },
  { key: 'to',      label: 'Tô vừa',   subtitle: '~550g',       icon: Soup,    shape: 'circle' },
  { key: 'to_lon',  label: 'Tô lớn',   subtitle: '~750g',       icon: Soup,    shape: 'circle' },
  { key: 'dia_nho', label: 'Đĩa nhỏ',  subtitle: '~110g',       icon: Disc,    shape: 'circle' },
  { key: 'dia',     label: 'Đĩa vừa',  subtitle: '~180g',       icon: Disc,    shape: 'circle' },
  { key: 'dia_lon', label: 'Đĩa lớn',  subtitle: '~250g',       icon: Disc,    shape: 'circle' },
  { key: 'hop',     label: 'Hộp mang đi', subtitle: 'Tùy chỉnh', icon: Can,     defaultSize: 20, defaultHeight: 15, shape: 'rect' },
];

export const MIN_SIZE = 10;
export const MAX_SIZE = 40;
