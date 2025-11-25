# Quick Reference - Module Federation Setup

Dokumen ini berisi quick reference untuk development dan troubleshooting Module Federation setup.

## 🚀 Quick Start

### Start Development Server
```bash
npm run serve:mf
# atau
ng serve --port 4200
```

### Verifikasi Setup
```bash
# 1. Cek server running
curl http://localhost:4200

# 2. Cek remoteEntry.js tersedia
curl http://localhost:4200/remoteEntry.js

# 3. Test di browser
# Buka: http://localhost:4200
```

## 📋 Checklist Setup

### File-file Penting
- ✅ `webpack.config.js` - Module Federation config
- ✅ `angular.json` - Custom webpack builder config
- ✅ `src/bootstrap.ts` - Web Component registration
- ✅ `src/main.ts` - Entry point
- ✅ `src/app/login/login.component.ts` - Login component dengan event emit

### Konfigurasi Module Federation
**File:** `webpack.config.js`
- Name: `remoteLogin`
- Filename: `remoteEntry.js`
- Exposes: `./webcomponent` → `./src/bootstrap.ts`
- Shared: Angular core, common, forms, router, elements, rxjs

### Angular Builder
**File:** `angular.json`
- Builder: `@angular-builders/custom-webpack:browser`
- Dev Server: `@angular-builders/custom-webpack:dev-server`
- Custom webpack config path: `./webpack.config.js`

## 🔌 Integrasi dengan Next.js

### Load Remote
1. Install `@module-federation/nextjs-mf`
2. Configure Next.js dengan NextFederationPlugin
3. Import remote: `import('remoteLogin/webcomponent')`
4. Render: `<angular-login ref={loginRef} />`

### Listen Event dari Angular
- Event name: `loginSubmit`
- Event detail: `{ email, password }`
- Add listener menggunakan `addEventListener`
- Cleanup listener on unmount

### Control State dari Next.js
- `setError(message)` - Set error message
- `setLoading(boolean)` - Control loading state

## 🐛 Troubleshooting

### remoteEntry.js 404

**Penyebab:** Webpack config tidak ter-load

**Solusi:**
1. Stop server (Ctrl+C)
2. Cek `angular.json` line 39-41 ada `customWebpackConfig`
3. Restart: `ng serve --port 4200`

### Web Component Not Defined

**Penyebab:** Bootstrap belum execute

**Solusi:**
1. Cek console browser untuk error
2. Pastikan `import('remoteLogin/webcomponent')` dipanggil
3. Cek network tab, remoteEntry.js harus status 200

### CORS Error

**Penyebab:** Next.js tidak bisa akses Angular remote

**Solusi:**
Cek `angular.json` ada CORS headers di `serve.options.headers`

### Event Tidak Ter-emit

**Penyebab:** Event listener belum ready

**Solusi:**
1. Add `composed: true` di CustomEvent
2. Pastikan event name: `loginSubmit` (case-sensitive)
3. Add listener SETELAH component loaded

### Port 4200 Already in Use

**Solusi Windows:**
```bash
# Cari process
netstat -ano | findstr :4200

# Kill process
taskkill /PID <PID> /F

# Atau pakai port lain
ng serve --port 4201
```

## 📊 Directory Structure

```
competition-v1-remote-login/
├── src/
│   ├── app/
│   │   ├── login/
│   │   │   ├── login.component.ts      ← Component yang di-expose
│   │   │   ├── login.component.html
│   │   │   └── login.component.scss
│   │   └── app.config.ts
│   ├── main.ts                          ← Entry point
│   └── bootstrap.ts                     ← Web Component registration
├── webpack.config.js                    ← Module Federation ⚡
├── angular.json                         ← Custom webpack config
└── package.json
```

## 🧪 Testing Checklist

Sebelum integrate ke Next.js, test dulu Angular remote standalone:

- [ ] Server running: `http://localhost:4200`
- [ ] remoteEntry.js available: `http://localhost:4200/remoteEntry.js`
- [ ] Login form terlihat di browser
- [ ] Console log: "✅ Web Component 'angular-login' registered successfully"
- [ ] Form validation works (email required, password min 6)
- [ ] Submit button disabled saat form invalid
- [ ] No console errors

## 📝 Communication Flow

```
┌─────────────────────────────────────────────────┐
│  Next.js Host                                    │
│                                                  │
│  1. Load: remoteLogin/webcomponent               │
│  2. Render: <angular-login ref={ref} />          │
│  3. Listen: addEventListener('loginSubmit')      │
│  4. Receive: { email, password }                 │
│  5. Control: ref.setError(), ref.setLoading()    │
└─────────────────────────────────────────────────┘
                        ▲
                        │ CustomEvent
                        │
┌─────────────────────────────────────────────────┐
│  Angular Remote                                  │
│                                                  │
│  1. User submit form                             │
│  2. Validate form                                │
│  3. Emit: CustomEvent('loginSubmit', {...})      │
│  4. Expose: setError(), setLoading()             │
└─────────────────────────────────────────────────┘
```

## 🎯 Key Points

1. **Webpack config WAJIB ada** - Tanpa ini, tidak ada remoteEntry.js
2. **Bootstrap pattern** - `main.ts` → `bootstrap.ts` untuk lazy load
3. **Web Component approach** - Framework-agnostic, bisa dipakai di React/Vue/Vanilla
4. **Event-based communication** - Loose coupling antara Angular dan Next.js
5. **Public API** - `setError()` dan `setLoading()` untuk host control state

## 🔗 Dependencies

### Runtime
- `@angular/core` v18.2.14
- `@angular/elements` v18.2.14
- `@angular-architects/module-federation` v18.0.6

### Dev
- `@angular-builders/custom-webpack` v18.0.0
- `webpack` (via Angular CLI)

## 📦 Build Production

```bash
npm run build

# Output di: dist/competition-v1-remote-login/
# File penting: remoteEntry.js, main.*.js
```

## 🌐 Production Deployment

1. Deploy Angular remote ke hosting (Vercel/Netlify/etc)
2. Update Next.js config dengan production URL
3. Remote URL format: `remoteLogin@https://your-domain.com/remoteEntry.js`

---

**Status:** ✅ Ready
**Port:** 4200
**Exposed:** `./webcomponent` → `bootstrap.ts`
**Web Component:** `<angular-login>`
**Event:** `loginSubmit` dengan `{ email, password }`
**Last Updated:** 2025-11-25
