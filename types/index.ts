export type Shop = {
  idx: number;
  name: string;
  phone: string;
  address: string;
  latitude: number;
  longitude: number;
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
  tags:
    | {
        idx: number;
        name: string;
      }[]
    | null;
  styles:
    | {
        idx: number;
        name: string;
        images: [];
      }[]
    | null;
  images: null;
  liked: boolean;
  likes: number;
};
