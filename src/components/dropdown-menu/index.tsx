import React, { useState, useEffect, useRef, useCallback, useMemo, ReactNode } from 'react';
import * as ReactDOM from 'react-dom';
import {
  DROPDOWN_TRIGGER,
  DROPDOWN_VERTICAL_POSITION,
  DROPDOWN_HORIZONTAL_POSITION,
} from '../../constants/dropdown-menu';
import type {
  DropdownTrigger,
  DropdownVerticalPosition,
  DropdownHorizontalPosition,
  DropdownItem,
} from '../../@types/dropdown-menu';
import s from './styles.module.scss';

type DropdownMenuProps = {
  trigger: DropdownTrigger;
  children: ReactNode,
  items: DropdownItem[],
  verticalPosition?: DropdownVerticalPosition,
  horizontalPosition?: DropdownHorizontalPosition,
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  items,
  verticalPosition,
  horizontalPosition,
  children,
}) => {
  const { isHovered, eventHandlers } = useHover();
  const [isOpen, setIsOpen] = useState(false);
  const [isViewportOut, setIsViewportOut] = useState(false);
  const defaultVerticalPosition = useMemo(() => verticalPosition || DROPDOWN_VERTICAL_POSITION.UP, [verticalPosition]);
  const defaultHorizontalPosition = useMemo(() => horizontalPosition || DROPDOWN_HORIZONTAL_POSITION.LEFT, [horizontalPosition]);
  const [dropdownVerticalPosition, setDropdownVerticalPosition] = useState<DropdownVerticalPosition>(defaultVerticalPosition);
  const [dropdownHorizontalPosition, setDropdownHorizontalPosition] = useState<DropdownHorizontalPosition>(defaultHorizontalPosition);

  const verticalPositionClass = useMemo(() => {
    if (dropdownVerticalPosition === DROPDOWN_VERTICAL_POSITION.DOWN) return s.down;
    if (dropdownVerticalPosition === DROPDOWN_VERTICAL_POSITION.UP) return s.up;

    return '';
  }, [dropdownVerticalPosition]);

  const horizontalPositionClass = useMemo(() => {
    if (dropdownHorizontalPosition === DROPDOWN_HORIZONTAL_POSITION.LEFT) return s.left;
    if (dropdownHorizontalPosition === DROPDOWN_HORIZONTAL_POSITION.RIGHT) return s.right;

    return '';
  }, [dropdownHorizontalPosition]);

  const [triggerNode, setTriggerNode] = useState<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const checkPosition = useCallback(() => {
    if (triggerNode && dropdownRef.current) {
      const { top, bottom, left, right } = triggerNode.getBoundingClientRect();
      const { top: ddTop, bottom: ddBottom, left: ddLeft, right: ddRight } = dropdownRef.current.getBoundingClientRect();

      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const windowWidth = window.innerWidth || document.documentElement.clientWidth;

      const dropdownHeight = dropdownRef.current.offsetHeight;
      const dropdownWidth = dropdownRef.current.offsetWidth;

      const isViewportOut = (
        top < 0 ||
        left < 0 ||
        bottom > windowHeight ||
        right > windowWidth
      );

      setIsViewportOut(isViewportOut);

      if (isViewportOut) {
        return;
      }

      if (ddTop <= 0) {
        setDropdownVerticalPosition(DROPDOWN_VERTICAL_POSITION.DOWN);
      } else if (defaultVerticalPosition === DROPDOWN_VERTICAL_POSITION.UP && top > dropdownHeight) {
        setDropdownVerticalPosition(DROPDOWN_VERTICAL_POSITION.UP);
      }

      if (ddBottom >= windowHeight) {
        setDropdownVerticalPosition(DROPDOWN_VERTICAL_POSITION.UP);
      } else if (defaultVerticalPosition === DROPDOWN_VERTICAL_POSITION.DOWN && bottom + dropdownHeight < windowHeight) {
        setDropdownVerticalPosition(DROPDOWN_VERTICAL_POSITION.DOWN);
      }

      if (ddRight >= windowWidth) {
        setDropdownHorizontalPosition(DROPDOWN_HORIZONTAL_POSITION.RIGHT);
      } else if (defaultHorizontalPosition === DROPDOWN_HORIZONTAL_POSITION.LEFT && left + dropdownWidth < windowWidth) {
        setDropdownHorizontalPosition(DROPDOWN_HORIZONTAL_POSITION.LEFT);
      }

      if (ddLeft <= 0) {
        setDropdownHorizontalPosition(DROPDOWN_HORIZONTAL_POSITION.LEFT);
      } else if (defaultHorizontalPosition === DROPDOWN_HORIZONTAL_POSITION.RIGHT && left > dropdownWidth) {
        setDropdownHorizontalPosition(DROPDOWN_HORIZONTAL_POSITION.RIGHT);
      }
    }
  }, [triggerNode, defaultVerticalPosition, defaultHorizontalPosition]);

  const handleEventListen = useCallback(() => {
    if (isOpen) {
      checkPosition();
    }
  }, [isOpen, checkPosition]);

  const handleOutsideClick = useCallback((event: MouseEvent) => {
    if (
      dropdownRef.current &&
      triggerNode &&
      !dropdownRef.current.contains(event.target as Node) &&
      !triggerNode.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  }, [triggerNode]);

  const handleTriggerClick = useCallback(() => {
    setIsOpen(!isOpen);

    if (!isOpen) {
      checkPosition();
    }
  }, [isOpen, checkPosition]);

  const handleDropdownClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
  }, []);

  const onRefChange = useCallback((node: HTMLDivElement) => {
    if (node) {
      setTriggerNode(node);
    }
  }, []);

  const handleMenuClick = useCallback((onClick: () => void) => {
    onClick();
    setIsOpen(false);
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [triggerNode]);

  useEffect(() => {
    if (!isOpen) {
      setDropdownVerticalPosition(defaultVerticalPosition);
      setDropdownHorizontalPosition(defaultHorizontalPosition);
    }

    window.addEventListener('resize', handleEventListen);
    window.addEventListener('scroll', handleEventListen);

    return () => {
      window.removeEventListener('resize', handleEventListen);
      window.removeEventListener('scroll', handleEventListen);
    };
  }, [isOpen, handleEventListen]);

  useEffect(() => {
    setIsOpen(isHovered);

    if (isHovered) {
      checkPosition();
    }
  }, [isHovered]);

  return (
    <div
      className={s.root}
      {...(trigger === DROPDOWN_TRIGGER.HOVER ? eventHandlers : {})}
    >
      <div
        ref={onRefChange}
        className={s.trigger}
        onClick={trigger === DROPDOWN_TRIGGER.CLICK ? handleTriggerClick : undefined}
      >
        {children}
      </div>
      {triggerNode && ReactDOM.createPortal(
        <div
          ref={dropdownRef}
          className={
            `
              ${s.dropdown}
              ${verticalPositionClass}
              ${horizontalPositionClass}
              ${isOpen && !isViewportOut ? s.isOpen : ''}
            `
          }
          onClick={handleDropdownClick}
        >
          <div className={s.items}>
            {items.map((item) => (
              <div key={item.key} className={s.item} onClick={() => handleMenuClick(item.onClick)}>
                <div className={s.itemLabel}>{item.label}</div>
                <div className={s.itemIcon}>{item.icon}</div>
              </div>
            ))}
          </div>
        </div>,
        triggerNode,
      )}
    </div>
  );
};

const useHover = () => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const eventHandlers = useMemo(() => ({
    onMouseOver: () => {
      setIsHovered(true);
    },
    onMouseOut: () => {
      setIsHovered(false);
    },
  }), []);

  return { isHovered, eventHandlers };
}

export default DropdownMenu;
