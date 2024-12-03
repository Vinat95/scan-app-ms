import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException("Authorization header not found");
    }

    const [authType, token] = authHeader.split(" ");

    if (authType !== "Bearer" || !token) {
      throw new UnauthorizedException("Invalid authorization header format");
    }
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // Throw an error if authentication fails
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
