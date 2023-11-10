import { Injectable } from '@nestjs/common';
import { getNamespace } from 'cls-hooked';

@Injectable()
export class ContextService {
  set(key: string, value: any) {
    const context = getNamespace('my-namespace');
    if (context) {
      context.set(key, value);
    }
  }

  get(key: string) {
    const context = getNamespace('my-namespace');
    if (context) {
      return context.get(key);
    }
    return undefined;
  }
}
