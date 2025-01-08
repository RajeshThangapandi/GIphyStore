import React, { useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


interface GifItemProps {
  gif: any;
  theme: 'light' | 'dark';
  onDownload: () => void;
  onShare: () => void;
}

const { width } = Dimensions.get('window');
const itemSize = width / 2 - 15;

const GifItem: React.FC<GifItemProps> = ({ gif, theme, onDownload, onShare }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    await onDownload();
    setIsDownloading(false);
  };

  const handleShare = async () => {
    setIsSharing(true);
    await onShare();
    setIsSharing(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={togglePlayPause}>
        <Image
          source={{ uri: isPlaying ? gif.images.fixed_height.url : gif.images.fixed_height_still.url }}
          style={styles.gif}
          resizeMode="cover"
        />
        {!isPlaying && (
          <View style={styles.playOverlay}>
            <Ionicons name="play" size={24} color="white" />
          </View>
        )}
      </TouchableOpacity>
      <View style={styles.actions}>
        <TouchableOpacity onPress={handleDownload} style={styles.actionButton} disabled={isDownloading}>
          {isDownloading ? (
            <ActivityIndicator size="small" color={theme === 'light' ? 'black' : 'white'} />
          ) : (
            <Ionicons name="download" size={24} color={theme === 'light' ? 'black' : 'white'} />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare} style={styles.actionButton} disabled={isSharing}>
          {isSharing ? (
            <ActivityIndicator size="small" color={theme === 'light' ? 'black' : 'white'} />
          ) : (
            <Ionicons name="logo-whatsapp" size={24} color={theme === 'light' ? 'black' : 'white'} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 5,
    width: itemSize,
  },
  gif: {
    width: itemSize,
    height: itemSize,
    borderRadius: 5,
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 5,
  },
  actionButton: {
    padding: 5,
  },
});

export default GifItem;

