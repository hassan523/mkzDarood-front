export interface LoginResponse {
     accessToken: string;
     refreshToken: string;
     user: user;
}

export interface LoginResquest {
     identifier: string;
     password: string;
     deviceId: string;
}

// Register Response and Request Types
export interface RegisterResponse {
     accessToken: string;
     refreshToken: string;

     user: {
          username: string;
          email: string;
          role: 'User';
          _id: string;
     };
}

export interface RegisterResquest {
     username: string;
     email: string;
     phone: string;
     password: string;
     deviceId: string;
     role: 'User';
}

export interface User {
     _id: string;
     username: string;
     phone: string;
     email: string;
     password: string;
     role: 'User';
     profilePicture: string;
     refreshTokens: [
          {
               token: string;
               deviceId: string;
               _id: string;
          },
     ];
     createdAt: string;
     updatedAt: string;
     __v: 2;
}

// sub interface
export interface user {
     _id: string;
     username: string;
     phone: string;
     email: string;
     password: string;
     role: 'User';
     profilePicture: string;
     refreshTokens: [
          {
               token: string;
               deviceId: string;
               _id: string;
          },
     ];
     createdAt: string;
     updatedAt: string;
     __v: 2;
}
