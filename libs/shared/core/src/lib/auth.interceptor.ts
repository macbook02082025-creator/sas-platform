import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const tenantId = localStorage.getItem('tenant_id');
  
  let headers: { [key: string]: string } = {};
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  if (tenantId) {
    headers['x-tenant-id'] = tenantId;
  }

  if (Object.keys(headers).length > 0) {
    const cloned = req.clone({
      setHeaders: headers
    });
    return next(cloned);
  }
  
  return next(req);
};
