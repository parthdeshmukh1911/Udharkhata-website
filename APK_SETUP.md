# How to Add APK Download Link

## Option 1: Host on GitHub Releases
1. Go to your GitHub repository
2. Click on "Releases" → "Create a new release"
3. Upload your APK file (e.g., `UdharKhataPlus.apk`)
4. Publish the release
5. Copy the download URL
6. Update the link in `dashboard.html` line with the button onclick

Example URL format:
```
https://github.com/USERNAME/REPO/releases/download/v1.0.0/UdharKhataPlus.apk
```

## Option 2: Host in Same Repository
1. Create a folder: `Udharkhata-website/downloads/`
2. Place your APK file there: `UdharKhataPlus.apk`
3. Update the button to:
```javascript
onclick="window.open('downloads/UdharKhataPlus.apk', '_blank')"
```

## Option 3: Use Google Drive
1. Upload APK to Google Drive
2. Make it publicly accessible
3. Get the shareable link
4. Update the button with the link

## Current Button Location
File: `dashboard.html`
Search for: "Download App" button
Update the `onclick` attribute with your APK URL

## Note
Make sure to:
- Test the download link before deploying
- Keep the APK file updated with latest version
- Consider using version numbers in filename (e.g., UdharKhataPlus-v1.0.0.apk)
