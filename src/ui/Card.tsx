import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  ImageStyle,
  TextStyle,
  ImageSourcePropType,
} from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { textStyles, createShadow } from '../theme/styles';

interface CardProps {
  /** Card title */
  title: string;
  /** Card subtitle */
  subtitle?: string;
  /** Image source */
  imageSource?: ImageSourcePropType;
  /** Image URI string */
  imageUri?: string;
  /** Card size */
  size?: 'small' | 'medium' | 'large';
  /** Aspect ratio for the image */
  aspectRatio?: number;
  /** Press handler */
  onPress?: () => void;
  /** Show gradient overlay */
  showGradient?: boolean;
  /** Custom container style */
  style?: ViewStyle;
  /** Custom image style */
  imageStyle?: ImageStyle;
  /** Custom title style */
  titleStyle?: TextStyle;
  /** Custom subtitle style */
  subtitleStyle?: TextStyle;
  /** Content to show at the bottom of the card */
  bottomContent?: React.ReactNode;
  /** Children to render inside the card */
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  imageSource,
  imageUri,
  size = 'medium',
  aspectRatio = 16 / 9,
  onPress,
  showGradient = false,
  style,
  imageStyle,
  titleStyle,
  subtitleStyle,
  bottomContent,
  children,
}) => {
  const { colors, spacing, borderRadius, sizes } = useTheme();

  const styles = StyleSheet.create({
    container: {
      borderRadius: borderRadius.md,
      overflow: 'hidden',
      backgroundColor: colors.background.card,
    },

    // Size variants
    small: {
      width: sizes.card.small.width,
      height: sizes.card.small.height,
    },
    medium: {
      width: sizes.card.medium.width,
      height: sizes.card.medium.height,
    },
    large: {
      width: '100%',
      height: 200,
    },

    imageContainer: {
      flex: 1,
      position: 'relative',
    },

    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },

    gradientOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '60%',
      background: 'linear-gradient(180deg, rgba(1, 7, 21, 0) 0%, rgba(1, 7, 21, 0.8) 100%)',
    },

    content: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: spacing[4],
    },

    contentStatic: {
      padding: spacing[3],
      gap: spacing[1],
    },

    title: {
      ...textStyles.bodySmall,
      color: colors.white,
      fontWeight: '500',
    },

    subtitle: {
      ...textStyles.caption,
      color: colors.text.secondary,
    },

    bottomContentContainer: {
      marginTop: spacing[2],
    },
  });

  const cardStyles = [
    styles.container,
    styles[size],
    style,
  ];

  const imageProps = imageSource ? { source: imageSource } : { source: { uri: imageUri } };

  const CardContent = (
    <View style={cardStyles}>
      {(imageSource || imageUri) && (
        <View style={styles.imageContainer}>
          <Image
            {...imageProps}
            style={[styles.image, imageStyle]}
          />
          
          {showGradient && (
            <View style={styles.gradientOverlay} />
          )}
          
          {showGradient && (
            <View style={styles.content}>
              <Text style={[styles.title, titleStyle]} numberOfLines={2}>
                {title}
              </Text>
              {subtitle && (
                <Text style={[styles.subtitle, subtitleStyle]} numberOfLines={1}>
                  {subtitle}
                </Text>
              )}
              {bottomContent && (
                <View style={styles.bottomContentContainer}>
                  {bottomContent}
                </View>
              )}
            </View>
          )}
        </View>
      )}
      
      {!showGradient && (
        <View style={styles.contentStatic}>
          <Text style={[styles.title, titleStyle]} numberOfLines={2}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.subtitle, subtitleStyle]} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
          {bottomContent && (
            <View style={styles.bottomContentContainer}>
              {bottomContent}
            </View>
          )}
        </View>
      )}
      
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {CardContent}
      </TouchableOpacity>
    );
  }

  return CardContent;
};
