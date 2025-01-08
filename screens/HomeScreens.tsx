import React, { useRef, useCallback } from 'react';
import { StyleSheet, View, TextInput, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import GifItem from '../components/GifItem';
import ThemeToggle from '../components/ThemeToggle';
import { useGifSearch } from '../hooks/useGifSearch';
import { shareGifOnWhatsApp, downloadGif } from '../utils/helpers';


export default function HomeScreen() {
  const { theme } = useTheme();
  const { gifs, search, isLoading, handleSearchInput, handleLoadMore } = useGifSearch();
  const searchInputRef = useRef(null);

  const handleDownload = useCallback(async (url: string) => {
    try {
      const uri = await downloadGif(url);
      Alert.alert('Success', 'GIF downloaded successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to download GIF');
    }
  }, []);

  const handleShare = useCallback(async (url: string) => {
    try {
      await shareGifOnWhatsApp(url);
    } catch (error) {
      Alert.alert('Error', 'Failed to share GIF on WhatsApp');
    }
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme === 'light' ? '#f0f0f0' : '#1a1a1a' }]}>
      <View style={styles.header}>
        <TextInput
          ref={searchInputRef}
          style={[
            styles.searchInput,
            { backgroundColor: theme === 'light' ? '#ffffff' : '#333333', color: theme === 'light' ? '#000000' : '#ffffff' }
          ]}
          placeholder="Search GIFs..."
          placeholderTextColor={theme === 'light' ? '#999999' : '#666666'}
          onChangeText={handleSearchInput}
          value={search}
        />
        <ThemeToggle />
      </View>
      <FlatList
        data={gifs}
        renderItem={({ item }) => (
          <GifItem
            gif={item}
            theme={theme}
            onDownload={() => handleDownload(item.images.original.url)}
            onShare={() => handleShare(item.images.original.url)}
          />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={() => isLoading && <ActivityIndicator size={36} color="#0000ff" />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
});

