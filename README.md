# Angular Remote Login - Module Federation

Angular microfrontend untuk Login Component yang di-expose sebagai **Web Component** via **Webpack Module Federation** untuk digunakan di Next.js host.

## 🎯 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Next.js Host (Port 3000)                │
│                                                               │
│  • Load: http://localhost:4200/remoteEntry.js                │
│  • Import: remoteLogin/webcomponent                          │
│  • Render: <angular-login />                                 │
│  • Listen: loginSubmit event                                 │
│  • Control: setError(), setLoading()                         │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │ CustomEvent
                            │
┌─────────────────────────────────────────────────────────────┐
│         Angular Remote (Port 4200) - THIS PROJECT            │
│                                                               │
│  • bootstrap.ts: Web Component Registration                  │
│  • LoginComponent: <angular-login>                           │
│  • webpack.config.js: Module Federation Config               │
│  • Expose: ./webcomponent → bootstrap.ts                     │
│  • Generate: remoteEntry.js                                  │
└─────────────────────────────────────────────────────────────┘
```

## 🏗️ Setup Yang Telah Dilakukan

### 1. **Module Federation Configuration**

**File: `webpack.config.js`**
- ✅ Plugin: `ModuleFederationPlugin`
- ✅ Remote name: `remoteLogin`
- ✅ Exposed module: `./webcomponent` → `./src/bootstrap.ts`
- ✅ Generates: `remoteEntry.js` di `http://localhost:4200/remoteEntry.js`
- ✅ Shared dependencies: Angular core, common, forms, router, elements, rxjs

### 2. **Angular Builder Integration**

**File: `angular.json`**
- ✅ Builder: `@angular-builders/custom-webpack:browser`
- ✅ Dev Server: `@angular-builders/custom-webpack:dev-server`
- ✅ Custom webpack config: `./webpack.config.js`
- ✅ Port: `4200`
- ✅ CORS headers: Enabled untuk cross-origin requests

### 3. **Web Component Approach**

**File: `src/bootstrap.ts`**
- ✅ Convert Angular component ke Web Component menggunakan `@angular/elements`
- ✅ Register custom element: `<angular-login>`
- ✅ Standalone application dengan `createApplication()`

### 4. **Communication Pattern: Event-Based**

**File: `src/app/login/login.component.ts`**

Angular tidak handle authentication secara langsung, tapi **emit event ke host**:

- Component emit CustomEvent dengan nama `loginSubmit`
- Event detail berisi: `{ email, password }`
- Event options: `bubbles: true`, `composed: true` (penting untuk Web Components)
- Host (Next.js) listen event ini untuk handle authentication

### 5. **Public API untuk Host Control State**

Component expose 2 public methods untuk host bisa control state:

- `setError(message: string)` - Set error message dari host
- `setLoading(loading: boolean)` - Control loading state dari host

### 6. **UI/UX**
- ✅ Tailwind CSS untuk styling
- ✅ Dark theme (gray-900 background)
- ✅ Form validation (email, password min 6 chars)
- ✅ Loading state dengan spinner
- ✅ Error display
- ✅ Responsive design

## 📦 Dependencies

### Production
- `@angular/core` ^18.2.14
- `@angular/elements` ^18.2.14
- `@angular/forms` ^18.2.14
- `@angular-architects/module-federation` ^18.0.6

### DevDependencies
- `@angular-builders/custom-webpack` ^18.0.0
- `tailwindcss` ^3.4.18

## 🚀 Development

### Start Development Server
```bash
npm install
npm run serve:mf
```

Server akan berjalan di: `http://localhost:4200`

### Verify Module Federation
Check bahwa remoteEntry.js tersedia:
```bash
curl http://localhost:4200/remoteEntry.js
```

Atau buka di browser: http://localhost:4200/remoteEntry.js

**Expected:** File JavaScript dengan Module Federation code

### Test Standalone
Buka http://localhost:4200 untuk test login form standalone (tanpa host)

## 🔌 Integration dengan Next.js Host

### 1. Install di Next.js
Package yang diperlukan: `@module-federation/nextjs-mf`

### 2. Configure Next.js
Update `next.config.js` dengan NextFederationPlugin:
- Remote name: `remoteLogin`
- Remote URL: `remoteLogin@http://localhost:4200/remoteEntry.js`

### 3. Load Web Component di Next.js
- Import remote: `import('remoteLogin/webcomponent')`
- Render element: `<angular-login ref={loginRef} />`
- Add event listener untuk `loginSubmit`
- Handle authentication di Next.js side
- Cleanup listener on unmount

### 4. Control State dari Host
Gunakan ref untuk access public methods:
- `loginRef.current?.setError('message')`
- `loginRef.current?.setLoading(true/false)`

### 5. TypeScript Declaration (Optional)
Buat type definition untuk `angular-login` custom element di file `.d.ts`

## 📂 Project Structure

```
competition-v1-remote-login/
├── src/
│   ├── app/
│   │   ├── login/
│   │   │   ├── login.component.ts      # Login component (exposed)
│   │   │   ├── login.component.html    # Login UI (Tailwind)
│   │   │   └── login.component.scss
│   │   └── app.config.ts               # App providers (HttpClient)
│   ├── main.ts                          # Entry point (lazy load bootstrap)
│   ├── bootstrap.ts                     # Web Component registration
│   └── styles.scss                      # Global styles
├── webpack.config.js                    # Module Federation config ⚡
├── angular.json                         # Angular CLI + custom webpack
├── package.json
├── tsconfig.json
└── tailwind.config.js
```

## 🔧 Build for Production

```bash
npm run build
```

Output di: `dist/competition-v1-remote-login/`

**Important files:**
- `remoteEntry.js` - Module Federation entry point
- `main.*.js` - Application bundle
- `*.js` - Shared chunks

## ✅ Verification Checklist

- [ ] Angular server running di port 4200
- [ ] remoteEntry.js accessible: http://localhost:4200/remoteEntry.js
- [ ] Login form terlihat di http://localhost:4200
- [ ] Form validation berfungsi (email, password)
- [ ] Console log "✅ Web Component 'angular-login' registered successfully"
- [ ] Next.js host bisa load remote tanpa error
- [ ] Event `loginSubmit` ter-emit dengan benar
- [ ] No CORS errors di browser console

## 🐛 Troubleshooting

### Issue: remoteEntry.js 404
**Cause:** Custom webpack config tidak ter-load

**Solution:**
1. Check `angular.json` → `customWebpackConfig.path` pointing ke `./webpack.config.js`
2. Restart dev server: `ng serve --port 4200`

### Issue: Web Component not defined
**Cause:** Bootstrap belum execute atau sudah ada element dengan nama sama

**Solution:**
1. Check console untuk error di `bootstrap.ts`
2. Pastikan `import('remoteLogin/webcomponent')` dipanggil di Next.js
3. Check `customElements.get('angular-login')` return undefined sebelum define

### Issue: CORS Error
**Cause:** Next.js host tidak bisa akses Angular remote

**Solution:**
Check `angular.json` → `serve.options.headers` sudah include CORS headers

### Issue: Event tidak ter-emit
**Cause:** Event listener belum ready atau salah event name

**Solution:**
1. Check `composed: true` di CustomEvent (required untuk Web Components)
2. Check event name: `loginSubmit` (case-sensitive)
3. Add listener SETELAH web component loaded

## 🎯 Key Decisions

### Why Web Component instead of direct Angular integration?
- ✅ Next.js (React) tidak compatible langsung dengan Angular
- ✅ Web Components adalah framework-agnostic
- ✅ Clean API boundary dengan Custom Events
- ✅ Zero coupling antara Angular dan Next.js

### Why Event-Based Communication?
- ✅ Loose coupling: Angular tidak perlu tahu tentang Next.js
- ✅ Host handle authentication logic (session, token, redirect)
- ✅ Angular fokus hanya ke UI/UX
- ✅ Easy testing: mock event dispatcher

### Why Module Federation?
- ✅ Runtime loading: tidak perlu rebuild host saat remote update
- ✅ Shared dependencies: avoid duplicate Angular bundles
- ✅ Independent deployment: Angular dan Next.js deploy terpisah
- ✅ Scalable: bisa tambah remote lain (register, profile, etc.)

## 📝 Notes

1. **Port 4200 harus available** saat development
2. **Order matters**: Load web component sebelum render di DOM
3. **TypeScript types**: Web component tidak punya type safety by default
4. **Production**: Deploy Angular remote terpisah, update URL di Next.js config
5. **Testing**: Test Angular standalone dulu sebelum integrate ke Next.js

## 🔗 Related Documentation

- [Angular Elements](https://angular.dev/guide/elements)
- [Webpack Module Federation](https://webpack.js.org/concepts/module-federation/)
- [@angular-builders/custom-webpack](https://github.com/just-jeb/angular-builders/tree/master/packages/custom-webpack)
- [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)

---

**Status:** ✅ Ready for Integration
**Last Updated:** 2025-11-25
