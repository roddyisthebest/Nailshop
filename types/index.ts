export type Style = {
  idx: string;
  images: {
    createdAt: Date;
    extension: 'string';
    idx: number;
    name: string;
    originalName: string;
    saveName: string;
    size: number;
    type: number;
    uploadPath: string;
  }[];
  liked: boolean;
  name: string;
  shop: Shop;
};

export type Shop = {
  idx: number;
  name: string;
  phone: string;
  address: string;
  latitude: number;
  longitude: number;
  kakao: null;
  businessHours: number | null;
  bookedBefore: boolean;
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
  styles: Style[];
  images: {name: string}[];
  liked: boolean;
  likes: number;
};

export type Reservation = {
  createdAt: Date;
  idx: number;
  shop: Shop;
  type: 'PHONE' | 'MESSAGE' | 'KAKAO';
  user: UserInfo;
};

export type UserInfo = {
  idx: number;
  email: string;
  phone: string;
  oauth: 'KAKAO' | 'FACEBOOK' | 'GOOGLE';
  createdAt: any;
};

export type ReviewType = {
  content: string;
  createdAt: string;
  idx: number;
  score: number;
  shop: Shop;
  user: UserInfo;
};
