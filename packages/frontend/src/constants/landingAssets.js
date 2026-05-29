import footballAsset from '../assets/landing/football.svg';
import playbookPatternAsset from '../assets/landing/playbook-pattern.svg';
import stadiumAsset from '../assets/landing/stadium.svg';

export const LANDING_ASSETS = [
  {
    id: 'stadium-illustration',
    assetType: 'illustration',
    localPath: stadiumAsset,
    altText: 'Stylized football stadium lights over a field',
    placementArea: 'hero',
    fallbackBehavior: 'replace_with_shape'
  },
  {
    id: 'football-icon',
    assetType: 'icon',
    localPath: footballAsset,
    altText: 'American football icon',
    placementArea: 'hero',
    fallbackBehavior: 'hide'
  },
  {
    id: 'playbook-pattern',
    assetType: 'pattern',
    localPath: playbookPatternAsset,
    altText: null,
    placementArea: 'background',
    fallbackBehavior: 'replace_with_shape'
  }
];
