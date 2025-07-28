export interface LoginResponse {
     accessToken: string;
     refreshToken: string;
     user: {
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
     };
}

export interface LoginResquest {
     identifier: string;
     password: string;
     deviceId: string;
}
