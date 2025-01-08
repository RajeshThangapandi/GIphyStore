import * as Sharing from 'expo-sharing';
import { Platform, Linking, Share } from 'react-native';
import * as FileSystem from 'expo-file-system';

export const downloadGif = async (url: string): Promise<string> => {
  try {
    const fileName = url.split('/').pop();
    const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
    
    const downloadResumable = FileSystem.createDownloadResumable(
      url,
      fileUri,
      {},
      false
    );
    
    const { uri } = await downloadResumable.downloadAsync();
    return uri;
  } catch (error) {
    console.error('Error downloading GIF:', error);
    throw new Error('Failed to download GIF');
  }
};

export const shareGifOnWhatsApp = async (url: string) => {
  try {
    // Check if WhatsApp is installed
    const whatsappUrl = `whatsapp://send`;
    const canOpenWhatsApp = await Linking.canOpenURL(whatsappUrl);

    if (!canOpenWhatsApp) {
      throw new Error('WhatsApp is not installed');
    }

    if (Platform.OS === 'ios') {
      // For iOS, use the Share API
      await Share.share({
        url: url, // iOS can handle URLs directly
        message: 'Check out this GIF!'
      });
    } else {
      // For Android, use the native sharing with WhatsApp
      await Share.share({
        message: `Check out this GIF! ${url}`
      });
    }
  } catch (error) {
    console.error('Error sharing GIF:', error);
    if (error.message === 'WhatsApp is not installed') {
      throw new Error('WhatsApp is not installed on your device');
    }
    throw new Error('Failed to share GIF');
  }
};

