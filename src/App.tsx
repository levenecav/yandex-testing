import React from 'react';
import Menu from './components/menu';
import s from './app.module.scss';

const App: React.FC = React.memo(() => {
  return (
    <div className={s.root}>
      <div className={s.leftTopMenu}>
        <Menu />
      </div>
      <div className={s.leftBottomMenu}>
        <Menu />
      </div>
      <div className={s.rightTopMenu}>
        <Menu />
      </div>
      <div className={s.rightTopMenu}>
        <Menu />
      </div>
    </div>
  );
});

export default App;
