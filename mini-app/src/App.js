import { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, SplitLayout, SplitCol } from '@vkontakte/vkui';
import { useActiveVkuiLocation } from '@vkontakte/vk-mini-apps-router';

import { Converter } from './panels/Converter';
import { DEFAULT_VIEW_PANELS } from './routes';

export const App = () => {
  const { panel: activePanel = DEFAULT_VIEW_PANELS.Converter } = useActiveVkuiLocation();
  const [fetchedUser, setUser] = useState();
  const [popout, setPopout] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const user = await bridge.send('VKWebAppGetUserInfo');
        setUser(user);
      } catch (e) {
        console.warn('VK Bridge недоступен, работаем без данных пользователя');
        // можно установить тестовые данные или просто оставить undefined
      } finally {
        setPopout(null);
      }
    }
    fetchData();
  }, []);

  return (
    <SplitLayout>
      <SplitCol>
        <View activePanel={activePanel}>
          <Converter id="converter" fetchedUser={fetchedUser} />
        </View>
      </SplitCol>
      {popout}
    </SplitLayout>
  );
};
