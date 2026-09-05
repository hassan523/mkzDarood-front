export interface GetHistoryResponse {
     history: history[];
     meta: { totalItems: number; totalPages: number; page: number; limit: number };
}

interface history {
     _id: string;
     userId: string;
     histories: histories[];
     createdAt: string;
     updatedAt: string;
     userData: {
          _id: string;
          username: string;
          phone: string;
          email: string;
          country: string;
          city: string;
          role: string;
          profilePicture: string;
     };
}

export interface histories {
     count: number;
     _id: string;
     createdAt: string;
     readDate: string;
     updatedAt: string;
     isToday?: boolean;
}
