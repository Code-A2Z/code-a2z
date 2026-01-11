import { ROUTES_V1 } from '../../../app/routes/constants/routes';
import { SettingTabType } from '../typings';
import SidebarItem from './sidebar-item';

const SettingsTab = ({
  setting,
  index,
  filteredSettings,
}: {
  setting: SettingTabType;
  index: number;
  filteredSettings: SettingTabType[];
}) => {
  const { name, description, icon, path, locked, isNew, newText, feature, id } =
    setting;
  const absolutePath = `${ROUTES_V1.SETTINGS}${path}`;
  const isTabActive = window.location.pathname.includes(absolutePath);
  const isLastItem = index === filteredSettings.length - 1;

  return (
    <SidebarItem
      id={id}
      name={name}
      description={description}
      icon={icon}
      path={absolutePath}
      locked={locked}
      isNew={isNew}
      newText={newText}
      feature={feature}
      isActive={isTabActive}
      isLastItem={isLastItem}
      testId={`settings-${name}`}
    />
  );
};

export default SettingsTab;
