import React from 'react';
import TriggerMenu from './components/trigger-menu';
import DropdownMenu from './components/dropdown-menu';
import { DROPDOWN_HORIZONTAL_POSITION, DROPDOWN_TRIGGER, DROPDOWN_VERTICAL_POSITION } from './constants/dropdown-menu';
import { ReactComponent as ShareIcon } from './icons/share.svg';
import { ReactComponent as EditIcon } from './icons/edit.svg';
import { ReactComponent as TrashIcon } from './icons/trash.svg';
import type { DropdownItem } from './@types/dropdown-menu';
import s from './app-container.module.scss';

const items: DropdownItem[] = [
  { key: '1', label: 'Поделиться в социальных сетях', icon: <ShareIcon />, onClick: () => { console.log('click to first item'); } },
  { key: '2', label: 'Редактировать страницу', icon: <EditIcon />, onClick: () => { console.log('click to second item'); } },
  { key: '3', label: 'Удалить страницу', icon: <TrashIcon />, onClick: () => { console.log('click to third item'); } },
];

const AppContainer: React.FC = React.memo(() => {
  return (
    <div className={s.root}>
      <div className={s.body}>
        <div className={s.center}>
          <DropdownMenu
            trigger={DROPDOWN_TRIGGER.CLICK}
            items={items}
            verticalPosition={DROPDOWN_VERTICAL_POSITION.UP}
            horizontalPosition={DROPDOWN_HORIZONTAL_POSITION.RIGHT}
          >
            <TriggerMenu />
          </DropdownMenu>
        </div>
        <div className={s.leftTopMenu}>
          <DropdownMenu
            trigger={DROPDOWN_TRIGGER.CLICK}
            items={items}
          >
            <TriggerMenu />
          </DropdownMenu>
        </div>
        <div className={s.leftBottomMenu}>
          <DropdownMenu
            trigger={DROPDOWN_TRIGGER.HOVER}
            items={items}
          >
            <TriggerMenu />
          </DropdownMenu>
        </div>
        <div className={s.rightTopMenu}>
          <DropdownMenu
            trigger={DROPDOWN_TRIGGER.CLICK}
            items={items}
          >
            <TriggerMenu />
          </DropdownMenu>
        </div>
        <div className={s.rightBottomMenu}>
          <DropdownMenu
            trigger={DROPDOWN_TRIGGER.HOVER}
            items={items}
          >
            <TriggerMenu />
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
});

export default AppContainer;
