import { ReactNode } from 'react';
import {
  DROPDOWN_TRIGGER,
  DROPDOWN_VERTICAL_POSITION,
  DROPDOWN_HORIZONTAL_POSITION,
} from '../constants/dropdown-menu';

export type DropdownTrigger = DROPDOWN_TRIGGER;
export type DropdownVerticalPosition = DROPDOWN_VERTICAL_POSITION;
export type DropdownHorizontalPosition = DROPDOWN_HORIZONTAL_POSITION;

export type DropdownItem = {
  key: string,
  label: string,
  icon: ReactNode,
  onClick: () => void,
};
