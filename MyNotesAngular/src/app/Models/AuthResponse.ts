

export enum UserData {
    UserId = "user-id",
    UserToken = "user-token",
    UserMail = "user-mail",
    UserName = "user-name"
}

export class AuthReponse {
    userId: number;
    userToken: string;
    userMail: string;
    userName: string;
}

export function saveAuthResponse(response:AuthReponse){
    clearAuthResponse();

    console.log(response.userToken);

    localStorage.setItem(UserData.UserId, response.userId + "");
    localStorage.setItem(UserData.UserToken, response.userToken);
    localStorage.setItem(UserData.UserMail, response.userMail);
    localStorage.setItem(UserData.UserName, response.userName);
}

export function clearAuthResponse() {
    localStorage.removeItem(UserData.UserId);
    localStorage.removeItem(UserData.UserMail);
    localStorage.removeItem(UserData.UserName);
    localStorage.removeItem(UserData.UserToken);
}