---
sidebar_position: 2.5
---

# NeXT Desktop

NeXT Desktop is the desktop client made for this panel, for Windows, macOS and Linux. You add your subscription once and press **Connect**. It shows your traffic, class and expiry date on its home page, and it keeps the subscription up to date on its own.

It runs one of two proxy engines, sing-box or mihomo, both included, and you can switch between them at any time. Both use the configuration the site generates for you, so the nodes, groups and rules are the same as in any other client.

## Installing it

On the dashboard, open the subscription card and choose your platform's tab. If the site offers NeXT Desktop, it has a **Download NeXT Desktop** button there.

Platform | What you get | Before the first start
---------|--------------|-----------------------
Windows 10 or 11, x64 | An installer | Run it. It installs for your account only and does not ask for administrator rights
macOS 14 or later, Apple silicon | A disk image | Drag the app to Applications. It is not notarized, so the first time, right-click it and choose **Open**, or run `xattr -dr com.apple.quarantine "/Applications/NeXT Desktop.app"` in Terminal
Linux x86_64, glibc 2.34 or later | An AppImage | Make it executable with `chmod +x NeXT-Desktop.AppImage`, then start it

Builds also exist for Windows on ARM, Intel Macs and 64-bit ARM Linux, plus a portable Windows version. If the dashboard does not offer the one you need, ask the site's support.

## Adding your subscription

On the dashboard, in your platform's tab, press **Import into NeXT Desktop**. The app opens and asks whether to add the subscription; say yes. If you import again later, it updates the subscription you already have instead of adding a second one.

If the button does nothing, your copy of NeXT Desktop is version 1.0.0, which predates import links, or you are running the portable Windows version, which does not register them. Add the subscription by hand instead:

1. Press **Copy the Json subscription link** next to NeXT Desktop.
2. In NeXT Desktop, open **Profiles**, paste the link and press **Add**.

Any of your universal links works. NeXT Desktop recognises a Clash or SingBox link from the same site and fetches what it needs either way. Do not use a client subscription (V2Ray, Trojan and the like): those carry one protocol only and no account details.

## Connecting

On **Home**, press **Connect**. With **Set system proxy** on, the default, your browser uses the connection straight away. Apps that ignore the system proxy can be pointed at `127.0.0.1:7890`, which accepts both HTTP and SOCKS5.

On **Nodes**, choose a group and click the node you want. Your choices are remembered for each subscription. You can pick nodes while disconnected; they take effect when you connect.

**Mode** on the home page switches between:

Mode | What goes through the proxy
-----|-----------------------------
Rule | Whatever the site's rules send there. Local and domestic traffic goes direct. The usual choice
Global | Everything
Direct | Nothing. Handy for checking whether a problem is the proxy

## TUN mode

Some apps, including many games and command-line tools, ignore the system proxy. **TUN mode** (in **Settings**) captures all traffic, so they go through the connection too. It needs elevated rights:

- **Windows**: NeXT Desktop restarts itself as administrator, after a UAC prompt.
- **macOS and Linux**: it asks for your password once, to let the engine create the network device. After an engine update it asks again.

## Keeping it current

NeXT Desktop refreshes the subscription every 6 hours. Change the interval under **Settings** → **Update subscriptions every**. A connection that is already running picks up the change when you reconnect. To refresh by hand, for example because support has told you a node has changed, update the subscription on **Profiles** and reconnect.

## Settings worth knowing

- **Start with system**, **Start minimized to tray** and **Connect on launch** together give you a connection that is simply there after you log in.
- **Keep running in the tray when closed** keeps the connection up after you close the window. Quit from the tray icon.
- **Core** switches between sing-box and mihomo. If one will not connect, try the other, and tell the site's support which one failed.
- **Language**: English, 简体中文 and 繁體中文. Light and dark themes follow your system or the switch in the sidebar.

## Where your data lives

OS | Folder
---|-------
Windows | `%APPDATA%\NeXT Desktop`
macOS | `~/Library/Application Support/NeXT Desktop`
Linux | `~/.local/share/next-desktop`

The `logs` folder in it is what support may ask for if something goes wrong. **Logs** in the app shows the same.

The system proxy is restored when you disconnect or quit, and on the next start if NeXT Desktop ever crashes while connected.
