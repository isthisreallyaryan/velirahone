import * as ExpoHaptics from 'expo-haptics';
import { Platform } from 'react-native';

// Safe wrapper to ensure haptics only fire on supported native devices
// and fail silently without crashing if unavailable or on the web.
const trigger = async (action: () => Promise<void>) => {
  if (Platform.OS !== 'web') {
    try {
      await action();
    } catch (error) {
      // Silently catch unsupported hardware errors
    }
  }
};

export const Haptics = {
  // Core Impact Styles
  light: () => trigger(() => ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Light)),
  medium: () => trigger(() => ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Medium)),
  heavy: () => trigger(() => ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Heavy)),

  // Core Notification Types
  success: () => trigger(() => ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Success)),
  warning: () => trigger(() => ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Warning)),
  error: () => trigger(() => ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Error)),

  // ---------------------------------------------------------------------------
  // Arena Domain-Specific Aliases
  // ---------------------------------------------------------------------------
  
  /** 
   * Fired when a fact-check token is spent and a claim is formally challenged.
   * Creates a distinct, urgent buzzing sensation.
   */
  claimChallenged: () => trigger(() => ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Warning)),
  
  /** 
   * Fired when the system or community verifies a citation.
   * Creates a highly satisfying, resolving double-tap.
   */
  factVerified: () => trigger(() => ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Success)),
  
  /** 
   * Fired when the user commits to a stance in the DilemmaWidget.
   * Creates a deep, heavy, physical thud to represent locking in a vector.
   */
  voteLocked: () => trigger(() => ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Heavy)),
  
  /** 
   * Fired exactly when a user taps 'Drop Pin' during a voice recording.
   * Creates an anchoring physical strike in the timeline.
   */
  pinDropped: () => trigger(() => ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Heavy)),
  
  /** 
   * Fired for standard, frictionless interactions like dispatching a chat message.
   */
  messageSent: () => trigger(() => ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Light)),
};

