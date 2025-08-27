import { apiClient } from '../../../services/apiClient';
import { Visual, VisualGallery, VisualFilters, VisualsApiResponse, VisualApiResponse, VisualQuality } from '../types';

export class VisualsService {
  private static instance: VisualsService;

  static getInstance(): VisualsService {
    if (!VisualsService.instance) {
      VisualsService.instance = new VisualsService();
    }
    return VisualsService.instance;
  }

  // Get visual by ID
  async getVisual(visualId: string): Promise<Visual> {
    const response = await apiClient.get<Visual>(`/visuals/${visualId}`);
    return response.data;
  }

  // Get visuals for playlist
  async getVisualsForPlaylist(playlistId: string): Promise<Visual[]> {
    const response = await apiClient.get<Visual[]>(`/playlists/${playlistId}/visuals`);
    return response.data;
  }

  // Get visuals for track
  async getVisualsForTrack(trackId: string): Promise<Visual[]> {
    const response = await apiClient.get<Visual[]>(`/tracks/${trackId}/visuals`);
    return response.data;
  }

  // Search visuals
  async searchVisuals(query: string, filters?: VisualFilters): Promise<{
    visuals: Visual[];
    total: number;
    hasMore: boolean;
  }> {
    const response = await apiClient.post<{
      visuals: Visual[];
      total: number;
      hasMore: boolean;
    }>('/visuals/search', {
      query,
      filters,
    });
    return response.data;
  }

  // Get visual galleries
  async getVisualGalleries(): Promise<VisualGallery[]> {
    const response = await apiClient.get<VisualGallery[]>('/visuals/galleries');
    return response.data;
  }

  // Get specific gallery
  async getVisualGallery(galleryId: string): Promise<VisualGallery> {
    const response = await apiClient.get<VisualGallery>(`/visuals/galleries/${galleryId}`);
    return response.data;
  }

  // Get trending visuals
  async getTrendingVisuals(): Promise<Visual[]> {
    const response = await apiClient.get<Visual[]>('/visuals/trending');
    return response.data;
  }

  // Get new visuals
  async getNewVisuals(): Promise<Visual[]> {
    const response = await apiClient.get<Visual[]>('/visuals/new');
    return response.data;
  }

  // Get featured visuals
  async getFeaturedVisuals(): Promise<Visual[]> {
    const response = await apiClient.get<Visual[]>('/visuals/featured');
    return response.data;
  }

  // User interactions
  async likeVisual(visualId: string): Promise<void> {
    await apiClient.post(`/visuals/${visualId}/like`);
  }

  async unlikeVisual(visualId: string): Promise<void> {
    await apiClient.delete(`/visuals/${visualId}/like`);
  }

  // Download visual
  async downloadVisual(visualId: string, quality: VisualQuality = 'high'): Promise<{
    downloadUrl: string;
    fileName: string;
    fileSize: number;
  }> {
    const response = await apiClient.post<{
      downloadUrl: string;
      fileName: string;
      fileSize: number;
    }>(`/visuals/${visualId}/download`, { quality });
    return response.data;
  }

  // Share visual
  async shareVisual(visualId: string): Promise<string> {
    const response = await apiClient.post<{ shareUrl: string }>(`/visuals/${visualId}/share`);
    return response.data.shareUrl;
  }

  // Gallery management
  async createGallery(title: string, description?: string): Promise<VisualGallery> {
    const response = await apiClient.post<VisualGallery>('/visuals/galleries', {
      title,
      description,
    });
    return response.data;
  }

  async addVisualsToGallery(galleryId: string, visualIds: string[]): Promise<void> {
    await apiClient.post(`/visuals/galleries/${galleryId}/visuals`, {
      visualIds,
    });
  }

  async removeVisualsFromGallery(galleryId: string, visualIds: string[]): Promise<void> {
    await apiClient.delete(`/visuals/galleries/${galleryId}/visuals`, {
      data: { visualIds },
    });
  }

  // Get user's liked visuals
  async getLikedVisuals(): Promise<Visual[]> {
    const response = await apiClient.get<Visual[]>('/user/visuals/liked');
    return response.data;
  }

  // Get user's downloaded visuals
  async getDownloadedVisuals(): Promise<Visual[]> {
    const response = await apiClient.get<Visual[]>('/user/visuals/downloaded');
    return response.data;
  }

  // Analytics
  async trackVisualView(visualId: string): Promise<void> {
    await apiClient.post(`/visuals/${visualId}/view`);
  }

  async trackVisualInteraction(visualId: string, action: string, data?: any): Promise<void> {
    await apiClient.post(`/visuals/${visualId}/interaction`, {
      action,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  // Upload visual (for future admin panel)
  async uploadVisual(formData: FormData): Promise<Visual> {
    const response = await apiClient.upload<Visual>('/visuals/upload', formData);
    return response.data;
  }

  // Get visual metadata (for optimization)
  async getVisualMetadata(visualId: string): Promise<{
    colors: string[];
    tags: string[];
    dimensions: { width: number; height: number };
    fileInfo: { size: number; format: string; duration?: number };
  }> {
    const response = await apiClient.get<{
      colors: string[];
      tags: string[];
      dimensions: { width: number; height: number };
      fileInfo: { size: number; format: string; duration?: number };
    }>(`/visuals/${visualId}/metadata`);
    return response.data;
  }

  // Prefetch visual for smooth playback
  async prefetchVisual(visualId: string, quality: VisualQuality = 'medium'): Promise<void> {
    await apiClient.post(`/visuals/${visualId}/prefetch`, { quality });
  }
}

export const visualsService = VisualsService.getInstance();
