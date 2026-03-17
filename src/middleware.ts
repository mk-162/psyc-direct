import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  // Skip static assets
  if (
    req.nextUrl.pathname.startsWith('/_next/') ||
    req.nextUrl.pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  const password = process.env.SITE_PASSWORD;
  if (!password) return NextResponse.next();

  // Handle password submission via query param
  const submitted = req.nextUrl.searchParams.get('_pw');
  if (submitted === password) {
    const url = req.nextUrl.clone();
    url.searchParams.delete('_pw');
    const res = NextResponse.redirect(url);
    res.cookies.set('site-auth', password, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  }

  // Skip auth for API routes
  if (req.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Check auth cookie
  const authCookie = req.cookies.get('site-auth')?.value;
  if (authCookie === password) return NextResponse.next();

  // Wrong password submitted
  const showError = submitted !== null && submitted !== password;

  // Show password page
  return new NextResponse(
    `<!DOCTYPE html>
<html><head><title>Password Required</title>
<style>
  body { font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #f5f3ef; color: #2a2418; }
  .box { text-align: center; max-width: 320px; }
  h1 { font-size: 1.25rem; font-weight: 500; margin-bottom: 1.5rem; }
  .error { color: #c0392b; font-size: 0.875rem; margin-bottom: 1rem; }
  input { display: block; width: 100%; padding: 0.75rem; border: 1px solid #d4cfc7; border-radius: 4px; font-size: 1rem; margin-bottom: 1rem; box-sizing: border-box; }
  button { width: 100%; padding: 0.75rem; background: #2a2418; color: #e8dfd0; border: none; border-radius: 4px; font-size: 0.875rem; cursor: pointer; text-transform: uppercase; letter-spacing: 0.1em; }
  button:hover { background: #3d362a; }
</style>
<script>
  function submitPw(e) {
    e.preventDefault();
    var pw = document.getElementById('pw').value;
    var url = window.location.pathname + '?_pw=' + encodeURIComponent(pw);
    window.location.href = url;
  }
</script>
</head>
<body><div class="box">
  <h1>This site is password protected</h1>
  ${showError ? '<p class="error">Incorrect password</p>' : ''}
  <form onsubmit="submitPw(event)">
    <input type="password" id="pw" placeholder="Enter password" autofocus />
    <button type="submit">Continue</button>
  </form>
</div></body></html>`,
    { status: 200, headers: { 'Content-Type': 'text/html' } }
  );
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
