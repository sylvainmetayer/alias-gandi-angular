import { LoginService } from '../login.service';

export function reconnectInitializer(loginService: LoginService) {
  return () => loginService.reconnect();
}
