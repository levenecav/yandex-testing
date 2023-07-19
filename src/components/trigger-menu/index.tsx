import React from 'react';
import { ReactComponent as Icon } from '../../icons/menu.svg';
import s from './styles.module.scss';

const TriggerMenu: React.FC = React.memo(() => {
  return (
    <div className={s.root}>
      <Icon />
    </div>
  );
});

export default TriggerMenu;
