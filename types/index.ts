export type Shop = {
  idx: number;
  name: string;
  phone: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  kakao: null;
  businessHours: number | null;
  shopMainImage: {
    idx: number;
    name: string;
    createdAt: Date;
    originalName: string;
    saveName: string;
    size: number;
    uploadPath: string;
    extension: '.png' | '.jpeg';
  };
  tags: null;
  styles: null;
  images: null;
  liked: boolean;
  likes: number;
};
