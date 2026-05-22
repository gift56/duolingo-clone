import { LogBox } from "react-native";

let logBoxConfigured = false;

/** Suppress noisy Stream SDK dev warnings that do not affect audio lessons. */
export function configureStreamLogBox() {
  if (logBoxConfigured) return;
  logBoxConfigured = true;

  LogBox.ignoreLogs([
    "[location-hint]",
    "[SfuStatsReporter]",
    "i18next is made possible",
  ]);
}
