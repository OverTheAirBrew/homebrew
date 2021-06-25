export interface IOtaPlugin {
  pluginName: string;
  loadServerControllers: () => void;
}
