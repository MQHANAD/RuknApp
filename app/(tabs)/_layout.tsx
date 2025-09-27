import React from "react";
import { Tabs } from "expo-router";
import { useTranslation } from 'react-i18next';
import { icons } from "../../constants";
import { TabBar } from "../../components/design-system";

const TabsLayout = () => {
  const { t } = useTranslation();

  const tabs = [
    { key: 'home', title: t('navigation.home'), icon: icons.home },
    { key: 'favorite', title: t('navigation.favorite'), icon: icons.heart },
    { key: 'profile', title: t('navigation.profile'), icon: icons.userCircle },
  ];

  return (
    <Tabs
      tabBar={(props: any) => (
        <TabBar
          tabs={tabs}
          activeTab={props.state?.routes?.[props.state?.index]?.name || 'home'}
          onTabPress={(tabKey) => {
            const tabIndex = tabs.findIndex(tab => tab.key === tabKey);
            if (tabIndex !== -1) {
              props.navigation.navigate(tabs[tabIndex].key);
            }
          }}
          activeTintColor="#F5A623"
          inactiveTintColor="#ffffff"
          backgroundColor="#1E2A38"
        />
      )}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="favorite" options={{ title: "Favorite" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
};

export default TabsLayout;
